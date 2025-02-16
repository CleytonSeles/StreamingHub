const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const videoRoutes = require('./src/routes/videoRoutes');
const playlistRoutes = require('./src/routes/playlistRoutes');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializar o aplicativo Express
const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Middleware CORS para permitir requisições de diferentes origens
app.use(cors());

// Conectar ao MongoDB usando a URI fornecida nas variáveis de ambiente
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Registrar rotas de autenticação
app.use('/api/auth', authRoutes);

// Registrar rotas de vídeos
app.use('/api/videos', videoRoutes);

// Registrar rotas de playlists
app.use('/api/playlists', playlistRoutes);

// Definir a porta do servidor, utilizando a porta fornecida nas variáveis de ambiente ou 5000 como padrão
const PORT = process.env.PORT || 5000;

// Iniciar o servidor e escutar na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
