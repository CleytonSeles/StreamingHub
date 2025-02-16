const express = require('express');
const { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist } = require('../controllers/playlistController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Criar playlist
router.post('/', authMiddleware, createPlaylist);

// Obter todas as playlists
router.get('/', getAllPlaylists);

// Atualizar playlist
router.put('/:id', authMiddleware, updatePlaylist);

// Excluir playlist
router.delete('/:id', authMiddleware, deletePlaylist);

module.exports = router;


