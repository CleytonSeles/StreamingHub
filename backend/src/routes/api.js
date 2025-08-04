import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  addFavorite,
  removeFavorite,
} from '../controllers/playlistController.js';

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

// Adicionar música à playlist
router.post('/playlists/:playlistId/tracks', addTrackToPlaylist);

// Remover música da playlist
router.delete('/playlists/:playlistId/tracks/:trackId', removeTrackFromPlaylist);

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
