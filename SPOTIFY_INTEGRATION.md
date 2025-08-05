# 🎵 Integração Spotify - Guia Completo

## 📋 Visão Geral

A integração com o Spotify foi implementada de forma modular, permitindo que a aplicação funcione tanto com credenciais reais do Spotify quanto com dados simulados (mock) para desenvolvimento.

## 🏗️ Arquitetura

### Componentes Principais

1. **Configuração (`/backend/src/config/spotify.js`)**
   - Centraliza todas as configurações do Spotify
   - Valida credenciais
   - Fornece URLs e headers para requisições

2. **Serviço Mock (`/backend/src/services/spotifyMockService.js`)**
   - Dados simulados para desenvolvimento
   - Funcionalidades completas sem necessidade de credenciais
   - Simula delays de rede e estrutura de dados real

3. **Serviço Principal (`/backend/src/services/spotifyService.js`)**
   - Integração com API real do Spotify
   - Fallback automático para dados mock
   - Gerenciamento de tokens e rate limiting

4. **Rotas API (`/backend/src/routes/spotifyRoutes.js`)**
   - Endpoints RESTful para todas as funcionalidades
   - Documentação automática de parâmetros
   - Tratamento de erros robusto

## 🚀 Configuração

### 1. Obter Credenciais do Spotify

1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Faça login com sua conta Spotify
3. Clique em "Create app"
4. Preencha os dados:
   - **App name**: Streaming App
   - **App description**: Aplicação de streaming de música
   - **Website**: http://localhost:3000
   - **Redirect URI**: http://localhost:3001/auth/spotify/callback
