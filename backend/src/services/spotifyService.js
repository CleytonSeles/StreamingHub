const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

// Configuração do Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Função para obter o Access Token inicial
const getAccessToken = async (code) => {
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Set the access token on the API object for future requests
    spotifyApi.setAccessToken(access_token);
    if (refresh_token) {
      spotifyApi.setRefreshToken(refresh_token);
    }

    return { accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in };
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
};

// Função para obter o perfil do usuário do Spotify
const getUserProfile = async (accessToken) => {
  try {
    spotifyApi.setAccessToken(accessToken); // Certifica que o token correto está sendo usado
    const data = await spotifyApi.getMe();
    return data.body;
  } catch (error) {
    console.error('Error getting user profile:', error.message);
    throw error;
  }
};

// Função para buscar músicas no Spotify
const searchTracks = async (query, accessToken) => {
  try {
    spotifyApi.setAccessToken(accessToken); // Define o token para a requisição
    const data = await spotifyApi.searchTracks(query, { limit: 10 });
    return data.body.tracks.items.map(track => ({
      spotifyTrackId: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      durationMs: track.duration_ms,
      imageUrl: track.album.images.length > 0 ? track.album.images[0].url : null,
      previewUrl: track.preview_url,
    }));
  } catch (error) {
    console.error('Error searching tracks:', error.message);
    // Propaga o erro para ser tratado no controller
    throw error;
  }
};

// Função para refrescar o Access Token
const refreshAccessToken = async (refreshToken) => {
  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    const { access_token, expires_in } = data.body;

    // O Spotify pode ou não retornar um novo refresh token.
    // Se retornar, devemos atualizar o nosso.
    const newRefreshToken = data.body.refresh_token || refreshToken;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(newRefreshToken); // Atualiza o refresh token no objeto API

    return { accessToken: access_token, refreshToken: newRefreshToken, expiresIn: expires_in };
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    throw error;
  }
};


module.exports = {
  getAccessToken,
  getUserProfile,
  searchTracks,
  spotifyApi, 
  refreshAccessToken, 
};
