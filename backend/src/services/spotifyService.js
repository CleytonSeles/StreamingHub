/**
 * Serviço Principal do Spotify
 * Integra com a API real do Spotify ou usa o serviço mock
 */

const axios = require('axios');
const spotifyConfig = require('../config/spotify');
const spotifyMockService = require('./spotifyMockService');

class SpotifyService {
  constructor() {
    this.baseURL = spotifyConfig.config.apiBaseUrl;
    this.authURL = spotifyConfig.config.authBaseUrl;
    this.isConfigured = spotifyConfig.isSpotifyAvailable();
    this.mockService = require('./spotifyMockService');
    this.accessToken = null;
    this.tokenExpiry = null;
    
    // Rate limiting
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.lastRequestTime = 0;
    this.requestCount = 0;
    this.rateLimitRemaining = 100;
    this.rateLimitReset = Date.now() + (60 * 1000); // 1 minuto no futuro
  }

  /**
   * Verifica se o serviço está configurado
   * @returns {boolean} Status da configuração
   */
  isSpotifyConfigured() {
    return this.isConfigured;
  }

  /**
   * Obtém token de acesso do Spotify
   * @returns {Promise<string>} Token de acesso
   */
  async getAccessToken() {
    if (!this.isConfigured) {
      throw new Error('Spotify não configurado');
    }

    // Verifica se o token ainda é válido
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(spotifyConfig.TOKEN_URL, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${spotifyConfig.CLIENT_ID}:${spotifyConfig.CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 minuto de margem

      return this.accessToken;
    } catch (error) {
      console.error('Erro ao obter token do Spotify:', error.response?.data || error.message);
      throw new Error('Falha na autenticação com Spotify');
    }
  }

  /**
   * Faz requisição para a API do Spotify
   * @param {string} endpoint - Endpoint da API
   * @param {object} params - Parâmetros da requisição
   * @returns {Promise<object>} Resposta da API
   */
  async makeSpotifyRequest(endpoint, params = {}) {
    if (!this.isConfigured) {
      throw new Error('Spotify não configurado');
    }

    // Verifica rate limit
    if (this.rateLimitRemaining <= 0 && Date.now() < this.rateLimitReset) {
      const waitTime = this.rateLimitReset - Date.now();
      throw new Error(`Rate limit excedido. Tente novamente em ${Math.ceil(waitTime / 1000)} segundos`);
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${spotifyConfig.API_BASE_URL}${endpoint}`, {
        headers: spotifyConfig.getAuthHeaders(token),
        params
      });

      // Atualiza informações de rate limit
      this.rateLimitRemaining = parseInt(response.headers['x-ratelimit-remaining'] || '100');
      this.rateLimitReset = Date.now() + (parseInt(response.headers['x-ratelimit-reset'] || '60') * 1000);

      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after'] || '60');
        this.rateLimitReset = Date.now() + (retryAfter * 1000);
        this.rateLimitRemaining = 0;
        throw new Error(`Rate limit excedido. Tente novamente em ${retryAfter} segundos`);
      }
      
      console.error('Erro na requisição Spotify:', error.response?.data || error.message);
      throw new Error('Erro na comunicação com Spotify');
    }
  }

  /**
   * Busca músicas, artistas e álbuns
   * @param {string} query - Termo de busca
   * @param {string} type - Tipos de busca (track,artist,album)
   * @param {number} limit - Limite de resultados
   * @param {number} offset - Offset para paginação
   * @returns {Promise<object>} Resultados da busca
   */
  async search(query, type = 'track,artist,album', limit = 20, offset = 0) {
    if (!this.isConfigured) {
      console.log('Spotify não configurado, usando dados mock');
      return await spotifyMockService.search(query, type, limit, offset);
    }

    try {
      return await this.makeSpotifyRequest('/search', {
        q: query,
        type: type,
        limit: Math.min(limit, 50), // Spotify limita a 50
        offset: offset
      });
    } catch (error) {
      console.warn('Erro na busca Spotify, usando dados mock:', error.message);
      return await spotifyMockService.search(query, type, limit, offset);
    }
  }

  /**
   * Busca apenas tracks
   * @param {string} query - Termo de busca
   * @param {number} limit - Limite de resultados
   * @param {number} offset - Offset para paginação
   * @returns {Promise<object>} Tracks encontradas
   */
  async searchTracks(query, limit = 20, offset = 0) {
    const results = await this.search(query, 'track', limit, offset);
    return results.tracks || { items: [], total: 0 };
  }

  /**
   * Busca apenas artistas
   * @param {string} query - Termo de busca
   * @param {number} limit - Limite de resultados
   * @param {number} offset - Offset para paginação
   * @returns {Promise<object>} Artistas encontrados
   */
  async searchArtists(query, limit = 20, offset = 0) {
    const results = await this.search(query, 'artist', limit, offset);
    return results.artists || { items: [], total: 0 };
  }

  /**
   * Busca apenas álbuns
   * @param {string} query - Termo de busca
   * @param {number} limit - Limite de resultados
   * @param {number} offset - Offset para paginação
   * @returns {Promise<object>} Álbuns encontrados
   */
  async searchAlbums(query, limit = 20, offset = 0) {
    const results = await this.search(query, 'album', limit, offset);
    return results.albums || { items: [], total: 0 };
  }

  /**
   * Obtém detalhes de uma track específica
   * @param {string} trackId - ID da track
   * @returns {Promise<object>} Detalhes da track
   */
  async getTrack(trackId) {
    if (!this.isConfigured) {
      return await spotifyMockService.getTrack(trackId);
    }

    try {
      return await this.makeSpotifyRequest(`/tracks/${trackId}`);
    } catch (error) {
      console.warn('Erro ao obter track do Spotify, usando dados mock:', error.message);
      return await spotifyMockService.getTrack(trackId);
    }
  }

  /**
   * Obtém múltiplas tracks
   * @param {string[]} trackIds - Array de IDs das tracks
   * @returns {Promise<object>} Tracks solicitadas
   */
  async getTracks(trackIds) {
    if (!this.isConfigured) {
      const tracks = await Promise.all(
        trackIds.map(id => spotifyMockService.getTrack(id).catch(() => null))
      );
      return { tracks: tracks.filter(Boolean) };
    }

    try {
      return await this.makeSpotifyRequest('/tracks', {
        ids: trackIds.join(',')
      });
    } catch (error) {
      console.warn('Erro ao obter tracks do Spotify, usando dados mock:', error.message);
      const tracks = await Promise.all(
        trackIds.map(id => spotifyMockService.getTrack(id).catch(() => null))
      );
      return { tracks: tracks.filter(Boolean) };
    }
  }

  /**
   * Obtém tracks populares (simulado para desenvolvimento)
   * @param {number} limit - Limite de resultados
   * @returns {Promise<object>} Tracks populares
   */
  async getPopularTracks(limit = 20) {
    if (!this.isConfigured) {
      return await spotifyMockService.getPopularTracks(limit);
    }

    try {
      // Para API real, podemos usar playlists populares ou featured playlists
      const results = await this.makeSpotifyRequest('/browse/featured-playlists', {
        limit: 1
      });
      
      if (results.playlists?.items?.length > 0) {
        const playlistId = results.playlists.items[0].id;
        const tracks = await this.makeSpotifyRequest(`/playlists/${playlistId}/tracks`, {
          limit: limit
        });
        
        return {
          tracks: tracks.items?.map(item => item.track).filter(Boolean) || []
        };
      }
      
      // Fallback para mock se não conseguir obter playlists
      return await spotifyMockService.getPopularTracks(limit);
    } catch (error) {
      console.warn('Erro ao obter tracks populares do Spotify, usando dados mock:', error.message);
      return await spotifyMockService.getPopularTracks(limit);
    }
  }

  /**
   * Obtém informações sobre o artista
   * @param {string} artistId - ID do artista
   * @returns {Promise<object>} Informações do artista
   */
  async getArtist(artistId) {
    if (!this.isConfigured) {
      const artist = spotifyMockService.mockArtists.find(a => a.id === artistId);
      if (!artist) throw new Error('Artista não encontrado');
      return artist;
    }

    try {
      return await this.makeSpotifyRequest(`/artists/${artistId}`);
    } catch (error) {
      console.warn('Erro ao obter artista do Spotify:', error.message);
      const artist = spotifyMockService.mockArtists.find(a => a.id === artistId);
      if (!artist) throw new Error('Artista não encontrado');
      return artist;
    }
  }

  /**
   * Obtém top tracks de um artista
   * @param {string} artistId - ID do artista
   * @param {string} country - Código do país (padrão: BR)
   * @returns {Promise<object>} Top tracks do artista
   */
  async getArtistTopTracks(artistId, country = 'BR') {
    if (!this.isConfigured) {
      // Retorna algumas tracks mock para o artista
      const artistTracks = spotifyMockService.mockTracks.filter(track => 
        track.artists.some(artist => artist.id === artistId)
      );
      return { tracks: artistTracks };
    }

    try {
      return await this.makeSpotifyRequest(`/artists/${artistId}/top-tracks`, {
        country: country
      });
    } catch (error) {
      console.warn('Erro ao obter top tracks do artista:', error.message);
      const artistTracks = spotifyMockService.mockTracks.filter(track => 
        track.artists.some(artist => artist.id === artistId)
      );
      return { tracks: artistTracks };
    }
  }

  /**
   * Retorna status do serviço
   * @returns {object} Status do serviço Spotify
   */
  getStatus() {
    if (!this.isConfigured) {
      return {
        ...spotifyMockService.getStatus(),
        configured: false,
        message: 'Spotify não configurado - usando dados mock'
      };
    }

    return {
      service: 'spotify',
      configured: true,
      available: true,
      message: 'Spotify configurado e disponível',
      rateLimitRemaining: this.rateLimitRemaining || 100,
      rateLimitReset: this.rateLimitReset ? new Date(this.rateLimitReset).toISOString() : new Date().toISOString(),
      tokenValid: this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry,
      features: [
        'Busca de músicas',
        'Busca de artistas',
        'Busca de álbuns',
        'Detalhes de tracks',
        'Top tracks de artistas',
        'Tracks populares'
      ]
    };
  }

  /**
   * Gera URL de autorização para usuários (para futuras implementações)
   * @param {string} state - Estado para segurança
   * @returns {string} URL de autorização
   */
  getAuthorizationUrl(state) {
    if (!this.isConfigured) {
      throw new Error('Spotify não configurado');
    }
    return spotifyConfig.getAuthorizationUrl(state);
  }

  // Métodos de compatibilidade com a versão anterior
  isConfigured() {
    return this.isSpotifyConfigured();
  }

  getMockSearchResults(query, type, limit, offset) {
    return spotifyMockService.search(query, type, limit, offset);
  }

  getMockTrack(trackId) {
    return spotifyMockService.getTrack(trackId);
  }
}

// Exporta instância singleton
module.exports = new SpotifyService();
