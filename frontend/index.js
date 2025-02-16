import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles.css';
import App from './App';

// Seleciona o elemento HTML com o id 'root' onde o aplicativo React será montado
const container = document.getElementById('root');

// Cria uma raiz do React para renderizar o aplicativo
const root = createRoot(container);

// Renderiza o componente App dentro do modo estrito do React
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

