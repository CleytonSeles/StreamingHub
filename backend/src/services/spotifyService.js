const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Scopes necessários para a aplicação
const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify'
];

const getAuthURL = () => {
  return spotifyApi.createAuthorizeURL(scopes, 'streaming-app-state');
};

const getAccessToken = async (code) => {
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    
    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    };
  } catch (error) {
    throw new Error(`Error getting access token: ${error.message}`);
  }
};

const getUserProfile = async (accessToken) => {
  try {
    const tempSpotifyApi = new SpotifyWebApi();
    tempSpotifyApi.setAccessToken(accessToken);
    
    const data = await tempSpotifyApi.getMe();
    return data.body;
  } catch (error) {
    throw new Error(`Error getting user profile: ${error.message}`);
  }
};

module.exports = {
  getAuthURL,
  getAccessToken,
  getUserProfile,
  spotifyApi
};

