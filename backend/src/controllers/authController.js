const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getAccessToken, getUserProfile, spotifyApi } = require('../services/spotifyService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please enter all fields' });
  }

  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Initiate Spotify authentication
// @route   GET /api/auth/spotify
// @access  Public
const spotifyLogin = (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'user-read-recently-played'
  ];

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
};

// @desc    Spotify authentication callback
// @route   GET /api/auth/spotify/callback
// @access  Public
const spotifyCallback = async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/spotify-callback?error=Authorization code not provided`);
  }

  try {
    const { accessToken, refreshToken, expiresIn } = await getAccessToken(code);
    const spotifyProfile = await getUserProfile(accessToken);

    // Calcular o tempo de expiração do token
    const expiresAt = new Date(Date.now() + expiresIn * 1000); // expiresIn está em segundos

    console.log('Spotify Profile:', spotifyProfile);
    console.log('Token expires at:', expiresAt);

    // Verificar se o usuário já existe pelo Spotify ID
    let user = await prisma.user.findUnique({
      where: { spotifyId: spotifyProfile.id }
    });

    if (user) {
      // Atualizar usuário existente com novos tokens
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          spotifyAccessToken: accessToken,
          spotifyRefreshToken: refreshToken,
          spotifyAccessTokenExpiresAt: expiresAt,
        },
      });
    } else {
      // Criar novo usuário baseado no perfil do Spotify
      const hashedPassword = await bcrypt.hash('spotify-user-' + Date.now(), 10);
      user = await prisma.user.create({
        data: {
          username: spotifyProfile.display_name || spotifyProfile.id,
          email: spotifyProfile.email || `${spotifyProfile.id}@spotify.local`,
          password: hashedPassword,
          spotifyId: spotifyProfile.id,
          spotifyAccessToken: accessToken,
          spotifyRefreshToken: refreshToken,
          spotifyAccessTokenExpiresAt: expiresAt,
        },
      });
    }

    console.log('User saved with expiration date:', user.spotifyAccessTokenExpiresAt);

    // Gerar JWT token para o usuário
    const jwtToken = generateToken(user.id, user.username);

    // Redirecionar para o frontend com o token
    res.redirect(`${process.env.FRONTEND_URL}/spotify-callback?token=${jwtToken}`);
  } catch (error) {
    console.error('Error during Spotify callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/spotify-callback?error=${encodeURIComponent(error.message)}`);
  }
};

// Generate JWT
const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  spotifyLogin,
  spotifyCallback,
};
