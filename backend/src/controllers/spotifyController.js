const { searchTracks } = require('../services/spotifyService');

// @desc    Search for tracks on Spotify
// @route   GET /api/spotify/search
// @access  Private
const searchSpotifyTracks = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Please provide a search query.' });
  }

  // O middleware spotifyAuthMiddleware já verificou e atualizou o token se necessário
  const accessToken = req.user.spotifyAccessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'User not authenticated with Spotify. Please connect your Spotify account.' });
  }

  try {
    console.log('🔍 Searching Spotify tracks with query:', query);
    const tracks = await searchTracks(query, accessToken);
    console.log('✅ Found', tracks.length, 'tracks');
    res.status(200).json(tracks);
  } catch (error) {
    console.error('❌ Error searching Spotify tracks:', error.message);
    // Verificar se o erro é devido a token inválido/expirado e fornecer uma mensagem mais útil
    if (error.statusCode === 401) {
      return res.status(401).json({ message: 'Spotify access token invalid or expired. Please re-authenticate with Spotify.' });
    }
    res.status(500).json({ message: 'Failed to search Spotify tracks.' });
  }
};

module.exports = {
  searchSpotifyTracks,
};
