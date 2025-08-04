# API de Playlists - Documentação

## 🎵 Funcionalidades Implementadas

### Endpoints Disponíveis

Todas as rotas requerem autenticação via JWT token no header `Authorization: Bearer <token>`.

#### 1. **Criar Playlist**
- **Método:** `POST`
- **URL:** `/api/playlists`
- **Body:**
```json
{
  "name": "Nome da Playlist",
  "description": "Descrição opcional",
  "isPublic": true
}
```
- **Resposta:**
```json
{
  "success": true,
  "message": "Playlist criada com sucesso!",
  "data": {
    "id": "uuid",
    "name": "Nome da Playlist",
    "description": "Descrição opcional",
    "isPublic": true,
    "userId": "uuid",
    "createdAt": "2025-08-04T16:33:06.821Z",
    "updatedAt": "2025-08-04T16:33:06.821Z",
    "user": {
      "id": "uuid",
      "username": "Nome do Usuário"
    },
    "_count": {
      "tracks": 0
    }
  }
}
```

#### 2. **Listar Playlists do Usuário**
- **Método:** `GET`
- **URL:** `/api/playlists`
- **Resposta:**
```json
{
  "success": true,
  "message": "X playlist(s) encontrada(s).",
  "data": [
    {
      "id": "uuid",
      "name": "Nome da Playlist",
      "description": "Descrição",
      "isPublic": true,
      "userId": "uuid",
      "createdAt": "2025-08-04T16:33:06.821Z",
      "updatedAt": "2025-08-04T16:33:06.821Z",
      "user": {
        "id": "uuid",
        "username": "Nome do Usuário"
      },
      "_count": {
        "tracks": 5
      }
    }
  ]
}
```

#### 3. **Buscar Playlist Específica**
- **Método:** `GET`
- **URL:** `/api/playlists/:id`
- **Resposta:**
```json
{
  "success": true,
  "message": "Playlist encontrada.",
  "data": {
    "id": "uuid",
    "name": "Nome da Playlist",
    "description": "Descrição",
    "isPublic": true,
    "userId": "uuid",
    "createdAt": "2025-08-04T16:33:06.821Z",
    "updatedAt": "2025-08-04T16:33:06.821Z",
    "user": {
      "id": "uuid",
      "username": "Nome do Usuário"
    },
    "tracks": [
      {
        "id": "uuid",
        "playlistId": "uuid",
        "trackId": "uuid",
        "addedAt": "2025-08-04T16:33:06.821Z",
        "track": {
          "id": "uuid",
          "spotifyTrackId": "spotify_id",
          "title": "Nome da Música",
          "artist": "Nome do Artista",
          "album": "Nome do Álbum",
          "durationMs": 180000,
          "imageUrl": "url_da_imagem"
        }
      }
    ],
    "_count": {
      "tracks": 1
    }
  }
}
```

#### 4. **Atualizar Playlist**
- **Método:** `PUT`
- **URL:** `/api/playlists/:id`
- **Body:**
```json
{
  "name": "Novo Nome",
  "description": "Nova Descrição",
  "isPublic": false
}
```
- **Resposta:** Similar à criação

#### 5. **Deletar Playlist**
- **Método:** `DELETE`
- **URL:** `/api/playlists/:id`
- **Resposta:**
```json
{
  "success": true,
  "message": "Playlist deletada com sucesso!"
}
```

#### 6. **Listar Músicas de uma Playlist**
- **Método:** `GET`
- **URL:** `/api/playlists/:playlistId/tracks`
- **Resposta:**
```json
{
  "success": true,
  "message": "3 música(s) encontrada(s) na playlist.",
  "data": {
    "playlist": {
      "id": "uuid",
      "name": "Nome da Playlist",
      "description": "Descrição",
      "isPublic": true,
      "user": {
        "id": "uuid",
        "username": "Nome do Usuário"
      },
      "createdAt": "2025-08-04T17:21:57.250Z",
      "updatedAt": "2025-08-04T17:21:57.250Z"
    },
    "tracks": [
      {
        "id": "uuid",
        "playlistId": "uuid",
        "trackId": "uuid",
        "addedAt": "2025-08-04T17:21:58.123Z",
        "track": {
          "id": "uuid",
          "spotifyTrackId": "track_001",
          "title": "Bohemian Rhapsody",
          "artist": "Queen",
          "album": "A Night at the Opera",
          "durationMs": 355000,
          "imageUrl": "https://example.com/image.jpg",
          "previewUrl": "https://example.com/preview.mp3",
          "createdAt": "2025-08-04T17:21:58.100Z",
          "updatedAt": "2025-08-04T17:21:58.100Z"
        }
      }
    ]
  }
}
```

