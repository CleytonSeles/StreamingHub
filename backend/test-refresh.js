const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

async function testRefresh() {
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
      console.log('❌ Nenhum usuário com token Spotify encontrado. Faça login primeiro.');
      return;
    }

    console.log('✅ Usuário encontrado:', user.username);
    console.log('📅 Data de expiração atual:', user.spotifyAccessTokenExpiresAt);

    // Definir uma data no passado (5 minutos atrás)
    const pastDate = new Date(Date.now() - 5 * 60 * 1000);
    
    console.log('🕒 Definindo data de expiração para o passado:', pastDate.toISOString());
    
    // Atualizar a data de expiração para o passado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        spotifyAccessTokenExpiresAt: pastDate
      }
    });

    console.log('✅ Data de expiração atualizada para o passado');
    console.log('🧪 Agora faça uma requisição para: http://localhost:3001/api/spotify/search?query=test');
    console.log('📊 Monitore os logs do servidor e o Prisma Studio para ver o refresh automático!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testRefresh();