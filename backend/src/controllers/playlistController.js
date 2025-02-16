const Playlist = require('../models/playlistModel');

// Criar playlist
exports.createPlaylist = async (req, res) => {
  const { name, description, videos } = req.body;

  try {
    const playlist = new Playlist({ name, description, videos });
    await playlist.save();

    res.status(201).json({ message: 'Playlist criada com sucesso.', playlist });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar playlist.' });
  }
};

// Obter todas as playlists
exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('videos');
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter playlists.' });
  }
};

// Atualizar playlist
exports.updatePlaylist = async (req, res) => {
  const { id } = req.params;
  const { name, description, videos } = req.body;

  try {
    console.log('Atualizando playlist:', id);
    const playlist = await Playlist.findByIdAndUpdate(id, { name, description, videos }, { new: true });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    res.status(200).json(playlist);
  } catch (error) {
    console.error('Erro ao atualizar playlist:', error);
    res.status(500).json({ message: 'Erro ao atualizar playlist.' });
  }
};

// Excluir playlist
exports.deletePlaylist = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Excluindo playlist:', id);
    const playlist = await Playlist.findByIdAndDelete(id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    res.status(200).json({ message: 'Playlist excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir playlist:', error);
    res.status(500).json({ message: 'Erro ao excluir playlist.' });
  }
};
