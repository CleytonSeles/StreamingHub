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

#### 6. **Adicionar Música à Playlist**
- **Método:** `POST`
- **URL:** `/api/playlists/:playlistId/tracks`
- **Body:**
```json
{
  "spotifyTrackId": "spotify_track_id",
  "title": "Nome da Música",
  "artist": "Nome do Artista",
  "album": "Nome do Álbum",
  "durationMs": 180000,
  "imageUrl": "url_da_imagem"
}
```

#### 7. **Remover Música da Playlist**
- **Método:** `DELETE`
- **URL:** `/api/playlists/:playlistId/tracks/:trackId`

## 🔒 Validações Implementadas

1. **Autenticação:** Todas as rotas requerem JWT token válido
2. **Autorização:** Usuários só podem acessar suas próprias playlists
3. **Validação de dados:**
   - Nome da playlist é obrigatório
   - Nome não pode estar vazio
   - Não permite playlists com nomes duplicados para o mesmo usuário
4. **Verificação de existência:** Verifica se playlist existe antes de operações

## 🧪 Como Testar

### Teste Automatizado
Execute o script de teste:
```bash
node test-playlists.js
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

## ✅ Status da Implementação

- ✅ CRUD completo de playlists
- ✅ Autenticação e autorização
- ✅ Validações de dados
- ✅ Tratamento de erros
- ✅ Logs detalhados
- ✅ Testes automatizados
- ✅ Integração com banco de dados
- ✅ Relacionamentos com usuários
- ✅ Contagem de tracks
- ✅ Ordenação por data de criação

## 🎯 Próximos Passos Sugeridos

1. Implementar busca de playlists por nome
2. Adicionar paginação para listagem
3. Implementar playlists públicas/compartilhadas
4. Adicionar funcionalidade de duplicar playlist
5. Implementar reordenação de tracks na playlist