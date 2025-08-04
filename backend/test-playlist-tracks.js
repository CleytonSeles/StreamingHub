const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const prisma = new PrismaClient();

async function testPlaylistTrackFunctionalities() {
  try {
    console.log('🧪 Iniciando teste das funcionalidades de músicas em playlists...\n');

    // 1. Buscar um usuário existente
    const user = await prisma.user.findFirst({
      where: {
        spotifyAccessToken: {
          not: null
        }
      }
    });

    if (!user) {
      console.log('❌ Nenhum usuário encontrado com token do Spotify');
      return;
    }

    console.log('👤 Usuário encontrado:', user.username);

    // 2. Gerar token JWT
    const jwtToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🔑 Token JWT gerado');

    const baseURL = 'http://localhost:3001';
    const headers = {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    };

    // 3. Criar uma nova playlist para teste
    console.log('\n📝 Criando playlist de teste...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const createResponse = await axios.post(`${baseURL}/api/playlists`, {
      name: `Playlist Tracks Test ${timestamp}`,
      description: 'Playlist para testar adição e remoção de músicas',
      isPublic: true
    }, { headers });

    const playlistId = createResponse.data.data.id;
    console.log('✅ Playlist criada:', createResponse.data.data.name);

    // 4. Dados de músicas de exemplo
    const sampleTracks = [
      {
        spotifyTrackId: 'track_001',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        durationMs: 355000,
        imageUrl: 'https://example.com/bohemian-rhapsody.jpg',
        previewUrl: 'https://example.com/preview/bohemian-rhapsody.mp3'
      },
      {
        spotifyTrackId: 'track_002',
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        durationMs: 183000,
        imageUrl: 'https://example.com/imagine.jpg',
        previewUrl: 'https://example.com/preview/imagine.mp3'
      },
      {
        spotifyTrackId: 'track_003',
        title: 'Hotel California',
        artist: 'Eagles',
        album: 'Hotel California',
        durationMs: 391000,
        imageUrl: 'https://example.com/hotel-california.jpg',
        previewUrl: 'https://example.com/preview/hotel-california.mp3'
      }
    ];

    // 5. Adicionar músicas à playlist
    console.log('\n🎵 Testando adição de músicas à playlist...');
    const addedTracks = [];
    
    for (const track of sampleTracks) {
      try {
        const addResponse = await axios.post(
          `${baseURL}/api/playlists/${playlistId}/tracks`,
          track,
          { headers }
        );
        
        console.log(`✅ Música adicionada: ${track.title} - ${track.artist}`);
        addedTracks.push(addResponse.data.data);
      } catch (error) {
        console.log(`❌ Erro ao adicionar ${track.title}:`, error.response?.data?.message || error.message);
      }
    }

    // 6. Tentar adicionar música duplicada
    console.log('\n🔄 Testando adição de música duplicada...');
    try {
      await axios.post(
        `${baseURL}/api/playlists/${playlistId}/tracks`,
        sampleTracks[0],
        { headers }
      );
      console.log('❌ Erro: Deveria ter rejeitado música duplicada');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Música duplicada rejeitada corretamente:', error.response.data.message);
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }

    // 7. Listar músicas da playlist
    console.log('\n📋 Testando listagem de músicas da playlist...');
    const listTracksResponse = await axios.get(
      `${baseURL}/api/playlists/${playlistId}/tracks`,
      { headers }
    );
    
    console.log('✅ Músicas na playlist:', listTracksResponse.data.data.tracks.length);
    listTracksResponse.data.data.tracks.forEach((playlistTrack, index) => {
      const track = playlistTrack.track;
      console.log(`   ${index + 1}. ${track.title} - ${track.artist} (${Math.round(track.durationMs / 1000)}s)`);
    });

    // 8. Remover uma música da playlist
    if (addedTracks.length > 0) {
      console.log('\n🗑️ Testando remoção de música da playlist...');
      const trackToRemove = addedTracks[0];
      
      try {
        const removeResponse = await axios.delete(
          `${baseURL}/api/playlists/${playlistId}/tracks/${trackToRemove.trackId}`,
          { headers }
        );
        
        console.log('✅ Música removida com sucesso:', removeResponse.data.message);
      } catch (error) {
        console.log('❌ Erro ao remover música:', error.response?.data?.message || error.message);
      }
    }

    // 9. Verificar lista atualizada
    console.log('\n📋 Verificando lista atualizada de músicas...');
    const updatedListResponse = await axios.get(
      `${baseURL}/api/playlists/${playlistId}/tracks`,
      { headers }
    );
    
    console.log('✅ Músicas restantes na playlist:', updatedListResponse.data.data.tracks.length);
    updatedListResponse.data.data.tracks.forEach((playlistTrack, index) => {
      const track = playlistTrack.track;
      console.log(`   ${index + 1}. ${track.title} - ${track.artist}`);
    });

    // 10. Tentar remover música inexistente
    console.log('\n🔍 Testando remoção de música inexistente...');
    try {
      await axios.delete(
        `${baseURL}/api/playlists/${playlistId}/tracks/track-inexistente`,
        { headers }
      );
      console.log('❌ Erro: Deveria ter rejeitado música inexistente');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Música inexistente rejeitada corretamente:', error.response.data.message);
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }

    // 11. Limpar - deletar playlist de teste
    console.log('\n🧹 Limpando playlist de teste...');
    await axios.delete(`${baseURL}/api/playlists/${playlistId}`, { headers });
    console.log('✅ Playlist de teste deletada');

    console.log('\n🎉 Todos os testes de músicas em playlists foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Mensagem:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o teste
testPlaylistTrackFunctionalities();