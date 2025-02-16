const mongoose = require('mongoose');

// Definição do esquema (schema) para a coleção de usuários
const userSchema = new mongoose.Schema({
  // Nome do usuário, obrigatório e com espaços em branco removidos das extremidades
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Email do usuário, obrigatório, único, em minúsculas e com espaços em branco removidos das extremidades
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  // Senha do usuário, obrigatória e com comprimento mínimo de 6 caracteres
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  // Data de criação do usuário, com valor padrão sendo a data atual
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Criação do modelo User com base no esquema definido
const User = mongoose.model('User', userSchema);

// Exportação do modelo User para ser utilizado em outras partes da aplicação
module.exports = User;
