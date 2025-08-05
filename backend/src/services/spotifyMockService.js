/**
 * Serviço Mock do Spotify
 * Fornece dados simulados quando as credenciais do Spotify não estão disponíveis
 */

const mockTracks = [
  {
    id: 'mock_track_1',
    name: 'Bohemian Rhapsody',
    artists: [{ name: 'Queen', id: 'mock_artist_1' }],
    album: {
      name: 'A Night at the Opera',
      id: 'mock_album_1',
      images: [
        { url: 'https://via.placeholder.com/640x640/1DB954/FFFFFF?text=Queen', height: 640, width: 640 },
        { url: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=Queen', height: 300, width: 300 },
        { url: 'https://via.placeholder.com/64x64/1DB954/FFFFFF?text=Queen', height: 64, width: 64 }
      ]
    },
    duration_ms: 355000,
    explicit: false,
    external_urls: { spotify: '#' },
    preview_url: null,
    popularity: 85,
    track_number: 11,
    type: 'track',
    uri: 'spotify:track:mock_track_1'
  },
  {
    id: 'mock_track_2',
    name: 'Imagine',
    artists: [{ name: 'John Lennon', id: 'mock_artist_2' }],
    album: {
      name: 'Imagine',
      id: 'mock_album_2',
      images: [
        { url: 'https://via.placeholder.com/640x640/FF6B35/FFFFFF?text=Lennon', height: 640, width: 640 },
        { url: 'https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Lennon', height: 300, width: 300 },
        { url: 'https://via.placeholder.com/64x64/FF6B35/FFFFFF?text=Lennon', height: 64, width: 64 }
      ]
    },
    duration_ms: 183000,
    explicit: false,
    external_urls: { spotify: '#' },
    preview_url: null,
    popularity: 90,
    track_number: 1,
    type: 'track',
    uri: 'spotify:track:mock_track_2'
  },
  {
    id: 'mock_track_3',
    name: 'Hotel California',
    artists: [{ name: 'Eagles', id: 'mock_artist_3' }],
    album: {
      name: 'Hotel California',
      id: 'mock_album_3',
      images: [
        { url: 'https://via.placeholder.com/640x640/F037A5/FFFFFF?text=Eagles', height: 640, width: 640 },
        { url: 'https://via.placeholder.com/300x300/F037A5/FFFFFF?text=Eagles', height: 300, width: 300 },
        { url: 'https://via.placeholder.com/64x64/F037A5/FFFFFF?text=Eagles', height: 64, width: 64 }
      ]
    },
    duration_ms: 391000,
    explicit: false,
    external_urls: { spotify: '#' },
    preview_url: null,
    popularity: 88,
    track_number: 1,
    type: 'track',
    uri: 'spotify:track:mock_track_3'
  },
  {
    id: 'mock_track_4',
    name: 'Billie Jean',
    artists: [{ name: 'Michael Jackson', id: 'mock_artist_4' }],
    album: {
      name: 'Thriller',
      id: 'mock_album_4',
      images: [
        { url: 'https://via.placeholder.com/640x640/7209B7/FFFFFF?text=MJ', height: 640, width: 640 },
        { url: 'https://via.placeholder.com/300x300/7209B7/FFFFFF?text=MJ', height: 300, width: 300 },
        { url: 'https://via.placeholder.com/64x64/7209B7/FFFFFF?text=MJ', height: 64, width: 64 }
      ]
    },
    duration_ms: 294000,
    explicit: false,
    external_urls: { spotify: '#' },
    preview_url: null,
    popularity: 92,
    track_number: 6,
    type: 'track',
    uri: 'spotify:track:mock_track_4'
  },
  {
    id: 'mock_track_5',
    name: 'Stairway to Heaven',
    artists: [{ name: 'Led Zeppelin', id: 'mock_artist_5' }],
    album: {
      name: 'Led Zeppelin IV',
      id: 'mock_album_5',
      images: [
        { url: 'https://via.placeholder.com/640x640/2E8B57/FFFFFF?text=LZ', height: 640, width: 640 },
        { url: 'https://via.placeholder.com/300x300/2E8B57/FFFFFF?text=LZ', height: 300, width: 300 },
        { url: 'https://via.placeholder.com/64x64/2E8B57/FFFFFF?text=LZ', height: 64, width: 64 }
      ]
    },
    duration_ms: 482000,
    explicit: false,
    external_urls: { spotify: '#' },
    preview_url: null,
    popularity: 89,
    track_number: 4,
    type: 'track',
    uri: 'spotify:track:mock_track_5'
  }
];

const mockArtists = [
  {
    id: 'mock_artist_1',
    name: 'Queen',
    genres: ['rock', 'classic rock', 'glam rock'],
    popularity: 85,
    images: [
      { url: 'https://via.placeholder.com/640x640/1DB954/FFFFFF?text=Queen', height: 640, width: 640 }
    ],
    followers: { total: 28000000 }
  },
  {
    id: 'mock_artist_2',
    name: 'John Lennon',
    genres: ['rock', 'classic rock', 'singer-songwriter'],
    popularity: 80,
    images: [
      { url: 'https://via.placeholder.com/640x640/FF6B35/FFFFFF?text=Lennon', height: 640, width: 640 }
    ],
    followers: { total: 5000000 }
  }
];

const mockAlbums = [
  {
    id: 'mock_album_1',
    name: 'A Night at the Opera',
    artists: [{ name: 'Queen', id: 'mock_artist_1' }],
    album_type: 'album',
    total_tracks: 12,
    release_date: '1975-11-21',
    images: [
      { url: 'https://via.placeholder.com/640x640/1DB954/FFFFFF?text=Queen', height: 640, width: 640 }
    ]
  }
];

/**
 * Simula busca de tracks
 * @param {string} query - Termo de busca
 * @param {number} limit - Limite de resultados
 * @param {number} offset - Offset para paginação
 * @returns {object} Resultado simulado da busca
 */
function searchTracks(query, limit = 20, offset = 0) {
  // Simula delay de rede
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTracks = mockTracks.filter(track => 
        track.name.toLowerCase().includes(query.toLowerCase()) ||
        track.artists.some(artist => artist.name.toLowerCase().includes(query.toLowerCase())) ||
        track.album.name.toLowerCase().includes(query.toLowerCase())
      );
      
      const paginatedTracks = filteredTracks.slice(offset, offset + limit);
      
      resolve({
        tracks: {
          href: `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=track&offset=${offset}&limit=${limit}`,
          items: paginatedTracks,
          limit: limit,
          next: offset + limit < filteredTracks.length ? `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=track&offset=${offset + limit}&limit=${limit}` : null,
          offset: offset,
          previous: offset > 0 ? `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=track&offset=${Math.max(0, offset - limit)}&limit=${limit}` : null,
          total: filteredTracks.length
        }
      });
    }, 300); // Simula 300ms de delay
  });
}

