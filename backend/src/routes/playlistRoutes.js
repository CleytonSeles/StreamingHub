const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist
} = require('../controllers/playlistController');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// @route   POST /api/playlists
// @desc    Create a new playlist
// @access  Private
router.post('/', createPlaylist);

// @route   GET /api/playlists
// @desc    Get all playlists for the authenticated user
// @access  Private
router.get('/', getUserPlaylists);

// @route   GET /api/playlists/:id
// @desc    Get a specific playlist by ID
// @access  Private
router.get('/:id', getPlaylistById);

// @route   PUT /api/playlists/:id
// @desc    Update a playlist
// @access  Private
router.put('/:id', updatePlaylist);

// @route   DELETE /api/playlists/:id
// @desc    Delete a playlist
// @access  Private
router.delete('/:id', deletePlaylist);

// @route   POST /api/playlists/:playlistId/tracks
// @desc    Add a track to a playlist
// @access  Private
router.post('/:playlistId/tracks', addTrackToPlaylist);

// @route   DELETE /api/playlists/:playlistId/tracks/:trackId
// @desc    Remove a track from a playlist
// @access  Private
router.delete('/:playlistId/tracks/:trackId', removeTrackFromPlaylist);

module.exports = router;