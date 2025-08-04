const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
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