5. Aceite os termos e clique em "Save"
6. Copie o **Client ID** e **Client Secret**

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
# No diretório /backend
cp .env.example .env
```

Edite o arquivo `.env`:

```env
SPOTIFY_CLIENT_ID="seu_client_id_aqui"
SPOTIFY_CLIENT_SECRET="seu_client_secret_aqui"
SPOTIFY_REDIRECT_URI="http://localhost:3001/auth/spotify/callback"
```

### 3. Reiniciar o Servidor

```bash
# No diretório /backend
npm start
```

## 📡 Endpoints da API

### Status do Serviço

```http
GET /api/spotify/status
```

**Resposta:**
```json
{
  "service": "spotify",
  "configured": true,
  "available": true,
  "message": "Spotify configurado e disponível",
  "features": [
    "Busca de músicas",
    "Busca de artistas",
    "Busca de álbuns",
    "Detalhes de tracks",
    "Top tracks de artistas",
    "Tracks populares"
  ]
}
```

### Busca Geral

```http
GET /api/spotify/search?q=queen&type=track,artist,album&limit=20&offset=0
```

**Parâmetros:**
- `q` (obrigatório): Termo de busca
- `type` (opcional): Tipos de busca separados por vírgula (track,artist,album)
- `limit` (opcional): Limite de resultados (padrão: 20, máximo: 50)
- `offset` (opcional): Offset para paginação (padrão: 0)

### Busca Específica

#### Músicas
```http
GET /api/spotify/search/tracks?q=bohemian%20rhapsody&limit=10
```

#### Artistas
```http
GET /api/spotify/search/artists?q=queen&limit=5
```

#### Álbuns
```http
GET /api/spotify/search/albums?q=night%20opera&limit=10
```

### Detalhes de Conteúdo

#### Track Individual
```http
GET /api/spotify/track/mock_track_1
```

#### Múltiplas Tracks
```http
GET /api/spotify/tracks?ids=mock_track_1,mock_track_2,mock_track_3
```

#### Artista
```http
GET /api/spotify/artist/mock_artist_1
```

#### Top Tracks do Artista
```http
GET /api/spotify/artist/mock_artist_1/top-tracks?country=BR
```

### Conteúdo Popular

```http
GET /api/spotify/popular?limit=20
```

## 🔧 Funcionalidades

### ✅ Implementadas

- ✅ **Busca Universal**: Músicas, artistas e álbuns
- ✅ **Busca Específica**: Endpoints dedicados para cada tipo
- ✅ **Detalhes de Conteúdo**: Informações completas de tracks e artistas
- ✅ **Dados Mock**: Funcionamento sem credenciais
- ✅ **Rate Limiting**: Controle de limites da API
- ✅ **Fallback Automático**: Mock quando API falha
- ✅ **Validação de Parâmetros**: Tratamento de erros robusto
- ✅ **Documentação**: Endpoints auto-documentados

### 🔄 Modo de Funcionamento

1. **Com Credenciais Configuradas**:
   - Usa API real do Spotify
   - Dados atualizados em tempo real
   - Rate limiting respeitado
   - Fallback para mock em caso de erro

2. **Sem Credenciais (Desenvolvimento)**:
   - Usa dados mock automaticamente
   - Simula delays de rede
   - Estrutura de dados idêntica à API real
   - Permite desenvolvimento completo

## 🧪 Testando a Integração

### 1. Verificar Status

```bash
curl http://localhost:3001/api/spotify/status
```

### 2. Testar Busca

```bash
curl "http://localhost:3001/api/spotify/search?q=queen&type=track&limit=5"
```

### 3. Testar Track Individual

```bash
curl http://localhost:3001/api/spotify/track/mock_track_1
```

### 4. Testar Tracks Populares

```bash
curl "http://localhost:3001/api/spotify/popular?limit=10"
```

## 📊 Dados Mock Disponíveis

### Tracks
- Bohemian Rhapsody - Queen
- Imagine - John Lennon
- Hotel California - Eagles
- Billie Jean - Michael Jackson
- Stairway to Heaven - Led Zeppelin

### Artistas
- Queen
- John Lennon
- Eagles
- Michael Jackson
- Led Zeppelin

### Álbuns
- A Night at the Opera - Queen
- Imagine - John Lennon
- Hotel California - Eagles
- Thriller - Michael Jackson
- Led Zeppelin IV - Led Zeppelin

## 🔍 Estrutura de Dados

### Track
```json
{
  "id": "track_id",
  "name": "Nome da Música",
  "artists": [
    {
      "name": "Nome do Artista",
      "id": "artist_id"
    }
  ],
  "album": {
    "name": "Nome do Álbum",
    "id": "album_id",
    "images": [
      {
        "url": "https://...",
        "height": 640,
        "width": 640
      }
    ]
  },
  "duration_ms": 355000,
  "explicit": false,
  "external_urls": {
    "spotify": "https://..."
  },
  "preview_url": "https://...",
  "popularity": 85,
  "track_number": 11,
  "type": "track",
  "uri": "spotify:track:..."
}
```

## 🚨 Solução de Problemas

### Problema: "Spotify não configurado"

**Solução:**
1. Verifique se as variáveis de ambiente estão configuradas
2. Reinicie o servidor após configurar o `.env`
3. Verifique se o arquivo `.env` está no diretório correto

### Problema: "Rate limit excedido"

**Solução:**
1. Aguarde o tempo indicado na mensagem de erro
2. Reduza a frequência de requisições
3. Use dados mock para desenvolvimento intensivo

### Problema: "Erro na comunicação com Spotify"

**Solução:**
1. Verifique sua conexão com a internet
2. Confirme se as credenciais estão corretas
3. O sistema automaticamente usará dados mock como fallback

## 🔮 Próximos Passos

### Funcionalidades Futuras
- [ ] **Autenticação de Usuário**: Login com conta Spotify
- [ ] **Playlists do Spotify**: Importar/exportar playlists
- [ ] **Player Integration**: Controle de reprodução
- [ ] **Recomendações**: Sugestões baseadas em preferências
- [ ] **Cache Inteligente**: Armazenamento local de dados
- [ ] **Análise de Dados**: Estatísticas de uso

### Melhorias Técnicas
- [ ] **WebSocket**: Atualizações em tempo real
- [ ] **GraphQL**: API mais eficiente
- [ ] **Microserviços**: Separação de responsabilidades
- [ ] **Monitoramento**: Logs e métricas avançadas

## 📝 Notas Importantes

1. **Desenvolvimento**: A aplicação funciona completamente sem credenciais do Spotify
2. **Produção**: Configure as credenciais para dados reais
3. **Rate Limiting**: A API do Spotify tem limites de requisições
4. **Fallback**: O sistema sempre tenta fornecer dados, mesmo em caso de erro
5. **Modularidade**: Fácil extensão e manutenção do código

---

**Status**: ✅ **IMPLEMENTADO E FUNCIONAL**

A integração Spotify está completa e pronta para uso, tanto em desenvolvimento quanto em produção!