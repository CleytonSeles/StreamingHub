const { searchTracks } = require('../services/spotifyService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const searchSpotifyTracks = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id; // ID do usuário autenticado
    const accessToken = req.user.spotifyAccessToken; // Obter o accessToken do usuário

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!accessToken) {
      // Isso pode acontecer se o usuário não se autenticou via Spotify
      // ou se o token expirou e não foi refreshado (ainda não implementamos o refresh)
      return res.status(401).json({ error: 'Spotify access token not available for this user. Please link your Spotify account.' });
    }

    // Chamar a função de busca do spotifyService com o token do usuário
    const tracks = await searchTracks(query, accessToken);

    res.status(200).json(tracks); // Retorna os resultados da busca
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    // Erros da API do Spotify podem ter status específicos, como 401 para token expirado
    if (error.statusCode === 401) {
      return res.status(401).json({ error: 'Spotify access token expired or invalid. Please re-authenticate with Spotify.' });
    }
    res.status(500).json({ error: 'Failed to search Spotify tracks' });
  }
};

module.exports = {
  searchSpotifyTracks,
};
