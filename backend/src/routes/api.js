const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Todas as rotas da API precisam de autenticação
router.use(authenticateToken);

// Perfil do usuário
router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

// Listar playlists do usuário
router.get('/playlists', async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { tracks: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Criar playlist
router.post('/playlists', async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        isPublic: isPublic || false,
        userId: req.user.id
      }
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Listar favoritos
router.get('/favorites', async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { addedAt: 'desc' }
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

module.exports = router;
