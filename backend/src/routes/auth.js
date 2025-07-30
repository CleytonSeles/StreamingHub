const express = require('express');
const { spotifyLogin, spotifyCallback } = require('../controllers/authController');

const router = express.Router();

// Inicia autenticação com Spotify
router.get('/spotify', spotifyLogin);

// Callback do Spotify após autorização
router.get('/callback', spotifyCallback);

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
