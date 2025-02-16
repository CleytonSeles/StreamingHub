# StreamingHub 🎬

Uma plataforma para compartilhamento de vídeos criada com **Node.js**, **Express**, **MongoDB** no back-end e **React.js** no front-end.

## 🚀 Funcionalidades

- 📌 Cadastro e login de usuários
- 🎥 Upload e visualização de vídeos
- 📜 Criação e gerenciamento de playlists
- 💬 Sistema de comentários e curtidas
- 🔍 Busca e filtros para vídeos


## ⚙️ Instalação e Configuração

### 🔧 Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/en/) (>=14.0)
- [MongoDB](https://www.mongodb.com/docs/manual/installation/) (>=5.0)
- [Git](https://git-scm.com/downloads) (opcional)

### 🖥️ Clonando o Repositório

git clone https://github.com/CleytonSeles/StreamingHub.git

cd StreamingHub

### 📦 Instalando dependências
#### Instalar dependências do back-end
- cd backend
- npm install

#### Instalar dependências do front-end
- cd frontend
- npm install

### 🏃 Rodando a Aplicação
#### Iniciar o back-end
- cd backend
- npm start

#### Em outro terminal, iniciar o front-end
- cd frontend
- npm start

Acesse a aplicação: http://localhost:3000

### 📌 Endpoints da API
#### 🔹 Usuários
[POST] /api/auth/register → Cadastra um novo usuário.

[POST] /api/auth/login → Autentica um usuário.
#### 🔹 Vídeos
[GET] /api/videos → Lista todos os vídeos.

[POST] /api/videos → Adiciona um novo vídeo.
#### 🔹 Playlists
[GET] /api/playlists → Lista todas as playlists.

[POST] /api/playlists → Cria uma nova playlist.

### 💡 Contribuindo
1. Faça um fork do repositório

2. Crie sua branch: git checkout -b minha-feature

3. Adicione suas mudanças: git commit -m 'Adicionei funcionalidade X'

4. Envie um push para a branch: git push origin minha-feature

   **5. Abra um Pull Request! 🚀**
   
### 🛠️ Tecnologias
#### 🔹 Node.js + Express
#### 🔹 MongoDB + Mongoose
#### 🔹 React.js + React Router
#### 🔹 Axios para requisições HTTP
#### 🔹 Multer para upload de arquivos

#### 📄 Licença
Este projeto é open-source e licenciado sob a licença MIT.


🚀 Feito com 💙 por Cleyton.

