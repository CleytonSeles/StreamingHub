const Video = require('../models/videoModel');

// Criar vídeo
exports.createVideo = async (req, res) => {
  // Extrai título, descrição e URL do corpo da requisição
  const { title, description, url } = req.body;

  try {
    // Cria um novo vídeo com os dados fornecidos
    const video = new Video({ title, description, url });

    // Salva o novo vídeo no banco de dados
    await video.save();

    // Retorna uma mensagem de sucesso e o vídeo criado
    res.status(201).json({ message: 'Vídeo criado com sucesso.', video });
  } catch (error) {
    // Retorna erro se ocorrer um problema durante a criação do vídeo
    res.status(500).json({ message: 'Erro ao criar vídeo.' });
  }
};

// Obter todos os vídeos
exports.getAllVideos = async (req, res) => {
  try {
    // Busca todos os vídeos no banco de dados
    const videos = await Video.find();

    // Retorna a lista de vídeos encontrados
    res.status(200).json(videos);
  } catch (error) {
    // Retorna erro se ocorrer um problema durante a busca dos vídeos
    res.status(500).json({ message: 'Erro ao obter vídeos.' });
  }
};

// Atualizar vídeo
exports.updateVideo = async (req, res) => {
  // Extrai o ID do vídeo dos parâmetros da requisição
  const { id } = req.params;

  // Extrai título, descrição e URL do corpo da requisição
  const { title, description, url } = req.body;

  try {
    console.log('Atualizando vídeo:', id);

    // Atualiza o vídeo com os novos dados fornecidos
    const video = await Video.findByIdAndUpdate(id, { title, description, url }, { new: true });

    // Verifica se o vídeo foi encontrado
    if (!video) {
      // Retorna erro se o vídeo não for encontrado
      return res.status(404).json({ message: 'Vídeo não encontrado.' });
    }

    // Retorna o vídeo atualizado
    res.status(200).json(video);
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);

    // Retorna erro se ocorrer um problema durante a atualização do vídeo
    res.status(500).json({ message: 'Erro ao atualizar vídeo.' });
  }
};

// Excluir vídeo
exports.deleteVideo = async (req, res) => {
  // Extrai o ID do vídeo dos parâmetros da requisição
  const { id } = req.params;

  try {
    console.log('Excluindo vídeo:', id);

    // Exclui o vídeo com o ID fornecido
    const video = await Video.findByIdAndDelete(id);

    // Verifica se o vídeo foi encontrado e excluído
    if (!video) {
      // Retorna erro se o vídeo não for encontrado
      return res.status(404).json({ message: 'Vídeo não encontrado.' });
    }

    // Retorna mensagem de sucesso após a exclusão do vídeo
    res.status(200).json({ message: 'Vídeo excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);

    // Retorna erro se ocorrer um problema durante a exclusão do vídeo
    res.status(500).json({ message: 'Erro ao excluir vídeo.' });
  }
};

