<template>
  <v-container fluid class="fill-height register-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" elevation="8" rounded="lg">
          <v-card-title class="text-center mb-4">
            <v-icon color="primary" size="48" class="mb-2">mdi-music</v-icon>
            <h1 class="text-h4 font-weight-bold">Streaming App</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Crie sua conta
            </p>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleRegister" ref="form">
              <v-text-field
                v-model="userData.username"
                label="Nome de usuário"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[rules.required, rules.username]"
                class="mb-3"
              />

              <v-text-field
                v-model="userData.email"
                label="E-mail"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                class="mb-3"
              />

              <v-text-field
                v-model="userData.password"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :rules="[rules.required, rules.password]"
                class="mb-3"
              />

              <v-text-field
                v-model="userData.confirmPassword"
                label="Confirmar senha"
                prepend-inner-icon="mdi-lock-check"
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                variant="outlined"
                :rules="[rules.required, rules.confirmPassword]"
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
                Criar conta
              </v-btn>

              <div class="text-center">
                <span class="text-medium-emphasis">Já tem uma conta?</span>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="$router.push('/login')"
                  class="ml-1"
                >
                  Faça login
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
const showConfirmPassword = ref(false)

const userData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  required: value => !!value || 'Campo obrigatório',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'E-mail inválido'
  },
  username: value => {
    return (value && value.length >= 3) || 'Nome de usuário deve ter pelo menos 3 caracteres'
  },
  password: value => {
    return (value && value.length >= 6) || 'Senha deve ter pelo menos 6 caracteres'
  },
  confirmPassword: value => {
    return value === userData.password || 'Senhas não coincidem'
  }
}

const handleRegister = async () => {
  const { valid } = await form.value.validate()
  
  if (valid) {
    try {
      const { confirmPassword, ...registerData } = userData
      await authStore.register(registerData)
      router.push('/')
    } catch (error) {
      console.error('Erro no registro:', error)
    }
  }
}
</script>

<style scoped>
.register-container {
  background: linear-gradient(135deg, #1e1e1e 0%, #121212 100%);
  min-height: 100vh;
}

.v-card {
  background-color: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
}
</style>