import React, { useState } from 'react';
import { login } from '../services/authService';

const Login = () => {
  // Define o estado para armazenar o email e a senha do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para lidar com o envio do formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chama a função de login do serviço de autenticação
      await login({ email, password });
      alert('Login realizado com sucesso');
      // Armazene o token e redirecione conforme necessário
    } catch (error) {
      alert('Erro ao realizar login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {/* Campo de entrada para o email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* Campo de entrada para a senha */}
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* Botão para submeter o formulário */}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;



