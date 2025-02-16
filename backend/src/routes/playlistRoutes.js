const express = require('express');
const { createPlaylist, getAllPlaylists, updatePlaylist, deletePlaylist } = require('../controllers/playlistController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para criar uma nova playlist
// Utiliza o middleware de autenticação para garantir que o usuário esteja autenticado
router.post('/', authMiddleware, createPlaylist);

// Rota para obter todas as playlists
router.get('/', getAllPlaylists);

// Rota para atualizar uma playlist existente
// Utiliza o middleware de autenticação para garantir que o usuário esteja autenticado
router.put('/:id', authMiddleware, updatePlaylist);

// Rota para excluir uma playlist existente
// Utiliza o middleware de autenticação para garantir que o usuário esteja autenticado
router.delete('/:id', authMiddleware, deletePlaylist);

// Exportação do roteador para ser utilizado em outras partes da aplicação
module.exports = router;


