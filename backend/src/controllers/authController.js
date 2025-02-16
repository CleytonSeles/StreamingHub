const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Registrar novo usuário
exports.register = async (req, res) => {
  // Extrai nome, email e senha do corpo da requisição
  const { name, email, password } = req.body;

  try {
    // Verifica se o usuário já está registrado no banco de dados
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Retorna erro se o usuário já estiver registrado
      return res.status(400).json({ message: 'Usuário já registrado.' });
    }

    // Gera um hash da senha usando bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria um novo usuário com a senha criptografada
    const user = new User({ name, email, password: hashedPassword });

    // Salva o novo usuário no banco de dados
    await user.save();

    // Retorna uma mensagem de sucesso
    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    // Retorna erro se ocorrer um problema durante o registro
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  // Extrai email e senha do corpo da requisição
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe no banco de dados
    const user = await User.findOne({ email });
    if (!user) {
      // Retorna erro se as credenciais forem inválidas
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Compara a senha fornecida com a senha armazenada no banco de dados
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Retorna erro se as credenciais forem inválidas
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Gera um token JWT para autenticação
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retorna o token e o ID do usuário
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    // Retorna erro se ocorrer um problema durante o login
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};
