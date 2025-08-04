const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Adicionar música à playlist
const addTrackToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { spotifyTrackId, title, artist, album, durationMs, imageUrl } = req.body;
    const userId = req.user.id; // Obtido do middleware de autenticação

    // Verifica se a playlist pertence ao usuário
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ error: 'Playlist not found or unauthorized' });
    }

    // Cria ou encontra a música
    let track = await prisma.track.findUnique({
      where: { spotifyTrackId: spotifyTrackId }
    });

    if (!track) {
      track = await prisma.track.create({
        data: { spotifyTrackId, title, artist, album, durationMs, imageUrl }
      });
    }

    // Adiciona a música à playlist
    const playlistTrack = await prisma.playlistTrack.create({
      data: {
        playlistId: playlist.id,
        trackId: track.id,
        addedAt: new Date(),
      },
    });

    res.status(201).json(playlistTrack);
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    res.status(500).json({ error: 'Failed to add track to playlist' });
  }
};

// Remover música da playlist
const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;
    const userId = req.user.id;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ error: 'Playlist not found or unauthorized' });
    }

    await prisma.playlistTrack.deleteMany({
      where: {
        playlistId: playlist.id,
        trackId: trackId,
      },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    res.status(500).json({ error: 'Failed to remove track from playlist' });
  }
};

// Adicionar música aos favoritos
const addFavorite = async (req, res) => {
  try {
    const { spotifyTrackId, title, artist, album, durationMs, imageUrl } = req.body;
    const userId = req.user.id;

    let track = await prisma.track.findUnique({
      where: { spotifyTrackId: spotifyTrackId }
    });

    if (!track) {
      track = await prisma.track.create({
        data: { spotifyTrackId, title, artist, album, durationMs, imageUrl }
      });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: userId,
        trackId: track.id,
        addedAt: new Date(),
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// Remover música dos favoritos
const removeFavorite = async (req, res) => {
  try {
    const { trackId } = req.params; // trackId do nosso banco, não spotifyTrackId
    const userId = req.user.id;

    await prisma.favorite.deleteMany({
      where: {
        userId: userId,
        trackId: trackId,
      },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

module.exports = {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  addFavorite,
  removeFavorite,
};
