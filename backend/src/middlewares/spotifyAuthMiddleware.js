const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { refreshAccessToken } = require('../services/spotifyService');

const spotifyAuthMiddleware = async (req, res, next) => {
  // Este middleware depende que o `req.user` já esteja populado pelo middleware de autenticação principal (JWT)
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Not authorized, user ID not found in request' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        spotifyAccessToken: true,
        spotifyRefreshToken: true,
        spotifyAccessTokenExpiresAt: true,
      },
    });

    if (!user || !user.spotifyAccessToken || !user.spotifyRefreshToken || !user.spotifyAccessTokenExpiresAt) {
      // O usuário não tem tokens Spotify ou eles estão incompletos.
      // Pode ser um usuário que não se autenticou com o Spotify.
      // Permite que a requisição prossiga, mas o controlador precisará lidar com a falta de tokens.
      // Ou, se a rota *exige* Spotify, pode-se retornar um erro aqui.
      // Por enquanto, vamos apenas passar, assumindo que o controlador irá checar.
      return next();
    }

    const now = new Date();
    const expiresAt = new Date(user.spotifyAccessTokenExpiresAt);

    // Damos uma margem de segurança de 5 minutos (300.000 milissegundos)
    // Se o token expirar nos próximos 5 minutos, ou já expirou, vamos refrescá-lo.
    const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

    if (expiresAt.getTime() - now.getTime() < FIVE_MINUTES_IN_MS) {
      console.log('Spotify token is expired or near expiration. Attempting to refresh...');
      try {
        const { accessToken, refreshToken, expiresIn } = await refreshAccessToken(user.spotifyRefreshToken);

        // Calcular a nova data de expiração
        const newExpiresAt = new Date(Date.now() + expiresIn * 1000);

        // Atualizar o usuário no banco de dados com os novos tokens
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            spotifyAccessToken: accessToken,
            spotifyRefreshToken: refreshToken, // Pode ser o mesmo ou um novo
            spotifyAccessTokenExpiresAt: newExpiresAt,
          },
        });
        console.log('Spotify token refreshed successfully.');
        req.user.spotifyAccessToken = accessToken; // Atualiza o token no objeto req.user para uso imediato
      } catch (refreshError) {
        console.error('Failed to refresh Spotify token:', refreshError.message);
        // Se o refresh falhar (ex: refresh token inválido), invalidar os tokens existentes
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            spotifyAccessToken: null,
            spotifyRefreshToken: null,
            spotifyAccessTokenExpiresAt: null,
          },
        });
        return res.status(401).json({ message: 'Spotify token refresh failed. Please re-authenticate with Spotify.' });
      }
    } else {
      // Token ainda válido, apenas anexa ao req.user para consistência
      req.user.spotifyAccessToken = user.spotifyAccessToken;
    }

    next(); // Continua para a próxima função middleware ou rota
  } catch (error) {
    console.error('Error in spotifyAuthMiddleware:', error.message);
    res.status(500).json({ message: 'Internal server error during Spotify token check.' });
  }
};

module.exports = spotifyAuthMiddleware;
