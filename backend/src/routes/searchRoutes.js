const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { searchSpotifyTracks } = require('../controllers/searchController');

const router = express.Router();

// Rota para buscar músicas no Spotify
// Protegida pelo middleware de autenticação
router.get('/', authenticateToken, searchSpotifyTracks);

module.exports = router;
