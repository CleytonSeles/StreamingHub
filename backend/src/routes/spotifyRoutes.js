const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const spotifyService = require('../services/spotifyService');

const router = express.Router();

// Status do serviço Spotify (público para debug)
router.get('/status', async (req, res) => {
  try {
    const status = await spotifyService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Erro ao verificar status do Spotify:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Aplicar autenticação às demais rotas
router.use(authenticateToken);

// @desc    Search for tracks, artists, albums
// @route   GET /api/spotify/search
// @access  Public (funciona com ou sem autenticação)
router.get('/search', async (req, res) => {
  try {
    const { q: query, type = 'track,artist,album', limit = 20, offset = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Parâmetro de busca obrigatório',
        message: 'Forneça um termo de busca usando o parâmetro "q"' 
      });
    }

    const results = await spotifyService.search(query, type, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      query,
      type,
      limit: parseInt(limit),
      offset: parseInt(offset),
      configured: spotifyService.isSpotifyConfigured(),
      ...results
    });
  } catch (error) {
    console.error('Erro na busca Spotify:', error);
    res.status(500).json({ 
      error: 'Erro na busca',
      message: error.message 
    });
  }
});

// @desc    Search only tracks
// @route   GET /api/spotify/search/tracks
// @access  Public
router.get('/search/tracks', async (req, res) => {
  try {
    const { q: query, limit = 20, offset = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Parâmetro de busca obrigatório',
        message: 'Forneça um termo de busca usando o parâmetro "q"' 
      });
    }

    const results = await spotifyService.searchTracks(query, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      query,
      type: 'track',
      limit: parseInt(limit),
      offset: parseInt(offset),
      configured: spotifyService.isSpotifyConfigured(),
      tracks: results
    });
  } catch (error) {
    console.error('Erro na busca de tracks:', error);
    res.status(500).json({ 
      error: 'Erro na busca de tracks',
      message: error.message 
    });
  }
});

// @desc    Search only artists
// @route   GET /api/spotify/search/artists
// @access  Public
router.get('/search/artists', async (req, res) => {
  try {
    const { q: query, limit = 20, offset = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Parâmetro de busca obrigatório',
        message: 'Forneça um termo de busca usando o parâmetro "q"' 
      });
    }

    const results = await spotifyService.searchArtists(query, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      query,
      type: 'artist',
      limit: parseInt(limit),
      offset: parseInt(offset),
      configured: spotifyService.isSpotifyConfigured(),
      artists: results
    });
  } catch (error) {
    console.error('Erro na busca de artistas:', error);
    res.status(500).json({ 
      error: 'Erro na busca de artistas',
      message: error.message 
    });
  }
});

// @desc    Search only albums
// @route   GET /api/spotify/search/albums
// @access  Public
router.get('/search/albums', async (req, res) => {
  try {
    const { q: query, limit = 20, offset = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Parâmetro de busca obrigatório',
        message: 'Forneça um termo de busca usando o parâmetro "q"' 
      });
    }

    const results = await spotifyService.searchAlbums(query, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      query,
      type: 'album',
      limit: parseInt(limit),
      offset: parseInt(offset),
      configured: spotifyService.isSpotifyConfigured(),
      albums: results
    });
  } catch (error) {
    console.error('Erro na busca de álbuns:', error);
    res.status(500).json({ 
      error: 'Erro na busca de álbuns',
      message: error.message 
    });
  }
});

// @desc    Get track details
// @route   GET /api/spotify/track/:id
// @access  Public
router.get('/track/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const track = await spotifyService.getTrack(id);
    
    res.json({
      success: true,
      configured: spotifyService.isSpotifyConfigured(),
      track
    });
  } catch (error) {
    console.error('Erro ao obter track:', error);
    res.status(404).json({ 
      error: 'Track não encontrada',
      message: error.message 
    });
  }
});

// @desc    Get multiple tracks
// @route   GET /api/spotify/tracks
// @access  Public
router.get('/tracks', async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ 
        error: 'IDs obrigatórios',
        message: 'Forneça os IDs das tracks separados por vírgula usando o parâmetro "ids"' 
      });
    }

    const trackIds = ids.split(',').map(id => id.trim());
    const results = await spotifyService.getTracks(trackIds);
    
    res.json({
      success: true,
      configured: spotifyService.isSpotifyConfigured(),
      ...results
    });
  } catch (error) {
    console.error('Erro ao obter tracks:', error);
    res.status(500).json({ 
      error: 'Erro ao obter tracks',
      message: error.message 
    });
  }
});

// @desc    Get popular tracks
// @route   GET /api/spotify/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const results = await spotifyService.getPopularTracks(parseInt(limit));
    
    res.json({
      success: true,
      configured: spotifyService.isSpotifyConfigured(),
      limit: parseInt(limit),
      ...results
    });
  } catch (error) {
    console.error('Erro ao obter tracks populares:', error);
    res.status(500).json({ 
      error: 'Erro ao obter tracks populares',
      message: error.message 
    });
  }
});

// @desc    Get artist details
// @route   GET /api/spotify/artist/:id
// @access  Public
router.get('/artist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await spotifyService.getArtist(id);
    
    res.json({
      success: true,
      configured: spotifyService.isSpotifyConfigured(),
      artist
    });
  } catch (error) {
    console.error('Erro ao obter artista:', error);
    res.status(404).json({ 
      error: 'Artista não encontrado',
      message: error.message 
    });
  }
});

// @desc    Get artist top tracks
// @route   GET /api/spotify/artist/:id/top-tracks
// @access  Public
router.get('/artist/:id/top-tracks', async (req, res) => {
  try {
    const { id } = req.params;
    const { country = 'BR' } = req.query;
    const results = await spotifyService.getArtistTopTracks(id, country);
    
    res.json({
      success: true,
      configured: spotifyService.isSpotifyConfigured(),
      artistId: id,
      country,
      ...results
    });
  } catch (error) {
    console.error('Erro ao obter top tracks do artista:', error);
    res.status(500).json({ 
      error: 'Erro ao obter top tracks do artista',
      message: error.message 
    });
  }
});

module.exports = router;
