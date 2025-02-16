     
import React, { useState } from 'react';
import { register } from '../services/authService';

const Register = () => {
  // Define o estado para armazenar o nome, email e senha do usuário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para lidar com o envio do formulário de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chama a função de registro do serviço de autenticação
      const response = await register({ name, email, password });
      alert(response.message);
    } catch (error) {
      alert('Erro ao registrar usuário');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar</h2>
      {/* Campo de entrada para o nome */}
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;


