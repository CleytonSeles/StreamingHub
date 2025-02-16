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

// Middleware CORS
app.use(cors()); // Adicionar o middleware CORS

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Registrar rotas
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/playlists', playlistRoutes);

// Definir a porta do servidor
const PORT = process.env.PORT || 5000;

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
