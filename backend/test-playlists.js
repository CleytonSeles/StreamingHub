const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const prisma = new PrismaClient();

async function testPlaylistFunctionalities() {
  try {
    console.log('🧪 Iniciando teste das funcionalidades de playlist...\n');

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

    // 3. Criar uma nova playlist
    console.log('\n📝 Testando criação de playlist...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const createResponse = await axios.post(`${baseURL}/api/playlists`, {
      name: `Playlist de Teste ${timestamp}`,
      description: 'Uma playlist criada para testar a API',
      isPublic: true
    }, { headers });

    console.log('📄 Resposta completa:', JSON.stringify(createResponse.data, null, 2));
    
    if (!createResponse.data || !createResponse.data.data) {
      throw new Error('Resposta inválida do servidor');
    }

    console.log('✅ Playlist criada:', createResponse.data.data.name);
    const playlistId = createResponse.data.data.id;

    // 4. Listar playlists do usuário
    console.log('\n📋 Testando listagem de playlists...');
    const listResponse = await axios.get(`${baseURL}/api/playlists`, { headers });
    
    console.log('✅ Playlists encontradas:', listResponse.data.data.length);
    listResponse.data.data.forEach(playlist => {
      console.log(`   - ${playlist.name} (${playlist._count.tracks} tracks)`);
    });

    // 5. Buscar playlist específica
    console.log('\n🔍 Testando busca de playlist específica...');
    const getResponse = await axios.get(`${baseURL}/api/playlists/${playlistId}`, { headers });
    
    console.log('✅ Playlist encontrada:', getResponse.data.data.name);

    // 6. Atualizar playlist
    console.log('\n✏️ Testando atualização de playlist...');
    const updateResponse = await axios.put(`${baseURL}/api/playlists/${playlistId}`, {
      name: 'Playlist de Teste Atualizada',
      description: 'Descrição atualizada via API',
      isPublic: false
    }, { headers });

    console.log('✅ Playlist atualizada:', updateResponse.data.data.name);

    // 7. Deletar playlist
    console.log('\n🗑️ Testando exclusão de playlist...');
    await axios.delete(`${baseURL}/api/playlists/${playlistId}`, { headers });
    
    console.log('✅ Playlist deletada com sucesso');

    // 8. Verificar se foi deletada
    console.log('\n🔍 Verificando se playlist foi deletada...');
    try {
      await axios.get(`${baseURL}/api/playlists/${playlistId}`, { headers });
      console.log('❌ Erro: Playlist ainda existe');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Confirmado: Playlist foi deletada');
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }

    console.log('\n🎉 Todos os testes de playlist foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Mensagem:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o teste
testPlaylistFunctionalities();