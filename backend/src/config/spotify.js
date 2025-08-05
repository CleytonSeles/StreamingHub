/**
 * Configuração do Spotify API
 * Módulo centralizado para gerenciar credenciais e configurações do Spotify
 */

const config = {
  // Credenciais do Spotify (configuradas via .env)
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  
  // URLs da API do Spotify
  apiBaseUrl: 'https://api.spotify.com/v1',
  authBaseUrl: 'https://accounts.spotify.com',
  
  // Scopes necessários para a aplicação
  scopes: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-top-read'
  ],
  
  // Configurações de token
  tokenExpiration: 3600, // 1 hora em segundos
  refreshTokenExpiration: 7776000, // 90 dias em segundos
  
  // Configurações de rate limiting
  rateLimits: {
    requestsPerSecond: 10,
    burstLimit: 100
  }
};

/**
 * Valida se as credenciais do Spotify estão configuradas
 * @returns {boolean} True se as credenciais estão válidas
 */
function validateCredentials() {
  const required = ['clientId', 'clientSecret', 'redirectUri'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Credenciais do Spotify não configuradas: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
}

/**
 * Retorna a URL de autorização do Spotify
 * @param {string} state - Estado para validação CSRF
 * @returns {string} URL de autorização
 */
function getAuthUrl(state = 'default') {
  if (!validateCredentials()) {
    throw new Error('Credenciais do Spotify não configuradas');
  }
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    scope: config.scopes.join(' '),
    redirect_uri: config.redirectUri,
    state: state,
    show_dialog: 'true'
  });
  
  return `${config.authBaseUrl}/authorize?${params.toString()}`;
}

/**
 * Retorna as configurações de headers para requisições autenticadas
 * @param {string} accessToken - Token de acesso do usuário
 * @returns {object} Headers para requisições
 */
function getAuthHeaders(accessToken) {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Retorna as configurações de headers para requisições de token
 * @returns {object} Headers para requisições de token
 */
function getTokenHeaders() {
  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
}

/**
 * Verifica se o Spotify está disponível
 * @returns {boolean} True se o Spotify está configurado e disponível
 */
function isSpotifyAvailable() {
  return validateCredentials();
}

/**
 * Retorna configuração mock para desenvolvimento sem Spotify
 * @returns {object} Configuração mock
 */
function getMockConfig() {
  return {
    enabled: false,
    message: 'Spotify não configurado - usando dados mock',
    mockData: {
      tracks: [
        {
          id: 'mock_1',
          name: 'Música de Exemplo 1',
          artists: [{ name: 'Artista Exemplo' }],
          album: { name: 'Álbum Exemplo', images: [{ url: '/api/placeholder/300/300' }] },
          duration_ms: 180000,
          preview_url: null
        },
        {
          id: 'mock_2',
          name: 'Música de Exemplo 2',
          artists: [{ name: 'Outro Artista' }],
          album: { name: 'Outro Álbum', images: [{ url: '/api/placeholder/300/300' }] },
          duration_ms: 210000,
          preview_url: null
        }
      ]
    }
  };
}

module.exports = {
  config,
  validateCredentials,
  getAuthUrl,
  getAuthHeaders,
  getTokenHeaders,
  isSpotifyAvailable,
  getMockConfig
};