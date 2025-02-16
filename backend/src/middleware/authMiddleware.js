const jwt = require('jsonwebtoken');

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  // Extrai o token do cabeçalho da requisição
  const token = req.header('Authorization').replace('Bearer ', '');

  // Verifica se o token está presente
  if (!token) {
    // Retorna erro se nenhum token for fornecido
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Anexa o usuário decodificado ao objeto de requisição
    req.user = decoded;

    // Passa o controle para o próximo middleware ou rota
    next();
  } catch (error) {
    // Retorna erro se o token for inválido
    res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
