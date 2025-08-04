const jwt = require('jsonwebtoken');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRequest() {
  try {
    console.log('🔍 Buscando usuário no banco...');
    
    // Buscar o usuário com tokens Spotify
    const user = await prisma.user.findFirst({
      where: {
        spotifyAccessToken: { not: null }
      },
      select: {
        id: true,
        username: true,
        spotifyAccessTokenExpiresAt: true
      }
    });

    if (!user) {
      console.log('❌ Nenhum usuário com token Spotify encontrado.');
      return;
    }

    console.log('✅ Usuário encontrado:', user.username);
    console.log('📅 Data de expiração atual:', user.spotifyAccessTokenExpiresAt);

    // Gerar JWT token
    const jwtToken = jwt.sign(
      { id: user.id, username: user.username },
      'your-super-secret-jwt-key-change-in-production',
      { expiresIn: '7d' }
    );

    console.log('🔑 JWT Token gerado');

    // Fazer requisição para a API
    console.log('🚀 Fazendo requisição para /api/spotify/search...');
    
    const response = await axios.get('http://localhost:3001/api/spotify/search?query=test', {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    console.log('✅ Requisição bem-sucedida!');
    console.log('📊 Resultados encontrados:', response.data.length, 'músicas');
    
    // Verificar se o token foi atualizado
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        spotifyAccessTokenExpiresAt: true
      }
    });

    console.log('🕒 Nova data de expiração:', updatedUser.spotifyAccessTokenExpiresAt);
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.response?.data || error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testRequest();