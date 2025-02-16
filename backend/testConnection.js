const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
