const express = require('express');
const { createVideo, getAllVideos, updateVideo, deleteVideo } = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para criar um novo vídeo
// Utiliza o middleware de autenticação para garantir que o usuário esteja autenticado
router.post('/', authMiddleware, createVideo);

// Rota para obter todos os vídeos
router.get('/', getAllVideos);

// Rota para atualizar um vídeo existente
// Utiliza o middleware de autenticação para garantir que o usuário esteja autenticado
router.put('/:id', authMiddleware, updateVideo);

// Rota para excluir um vídeo existente
// Utiliza o middleware de autenticação para garantir que o usuário esteja autenticado
router.delete('/:id', authMiddleware, deleteVideo);

// Exportação do roteador para ser utilizado em outras partes da aplicação
module.exports = router;


