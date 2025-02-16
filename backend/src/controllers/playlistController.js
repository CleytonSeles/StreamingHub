const Playlist = require('../models/playlistModel');

// Criar playlist
exports.createPlaylist = async (req, res) => {
  // Extrai nome, descrição e vídeos do corpo da requisição
  const { name, description, videos } = req.body;

  try {
    // Cria uma nova playlist com os dados fornecidos
    const playlist = new Playlist({ name, description, videos });

    // Salva a nova playlist no banco de dados
    await playlist.save();

    // Retorna uma mensagem de sucesso e a playlist criada
    res.status(201).json({ message: 'Playlist criada com sucesso.', playlist });
  } catch (error) {
    // Retorna erro se ocorrer um problema durante a criação da playlist
    res.status(500).json({ message: 'Erro ao criar playlist.' });
  }
};

// Obter todas as playlists
exports.getAllPlaylists = async (req, res) => {
  try {
    // Busca todas as playlists no banco de dados e popula o campo 'videos'
    const playlists = await Playlist.find().populate('videos');

    // Retorna a lista de playlists encontradas
    res.status(200).json(playlists);
  } catch (error) {
    // Retorna erro se ocorrer um problema durante a busca das playlists
    res.status(500).json({ message: 'Erro ao obter playlists.' });
  }
};

// Atualizar playlist
exports.updatePlaylist = async (req, res) => {
  // Extrai o ID da playlist dos parâmetros da requisição
  const { id } = req.params;

  // Extrai nome, descrição e vídeos do corpo da requisição
  const { name, description, videos } = req.body;

  try {
    console.log('Atualizando playlist:', id);

    // Atualiza a playlist com os novos dados fornecidos
    const playlist = await Playlist.findByIdAndUpdate(id, { name, description, videos }, { new: true });

    // Verifica se a playlist foi encontrada
    if (!playlist) {
      // Retorna erro se a playlist não for encontrada
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    // Retorna a playlist atualizada
    res.status(200).json(playlist);
  } catch (error) {
    console.error('Erro ao atualizar playlist:', error);

    // Retorna erro se ocorrer um problema durante a atualização da playlist
    res.status(500).json({ message: 'Erro ao atualizar playlist.' });
  }
};

// Excluir playlist
exports.deletePlaylist = async (req, res) => {
  // Extrai o ID da playlist dos parâmetros da requisição
  const { id } = req.params;

  try {
    console.log('Excluindo playlist:', id);

    // Exclui a playlist com o ID fornecido
    const playlist = await Playlist.findByIdAndDelete(id);

    // Verifica se a playlist foi encontrada e excluída
    if (!playlist) {
      // Retorna erro se a playlist não for encontrada
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    // Retorna mensagem de sucesso após a exclusão da playlist
    res.status(200).json({ message: 'Playlist excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir playlist:', error);

    // Retorna erro se ocorrer um problema durante a exclusão da playlist
    res.status(500).json({ message: 'Erro ao excluir playlist.' });
  }
};