/**
 * Simula busca de artistas
 * @param {string} query - Termo de busca
 * @param {number} limit - Limite de resultados
 * @param {number} offset - Offset para paginação
 * @returns {object} Resultado simulado da busca
 */
function searchArtists(query, limit = 20, offset = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredArtists = mockArtists.filter(artist => 
        artist.name.toLowerCase().includes(query.toLowerCase())
      );
      
      const paginatedArtists = filteredArtists.slice(offset, offset + limit);
      
      resolve({
        artists: {
          href: `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=artist&offset=${offset}&limit=${limit}`,
          items: paginatedArtists,
          limit: limit,
          next: offset + limit < filteredArtists.length ? `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=artist&offset=${offset + limit}&limit=${limit}` : null,
          offset: offset,
          previous: offset > 0 ? `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=artist&offset=${Math.max(0, offset - limit)}&limit=${limit}` : null,
          total: filteredArtists.length
        }
      });
    }, 300);
  });
}

/**
 * Simula busca de álbuns
 * @param {string} query - Termo de busca
 * @param {number} limit - Limite de resultados
 * @param {number} offset - Offset para paginação
 * @returns {object} Resultado simulado da busca
 */
function searchAlbums(query, limit = 20, offset = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredAlbums = mockAlbums.filter(album => 
        album.name.toLowerCase().includes(query.toLowerCase()) ||
        album.artists.some(artist => artist.name.toLowerCase().includes(query.toLowerCase()))
      );
      
      const paginatedAlbums = filteredAlbums.slice(offset, offset + limit);
      
      resolve({
        albums: {
          href: `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=album&offset=${offset}&limit=${limit}`,
          items: paginatedAlbums,
          limit: limit,
          next: offset + limit < filteredAlbums.length ? `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=album&offset=${offset + limit}&limit=${limit}` : null,
          offset: offset,
          previous: offset > 0 ? `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=album&offset=${Math.max(0, offset - limit)}&limit=${limit}` : null,
          total: filteredAlbums.length
        }
      });
    }, 300);
  });
}

/**
 * Simula busca geral (todos os tipos)
 * @param {string} query - Termo de busca
 * @param {string} type - Tipos de busca (track,artist,album)
 * @param {number} limit - Limite de resultados
 * @param {number} offset - Offset para paginação
 * @returns {object} Resultado simulado da busca
 */
async function search(query, type = 'track,artist,album', limit = 20, offset = 0) {
  const types = type.split(',');
  const results = {};
  
  if (types.includes('track')) {
    const trackResults = await searchTracks(query, limit, offset);
    results.tracks = trackResults.tracks;
  }
  
  if (types.includes('artist')) {
    const artistResults = await searchArtists(query, limit, offset);
    results.artists = artistResults.artists;
  }
  
  if (types.includes('album')) {
    const albumResults = await searchAlbums(query, limit, offset);
    results.albums = albumResults.albums;
  }
  
  return results;
}

/**
 * Retorna tracks populares (simulado)
 * @param {number} limit - Limite de resultados
 * @returns {object} Tracks populares simuladas
 */
function getPopularTracks(limit = 20) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const popularTracks = [...mockTracks]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, limit);
      
      resolve({
        tracks: popularTracks
      });
    }, 200);
  });
}

/**
 * Simula obtenção de detalhes de uma track
 * @param {string} trackId - ID da track
 * @returns {object} Detalhes da track
 */
function getTrack(trackId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const track = mockTracks.find(t => t.id === trackId);
      if (track) {
        resolve(track);
      } else {
        reject(new Error('Track não encontrada'));
      }
    }, 100);
  });
}

/**
 * Retorna informações sobre o status do mock
 * @returns {object} Status do serviço mock
 */
function getStatus() {
  return {
    service: 'mock',
    available: true,
    message: 'Serviço mock ativo - Spotify não configurado',
    totalTracks: mockTracks.length,
    totalArtists: mockArtists.length,
    totalAlbums: mockAlbums.length,
    features: [
      'Busca de músicas',
      'Busca de artistas',
      'Busca de álbuns',
      'Tracks populares',
      'Detalhes de tracks'
    ]
  };
}

module.exports = {
  search,
  searchTracks,
  searchArtists,
  searchAlbums,
  getPopularTracks,
  getTrack,
  getStatus,
  mockTracks,
  mockArtists,
  mockAlbums
};