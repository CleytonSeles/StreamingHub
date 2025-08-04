import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { getAuthURL, getAccessToken, getUserProfile } from '../services/spotifyService.js';

const prisma = new PrismaClient();

const spotifyLogin = (req, res) => {
  const authURL = getAuthURL();
  res.redirect(authURL);
};

const spotifyCallback = async (req, res) => {
  try {
    const { code } = req.query;
    
    // Troca código por tokens
    const tokens = await getAccessToken(code);
    
    // Busca perfil do usuário no Spotify
    const spotifyProfile = await getUserProfile(tokens.accessToken);
    
    // Verifica se usuário já existe
    let user = await prisma.user.findUnique({
      where: { email: spotifyProfile.email }
    });
    
    // Cria usuário se não existir
    if (!user) {
      const hashedPassword = await bcrypt.hash('spotify-auth', 10);
      user = await prisma.user.create({
        data: {
          email: spotifyProfile.email,
          name: spotifyProfile.display_name || spotifyProfile.id,
          password: hashedPassword
        }
      });
    }
    
    // Gera JWT
    const token = generateToken({ 
      userId: user.id, 
      email: user.email 
    });
    
    // Define cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });
    
    // Redireciona para frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
    
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = {
  spotifyLogin,
  spotifyCallback
};
