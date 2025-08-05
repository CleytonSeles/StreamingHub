require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const searchRoutes = require('./routes/searchRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Streaming API is running!',
    timestamp: new Date().toISOString()
  });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes); // Spotify routes primeiro (tem endpoint público)
app.use('/api/search', searchRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api', apiRoutes); // API routes por último (tem middleware global)

// Rota de teste
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Tratamento de erros (opcional, mas recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