#### 7. **Adicionar Música à Playlist**
- **Método:** `POST`
- **URL:** `/api/playlists/:playlistId/tracks`
- **Body:**
```json
{
  "spotifyTrackId": "track_001",
  "title": "Nome da Música",
  "artist": "Nome do Artista",
  "album": "Nome do Álbum",
  "durationMs": 180000,
  "imageUrl": "url_da_imagem",
  "previewUrl": "url_do_preview"
}
```
- **Resposta:**
```json
{
  "success": true,
  "message": "Música adicionada à playlist com sucesso!",
  "data": {
    "id": "uuid",
    "playlistId": "uuid",
    "trackId": "uuid",
    "addedAt": "2025-08-04T17:21:58.123Z",
    "track": {
      "id": "uuid",
      "spotifyTrackId": "track_001",
      "title": "Nome da Música",
      "artist": "Nome do Artista",
      "album": "Nome do Álbum",
      "durationMs": 180000,
      "imageUrl": "url_da_imagem",
      "previewUrl": "url_do_preview",
      "createdAt": "2025-08-04T17:21:58.100Z",
      "updatedAt": "2025-08-04T17:21:58.100Z"
    },
    "playlist": {
      "id": "uuid",
      "name": "Nome da Playlist"
    }
  }
}
```

#### 8. **Remover Música da Playlist**
- **Método:** `DELETE`
- **URL:** `/api/playlists/:playlistId/tracks/:trackId`
- **Resposta:**
```json
{
  "success": true,
  "message": "Música removida da playlist com sucesso!"
}
```

## 🔒 Validações Implementadas

1. **Autenticação:** Todas as rotas requerem JWT token válido
2. **Autorização:** Usuários só podem acessar suas próprias playlists
3. **Validação de dados:**
   - Nome da playlist é obrigatório
   - Nome não pode estar vazio
   - Não permite playlists com nomes duplicados para o mesmo usuário
   - Dados da música são obrigatórios (spotifyTrackId, title, artist)
4. **Verificação de existência:** Verifica se playlist existe antes de operações
5. **Prevenção de duplicatas:** Não permite adicionar a mesma música múltiplas vezes na mesma playlist
6. **Integridade referencial:** Verifica se música existe na playlist antes de remover

## 🧪 Como Testar

### Teste Automatizado

**Teste completo de playlists:**
```bash
node test-playlists.js
```

**Teste de músicas em playlists:**
```bash
node test-playlist-tracks.js
```

### Teste Manual com Postman/Insomnia

1. **Obter Token JWT:**
   - Faça login via `/auth/spotify`
   - Use o token retornado nos headers das requisições

2. **Headers necessários:**
```
Authorization: Bearer <seu_jwt_token>
Content-Type: application/json
```

3. **Exemplos de requisições:**

**Criar playlist:**
```
POST http://localhost:3001/api/playlists
{
  "name": "Minha Playlist",
  "description": "Uma playlist incrível",
  "isPublic": true
}
```

**Listar playlists:**
```
GET http://localhost:3001/api/playlists
```

**Buscar playlist específica:**
```
GET http://localhost:3001/api/playlists/{playlist_id}
```

**Atualizar playlist:**
```
PUT http://localhost:3001/api/playlists/{playlist_id}
{
  "name": "Nome Atualizado",
  "description": "Nova descrição"
}
```

**Deletar playlist:**
```
DELETE http://localhost:3001/api/playlists/{playlist_id}
```

**Listar músicas de uma playlist:**
```
GET http://localhost:3001/api/playlists/{playlist_id}/tracks
```

**Adicionar música à playlist:**
```
POST http://localhost:3001/api/playlists/{playlist_id}/tracks
{
  "spotifyTrackId": "track_001",
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "album": "A Night at the Opera",
  "durationMs": 355000,
  "imageUrl": "https://example.com/image.jpg",
  "previewUrl": "https://example.com/preview.mp3"
}
```

**Remover música da playlist:**
```
DELETE http://localhost:3001/api/playlists/{playlist_id}/tracks/{track_id}
```

## ✅ Status da Implementação

- ✅ Criação de playlists
- ✅ Listagem de playlists do usuário
- ✅ Busca de playlists por nome
- ✅ Atualização de playlists
- ✅ Exclusão de playlists
- ✅ Listagem de músicas de uma playlist
- ✅ Adição de músicas à playlist
- ✅ Remoção de músicas da playlist
- ✅ Autenticação e autorização
- ✅ Validações de dados
- ✅ Prevenção de duplicatas
- ✅ Testes automatizados
- ✅ Documentação da API

## 🎯 Próximos Passos Sugeridos

1. **Sistema de favoritos** - Permitir que usuários marquem playlists como favoritas
2. **Playlists públicas** - Implementar busca e visualização de playlists públicas
3. **Compartilhamento** - Sistema de compartilhamento de playlists
4. **Colaboração** - Permitir múltiplos usuários editarem uma playlist
5. **Ordenação personalizada** - Permitir reordenar músicas nas playlists
6. **Integração com Spotify** - Conectar com a API do Spotify para buscar músicas
7. **Player de música** - Implementar reprodução de previews das músicas
8. **Estatísticas** - Mostrar estatísticas de reprodução e músicas mais populares