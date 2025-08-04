<template>
  <div class="spotify-callback">
    <v-container class="fill-height">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="text-center pa-8">
            <div v-if="loading">
              <v-progress-circular
                indeterminate
                color="success"
                size="64"
                class="mb-4"
              ></v-progress-circular>
              
              <h2 class="text-h5 mb-4">Conectando com Spotify</h2>
              <p class="text-body-1 text-medium-emphasis">
                Aguarde enquanto processamos sua conexão...
              </p>
            </div>

            <div v-else-if="success">
              <v-icon
                color="success"
                size="64"
                class="mb-4"
              >
                mdi-check-circle
              </v-icon>
              
              <h2 class="text-h5 mb-4 text-success">Conectado com sucesso!</h2>
              <p class="text-body-1 text-medium-emphasis mb-6">
                Sua conta foi conectada ao Spotify. Agora você pode acessar um catálogo completo de músicas.
              </p>
              
              <v-btn
                color="primary"
                variant="flat"
                size="large"
                @click="goToHome"
                prepend-icon="mdi-home"
              >
                Ir para Início
              </v-btn>
            </div>

            <div v-else-if="error">
              <v-icon
                color="error"
                size="64"
                class="mb-4"
              >
                mdi-alert-circle
              </v-icon>
              
              <h2 class="text-h5 mb-4 text-error">Erro na conexão</h2>
              <p class="text-body-1 text-medium-emphasis mb-6">
                {{ errorMessage }}
              </p>
              
              <div class="d-flex flex-column gap-3">
                <v-btn
                  color="primary"
                  variant="flat"
                  @click="retryConnection"
                  prepend-icon="mdi-refresh"
                >
                  Tentar Novamente
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  @click="goToProfile"
                  prepend-icon="mdi-account"
                >
                  Ir para Perfil
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')

// Methods
const handleSpotifyCallback = async () => {
  try {
    const { code, state, error: spotifyError } = route.query
    
    // Check for Spotify errors
    if (spotifyError) {
      throw new Error(getSpotifyErrorMessage(spotifyError))
    }
    
    // Validate required parameters
    if (!code) {
      throw new Error('Código de autorização não encontrado')
    }
    
    // Send authorization code to backend
    const response = await axios.post('/auth/spotify/callback', {
      code,
      state
    })
    
    if (response.data.success) {
      // Update user data in store
      await authStore.fetchUser()
      
      success.value = true
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        goToHome()
      }, 3000)
    } else {
      throw new Error(response.data.message || 'Erro desconhecido')
    }
    
  } catch (err) {
    console.error('Erro no callback do Spotify:', err)
    error.value = true
    errorMessage.value = err.response?.data?.message || err.message || 'Erro ao conectar com Spotify'
  } finally {
    loading.value = false
  }
}

const getSpotifyErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'access_denied':
      return 'Acesso negado. Você precisa autorizar o acesso ao Spotify.'
    case 'invalid_request':
      return 'Solicitação inválida. Tente novamente.'
    case 'unauthorized_client':
      return 'Cliente não autorizado. Entre em contato com o suporte.'
    case 'unsupported_response_type':
      return 'Tipo de resposta não suportado.'
    case 'invalid_scope':
      return 'Escopo inválido solicitado.'
    case 'server_error':
      return 'Erro no servidor do Spotify. Tente novamente mais tarde.'
    case 'temporarily_unavailable':
      return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
    default:
      return `Erro do Spotify: ${errorCode}`
  }
}

const retryConnection = () => {
  // Reset state and try again
  loading.value = true
  success.value = false
  error.value = false
  errorMessage.value = ''
  
  // Redirect to Spotify auth
  authStore.connectSpotify()
}

const goToHome = () => {
  router.push('/')
}

const goToProfile = () => {
  router.push('/profile')
}

// Lifecycle
onMounted(() => {
  // Add a small delay to show loading state
  setTimeout(() => {
    handleSpotifyCallback()
  }, 1000)
})
</script>

<style scoped>
.spotify-callback {
  min-height: 100vh;
  background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
}

.v-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.gap-3 {
  gap: 12px;
}

@media (max-width: 600px) {
  .v-card {
    margin: 16px;
  }
  
  .d-flex.flex-column {
    width: 100%;
  }
  
  .v-btn {
    width: 100%;
  }
}
</style>