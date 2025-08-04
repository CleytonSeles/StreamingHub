const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const {
  addFavorite,
  removeFavorite,
} = require('../controllers/playlistController');

const router = express.Router();
const prisma = new PrismaClient();

// Todas as rotas da API precisam de autenticação
router.use(authenticateToken);

// Perfil do usuário
router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

// Atualizar perfil do usuário
router.put('/profile', async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    const userId = req.user.id;

    // Verificar se o email já está em uso por outro usuário
    if (email && email !== req.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        spotifyId: true,
        createdAt: true
      }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Exportar dados do usuário
router.get('/user/export', async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, playlists, favorites] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.playlist.findMany({
        where: { userId },
        include: {
          tracks: {
            include: {
              track: true
            }
          }
        }
      }),
      prisma.favorite.findMany({
        where: { userId },
        include: {
          track: true
        }
      })
    ]);

    const exportData = {
      user,
      playlists: playlists.map(playlist => ({
        ...playlist,
        tracks: playlist.tracks.map(pt => pt.track)
      })),
      favorites: favorites.map(fav => fav.track),
      exportedAt: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="meus-dados-musicais.json"');
    res.json(exportData);
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



// Listar favoritos (com include para dados da música)
router.get('/favorites', async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { track: true }, // Inclui os dados da música
      orderBy: { addedAt: 'desc' }
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Adicionar música aos favoritos
router.post('/favorites', addFavorite);

// Remover música dos favoritos
router.delete('/favorites/:trackId', removeFavorite);

module.exports = router;
