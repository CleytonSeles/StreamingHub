const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to req.user
      // Incluir spotifyAccessToken e spotifyRefreshToken
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
          spotifyId: true,
          spotifyAccessToken: true,   // Selecionar o accessToken
          spotifyRefreshToken: true,  // Selecionar o refreshToken
        }
      });

      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { authenticateToken };
