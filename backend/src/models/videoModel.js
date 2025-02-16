const mongoose = require('mongoose');

// Definição do esquema (schema) para a coleção de vídeos
const videoSchema = new mongoose.Schema({
  // Título do vídeo, obrigatório e com espaços em branco removidos das extremidades
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // Descrição do vídeo, obrigatória
  description: {
    type: String,
    required: true,
  },
  // URL do vídeo, obrigatória
  url: {
    type: String,
    required: true,
  },
  // Data de criação do vídeo, com valor padrão sendo a data atual
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Criação do modelo Video com base no esquema definido
const Video = mongoose.model('Video', videoSchema);

// Exportação do modelo Video para ser utilizado em outras partes da aplicação
module.exports = Video;
