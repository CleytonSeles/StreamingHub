const mongoose = require('mongoose');

// Definição do esquema (schema) para a coleção de playlists
const playlistSchema = new mongoose.Schema({
  // Nome da playlist, obrigatório e com espaços em branco removidos das extremidades
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Descrição da playlist, opcional
  description: {
    type: String,
  },
  // Lista de vídeos associados à playlist, referenciando documentos na coleção de vídeos
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  // Data de criação da playlist, com valor padrão sendo a data atual
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Criação do modelo Playlist com base no esquema definido
const Playlist = mongoose.model('Playlist', playlistSchema);

// Exportação do modelo Playlist para ser utilizado em outras partes da aplicação
module.exports = Playlist;
