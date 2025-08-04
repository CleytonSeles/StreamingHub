const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.user.id;

    // Validação básica
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Nome da playlist é obrigatório.' 
      });
    }

    // Verificar se já existe uma playlist com o mesmo nome para este usuário
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        name: name.trim(),
        userId: userId
      }
    });

    if (existingPlaylist) {
      return res.status(400).json({
        success: false,
        message: 'Você já possui uma playlist com este nome.'
      });
    }

    // Criar a playlist
    const playlist = await prisma.playlist.create({
      data: {
        name: name.trim(),
        description: description?.trim() || '',
        isPublic: isPublic || false,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: {
            tracks: true
          }
        }
      }
    });

    console.log('✅ Playlist criada:', playlist.name, 'por', req.user.username);

    res.status(201).json({
      success: true,
      message: 'Playlist criada com sucesso!',
      data: playlist
    });

  } catch (error) {
    console.error('❌ Erro ao criar playlist:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar playlist.'
    });
  }
};

// @desc    Get all playlists for the authenticated user
// @route   GET /api/playlists
// @access  Private
const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;

    const playlists = await prisma.playlist.findMany({
      where: {
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: {
            tracks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📋 Listando', playlists.length, 'playlists para', req.user.username);

    res.status(200).json({
      success: true,
      message: `${playlists.length} playlist(s) encontrada(s).`,
      data: playlists
    });

  } catch (error) {
    console.error('❌ Erro ao listar playlists:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao listar playlists.'
    });
  }
};

// @desc    Get a specific playlist by ID
// @route   GET /api/playlists/:id
// @access  Private
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const playlist = await prisma.playlist.findFirst({
      where: {
        id: id,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        tracks: {
          include: {
            track: true
          },
          orderBy: {
            addedAt: 'asc'
          }
        },
        _count: {
          select: {
            tracks: true
          }
        }
      }
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist não encontrada.'
      });
    }

    console.log('🎵 Playlist encontrada:', playlist.name);

    res.status(200).json({
      success: true,
      message: 'Playlist encontrada.',
      data: playlist
    });

  } catch (error) {
    console.error('❌ Erro ao buscar playlist:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar playlist.'
    });
  }
};

// @desc    Update a playlist
// @route   PUT /api/playlists/:id
// @access  Private
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;
    const userId = req.user.id;

    // Verificar se a playlist existe e pertence ao usuário
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });

    if (!existingPlaylist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist não encontrada.'
      });
    }

    // Validação básica
    if (name && name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nome da playlist não pode estar vazio.'
      });
    }

    // Verificar se já existe outra playlist com o mesmo nome
    if (name && name.trim() !== existingPlaylist.name) {
      const duplicatePlaylist = await prisma.playlist.findFirst({
        where: {
          name: name.trim(),
          userId: userId,
          id: { not: id }
        }
      });

      if (duplicatePlaylist) {
        return res.status(400).json({
          success: false,
          message: 'Você já possui uma playlist com este nome.'
        });
      }
    }

    // Atualizar a playlist
    const updatedPlaylist = await prisma.playlist.update({
      where: {
        id: id
      },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || '' }),
        ...(isPublic !== undefined && { isPublic: isPublic })
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: {
            tracks: true
          }
        }
      }
    });

    console.log('✏️ Playlist atualizada:', updatedPlaylist.name);

    res.status(200).json({
      success: true,
      message: 'Playlist atualizada com sucesso!',
      data: updatedPlaylist
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar playlist:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar playlist.'
    });
  }
};

// @desc    Delete a playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se a playlist existe e pertence ao usuário
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        id: id,
        userId: userId
      }
    });

    if (!existingPlaylist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist não encontrada.'
      });
    }

    // Deletar a playlist (as tracks da playlist serão deletadas automaticamente devido ao cascade)
    await prisma.playlist.delete({
      where: {
        id: id
      }
    });

    console.log('🗑️ Playlist deletada:', existingPlaylist.name);

    res.status(200).json({
      success: true,
      message: 'Playlist deletada com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao deletar playlist:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao deletar playlist.'
    });
  }
};

