import express from 'express';
import { spotifyLogin, spotifyCallback } from '../controllers/authController.js';

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
