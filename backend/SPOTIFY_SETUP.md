# Configuração da API do Spotify

Para que a autenticação com Spotify funcione, você precisa configurar uma aplicação no Spotify Developer Dashboard.

## Passos para configurar:

### 1. Acesse o Spotify Developer Dashboard
- Vá para: https://developer.spotify.com/dashboard
- Faça login com sua conta Spotify

### 2. Crie uma nova aplicação
- Clique em "Create app"
- Preencha os campos:
  - **App name**: Streaming App (ou o nome que preferir)
  - **App description**: Aplicação de streaming de música
  - **Website**: http://localhost:3000
  - **Redirect URI**: `http://localhost:3001/auth/spotify/callback`
- Aceite os termos e clique em "Save"

### 3. Obtenha as credenciais
- Na página da sua aplicação, você verá:
  - **Client ID**: Copie este valor
  - **Client Secret**: Clique em "View client secret" e copie

### 4. Configure o arquivo .env
Edite o arquivo `.env` no diretório backend e substitua os valores:

```env
SPOTIFY_CLIENT_ID="seu_client_id_aqui"
SPOTIFY_CLIENT_SECRET="seu_client_secret_aqui"
```

### 5. Reinicie o servidor
Após configurar as credenciais, reinicie o servidor backend:

```bash
npm run dev
```

## Testando a autenticação

1. Acesse: http://localhost:3001/auth/spotify
2. Você será redirecionado para o Spotify para autorizar a aplicação
3. Após autorizar, será redirecionado de volta para o frontend

## Problemas comuns

- **Invalid redirect URI**: Certifique-se de que a URI de redirecionamento no Spotify Dashboard seja exatamente: `http://localhost:3001/auth/spotify/callback`
- **Invalid client**: Verifique se o Client ID e Client Secret estão corretos no arquivo .env