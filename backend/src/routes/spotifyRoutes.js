const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const spotifyAuthMiddleware = require('../middlewares/spotifyAuthMiddleware'); // NOVO: Importar o middleware
const { searchSpotifyTracks } = require('../controllers/spotifyController');

// @desc    Search for tracks on Spotify
// @route   GET /api/spotify/search
// @access  Private (requires main app login and Spotify authentication)
router.get('/search', authenticateToken, spotifyAuthMiddleware, searchSpotifyTracks); // NOVO: Adicionar spotifyAuthMiddleware

module.exports = router;
