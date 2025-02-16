const Video = require('../models/videoModel');

// Criar vídeo
exports.createVideo = async (req, res) => {
  const { title, description, url } = req.body;

  try {
    const video = new Video({ title, description, url });
    await video.save();

    res.status(201).json({ message: 'Vídeo criado com sucesso.', video });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar vídeo.' });
  }
};

// Obter todos os vídeos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter vídeos.' });
  }
};

// Atualizar vídeo
exports.updateVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;

  try {
    console.log('Atualizando vídeo:', id);
    const video = await Video.findByIdAndUpdate(id, { title, description, url }, { new: true });

    if (!video) {
      return res.status(404).json({ message: 'Vídeo não encontrado.' });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({ message: 'Erro ao atualizar vídeo.' });
  }
};

// Excluir vídeo
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Excluindo vídeo:', id);
    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ message: 'Vídeo não encontrado.' });
    }

    res.status(200).json({ message: 'Vídeo excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);
    res.status(500).json({ message: 'Erro ao excluir vídeo.' });
  }
};
