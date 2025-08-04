<template>
  <v-container fluid class="fill-height login-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" elevation="8" rounded="lg">
          <v-card-title class="text-center mb-4">
            <v-icon color="primary" size="48" class="mb-2">mdi-music</v-icon>
            <h1 class="text-h4 font-weight-bold">Streaming App</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Entre na sua conta
            </p>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="credentials.username"
                label="Nome de usuário"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[rules.required]"
                class="mb-3"
              />

              <v-text-field
                v-model="credentials.password"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :rules="[rules.required]"
                class="mb-4"
              />

              <v-alert
                v-if="authStore.error"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ authStore.error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="authStore.loading"
                class="mb-4"
              >
                Entrar
              </v-btn>

              <v-divider class="my-4">
                <span class="text-medium-emphasis px-4">ou</span>
              </v-divider>

              <v-btn
                color="success"
                variant="outlined"
                size="large"
                block
                prepend-icon="mdi-spotify"
                @click="authStore.connectSpotify"
                class="mb-4"
              >
                Conectar com Spotify
              </v-btn>

              <div class="text-center">
                <span class="text-medium-emphasis">Não tem uma conta?</span>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="$router.push('/register')"
                  class="ml-1"
                >
                  Registre-se
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref(null)
const showPassword = ref(false)

const credentials = reactive({
  username: '',
  password: ''
})

const rules = {
  required: value => !!value || 'Campo obrigatório'
}

const handleLogin = async () => {
  const { valid } = await form.value.validate()
  
  if (valid) {
    try {
      await authStore.login(credentials)
      router.push('/')
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #1e1e1e 0%, #121212 100%);
  min-height: 100vh;
}

.v-card {
  background-color: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
}
</style>