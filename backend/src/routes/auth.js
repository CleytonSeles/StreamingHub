const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { 
  registerUser, 
  loginUser, 
  getMe, 
  spotifyLogin, 
  spotifyCallback 
} = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const prisma = new PrismaClient();

const router = express.Router();

// @route   POST /auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   GET /auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, getMe);

// @route   PUT /auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    // Buscar usuário com senha
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Inicia autenticação com Spotify
router.get('/spotify', spotifyLogin);

// Callback do Spotify após autorização
router.get('/spotify/callback', spotifyCallback);

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