// @desc    Add a track to a playlist
// @route   POST /api/playlists/:playlistId/tracks
// @access  Private
const addTrackToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { spotifyTrackId, title, artist, album, durationMs, imageUrl, previewUrl } = req.body;
    const userId = req.user.id;

    // Validação básica
    if (!spotifyTrackId || !title || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Dados da música são obrigatórios (spotifyTrackId, title, artist).'
      });
    }

    // Verificar se a playlist existe e pertence ao usuário
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: userId
      }
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist não encontrada.'
      });
    }

    // Verificar se a música já está na playlist
    const existingPlaylistTrack = await prisma.playlistTrack.findFirst({
      where: {
        playlistId: playlistId,
        track: {
          spotifyTrackId: spotifyTrackId
        }
      }
    });

    if (existingPlaylistTrack) {
      return res.status(400).json({
        success: false,
        message: 'Esta música já está na playlist.'
      });
    }

    // Encontrar ou criar a música no banco de dados
    let track = await prisma.track.findUnique({
      where: { spotifyTrackId: spotifyTrackId }
    });

    if (!track) {
      track = await prisma.track.create({
        data: {
          spotifyTrackId,
          title: title.trim(),
          artist: artist.trim(),
          album: album?.trim() || '',
          durationMs: durationMs || 0,
          imageUrl: imageUrl || null,
          previewUrl: previewUrl || null
        }
      });
    }

    // Adicionar a música à playlist
    const playlistTrack = await prisma.playlistTrack.create({
      data: {
        playlistId: playlistId,
        trackId: track.id
      },
      include: {
        track: true,
        playlist: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log('🎵 Música adicionada à playlist:', track.title, 'por', req.user.username);

    res.status(201).json({
      success: true,
      message: 'Música adicionada à playlist com sucesso!',
      data: playlistTrack
    });

  } catch (error) {
    console.error('❌ Erro ao adicionar música à playlist:', error.message);
    
    // Tratar erro de constraint única (música já na playlist)
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Esta música já está na playlist.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao adicionar música à playlist.'
    });
  }
};

// @desc    Remove a track from a playlist
// @route   DELETE /api/playlists/:playlistId/tracks/:trackId
// @access  Private
const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;
    const userId = req.user.id;

    // Verificar se a playlist existe e pertence ao usuário
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: userId
      }
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist não encontrada.'
      });
    }

    // Verificar se a música está na playlist
    const playlistTrack = await prisma.playlistTrack.findFirst({
      where: {
        playlistId: playlistId,
        trackId: trackId
      },
      include: {
        track: {
          select: {
            title: true,
            artist: true
          }
        }
      }
    });

    if (!playlistTrack) {
      return res.status(404).json({
        success: false,
        message: 'Música não encontrada na playlist.'
      });
    }

    // Remover a música da playlist
    await prisma.playlistTrack.delete({
      where: {
        id: playlistTrack.id
      }
    });

    console.log('🗑️ Música removida da playlist:', playlistTrack.track.title, 'por', req.user.username);

    res.status(200).json({
      success: true,
      message: 'Música removida da playlist com sucesso!'
    });

  } catch (error) {
    console.error('❌ Erro ao remover música da playlist:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao remover música da playlist.'
    });
  }
};

// @desc    Get all tracks from a specific playlist
// @route   GET /api/playlists/:playlistId/tracks
// @access  Private
const getPlaylistTracks = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;

    // Verificar se a playlist existe e pertence ao usuário
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist não encontrada.'
      });
    }

    // Buscar todas as músicas da playlist
    const playlistTracks = await prisma.playlistTrack.findMany({
      where: {
        playlistId: playlistId
      },
      include: {
        track: true
      },
      orderBy: {
        addedAt: 'asc'
      }
    });

    console.log('🎵 Listando', playlistTracks.length, 'músicas da playlist:', playlist.name);

    res.status(200).json({
      success: true,
      message: `${playlistTracks.length} música(s) encontrada(s) na playlist.`,
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          isPublic: playlist.isPublic,
          user: playlist.user,
          createdAt: playlist.createdAt,
          updatedAt: playlist.updatedAt
        },
        tracks: playlistTracks
      }
    });

  } catch (error) {
    console.error('❌ Erro ao listar músicas da playlist:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao listar músicas da playlist.'
    });
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
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getPlaylistTracks,
  addFavorite,
  removeFavorite,
};
