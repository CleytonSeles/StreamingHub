const express = require('express');
const { createVideo, getAllVideos, updateVideo, deleteVideo } = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Criar vídeo
router.post('/', authMiddleware, createVideo);

// Obter todos os vídeos
router.get('/', getAllVideos);

// Atualizar vídeo
router.put('/:id', authMiddleware, updateVideo);

// Excluir vídeo
router.delete('/:id', authMiddleware, deleteVideo);

module.exports = router;

