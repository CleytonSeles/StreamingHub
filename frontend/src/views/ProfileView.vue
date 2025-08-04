<template>
  <div class="profile-view">
    <!-- Profile Header -->
    <div class="profile-header pa-6">
      <div class="d-flex align-center mb-6">
        <v-avatar size="120" color="primary" class="mr-6">
          <v-img
            v-if="user.avatar"
            :src="user.avatar"
            alt="Avatar"
          ></v-img>
          <v-icon v-else size="60">mdi-account</v-icon>
        </v-avatar>
        
        <div class="user-info">
          <h1 class="text-h4 font-weight-bold mb-2">{{ user.username }}</h1>
          <p class="text-body-1 text-medium-emphasis mb-4">{{ user.email }}</p>
          
          <div class="user-stats d-flex gap-6">
            <div class="stat-item">
              <h3 class="text-h6 font-weight-bold">{{ stats.playlists }}</h3>
              <p class="text-body-2 text-medium-emphasis">Playlists</p>
            </div>
            <div class="stat-item">
              <h3 class="text-h6 font-weight-bold">{{ stats.favorites }}</h3>
              <p class="text-body-2 text-medium-emphasis">Favoritas</p>
            </div>
            <div class="stat-item">
              <h3 class="text-h6 font-weight-bold">{{ stats.totalTracks }}</h3>
              <p class="text-body-2 text-medium-emphasis">Músicas</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="profile-actions">
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-pencil"
          @click="showEditDialog = true"
        >
          Editar Perfil
        </v-btn>
        
        <v-btn
          v-if="!user.spotifyConnected"
          color="success"
          variant="outlined"
          prepend-icon="mdi-spotify"
          @click="connectSpotify"
          class="ml-3"
        >
          Conectar Spotify
        </v-btn>
        
        <v-btn
          v-else
          color="success"
          variant="tonal"
          prepend-icon="mdi-check"
          disabled
          class="ml-3"
        >
          Spotify Conectado
        </v-btn>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-content pa-6 pt-0">
      <v-row>
        <!-- Recent Activity -->
        <v-col cols="12" md="8">
          <v-card class="mb-6">
            <v-card-title class="pa-6 pb-4">
              <v-icon class="mr-2">mdi-clock-outline</v-icon>
              Atividade Recente
            </v-card-title>
            
            <v-card-text class="pa-6 pt-0">
              <div v-if="recentActivity.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey">mdi-history</v-icon>
                <p class="text-body-1 text-medium-emphasis mt-4">
                  Nenhuma atividade recente
                </p>
              </div>
              
              <div v-else>
                <div
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  class="activity-item d-flex align-center pa-3 rounded mb-2"
                >
                  <v-icon :color="getActivityColor(activity.type)" class="mr-4">
                    {{ getActivityIcon(activity.type) }}
                  </v-icon>
                  
                  <div class="flex-grow-1">
                    <p class="text-body-1 mb-1">{{ activity.description }}</p>
                    <p class="text-caption text-medium-emphasis">
                      {{ formatDate(activity.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Profile Settings -->
        <v-col cols="12" md="4">
          <v-card class="mb-6">
            <v-card-title class="pa-6 pb-4">
              <v-icon class="mr-2">mdi-cog</v-icon>
              Configurações
            </v-card-title>
            
            <v-card-text class="pa-6 pt-0">
              <v-list>
                <v-list-item @click="showEditDialog = true">
                  <template v-slot:prepend>
                    <v-icon>mdi-account-edit</v-icon>
                  </template>
                  <v-list-item-title>Editar Perfil</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click="showPasswordDialog = true">
                  <template v-slot:prepend>
                    <v-icon>mdi-lock</v-icon>
                  </template>
                  <v-list-item-title>Alterar Senha</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click="exportData">
                  <template v-slot:prepend>
                    <v-icon>mdi-download</v-icon>
                  </template>
                  <v-list-item-title>Exportar Dados</v-list-item-title>
                </v-list-item>
                
                <v-divider class="my-2"></v-divider>
                
                <v-list-item @click="logout" class="text-error">
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-logout</v-icon>
                  </template>
                  <v-list-item-title>Sair</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Usage Statistics -->
          <v-card>
            <v-card-title class="pa-6 pb-4">
              <v-icon class="mr-2">mdi-chart-line</v-icon>
              Estatísticas de Uso
            </v-card-title>
            
            <v-card-text class="pa-6 pt-0">
              <div class="usage-stats">
                <div class="stat-row d-flex justify-space-between align-center mb-3">
                  <span class="text-body-2">Tempo total ouvindo</span>
                  <span class="text-body-2 font-weight-medium">{{ formatListeningTime() }}</span>
                </div>
                
                <div class="stat-row d-flex justify-space-between align-center mb-3">
                  <span class="text-body-2">Músicas reproduzidas</span>
                  <span class="text-body-2 font-weight-medium">{{ stats.totalPlays }}</span>
                </div>
                
                <div class="stat-row d-flex justify-space-between align-center mb-3">
                  <span class="text-body-2">Artista mais ouvido</span>
                  <span class="text-body-2 font-weight-medium">{{ stats.topArtist || 'N/A' }}</span>
                </div>
                
                <div class="stat-row d-flex justify-space-between align-center">
                  <span class="text-body-2">Gênero favorito</span>
                  <span class="text-body-2 font-weight-medium">{{ stats.topGenre || 'N/A' }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Edit Profile Dialog -->
    <v-dialog
      v-model="showEditDialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2">mdi-account-edit</v-icon>
          Editar Perfil
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <div class="text-center mb-6">
            <v-avatar size="100" color="primary" class="mb-4">
              <v-img
                v-if="editForm.avatar"
                :src="editForm.avatar"
                alt="Avatar"
              ></v-img>
              <v-icon v-else size="50">mdi-account</v-icon>
            </v-avatar>
            
            <v-btn
              variant="outlined"
              size="small"
              @click="selectAvatar"
            >
              Alterar Foto
            </v-btn>
            
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarChange"
            >
          </div>
          
          <v-text-field
            v-model="editForm.username"
            label="Nome de usuário"
            variant="outlined"
            hide-details="auto"
            :rules="[v => !!v || 'Nome é obrigatório']"
            class="mb-4"
          ></v-text-field>
          
          <v-text-field
            v-model="editForm.email"
            label="E-mail"
            type="email"
            variant="outlined"
            hide-details="auto"
            :rules="[
              v => !!v || 'E-mail é obrigatório',
              v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
            ]"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="cancelEdit"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="updateProfile"
            :loading="updating"
            :disabled="!editForm.username.trim() || !editForm.email.trim()"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Change Password Dialog -->
    <v-dialog
      v-model="showPasswordDialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2">mdi-lock</v-icon>
          Alterar Senha
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <v-text-field
            v-model="passwordForm.currentPassword"
            label="Senha atual"
            type="password"
            variant="outlined"
            hide-details="auto"
            :rules="[v => !!v || 'Senha atual é obrigatória']"
            class="mb-4"
          ></v-text-field>
          
          <v-text-field
            v-model="passwordForm.newPassword"
            label="Nova senha"
            type="password"
            variant="outlined"
            hide-details="auto"
            :rules="[
              v => !!v || 'Nova senha é obrigatória',
              v => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
            ]"
            class="mb-4"
          ></v-text-field>
          
          <v-text-field
            v-model="passwordForm.confirmPassword"
            label="Confirmar nova senha"
            type="password"
            variant="outlined"
            hide-details="auto"
            :rules="[
              v => !!v || 'Confirmação é obrigatória',
              v => v === passwordForm.newPassword || 'Senhas não coincidem'
            ]"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="cancelPasswordChange"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="changePassword"
            :loading="changingPassword"
            :disabled="!isPasswordFormValid"
          >
            Alterar Senha
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const stats = ref({
  playlists: 0,
  favorites: 0,
  totalTracks: 0,
  totalPlays: 0,
  listeningTime: 0,
  topArtist: null,
  topGenre: null
})

const recentActivity = ref([])
const updating = ref(false)
const changingPassword = ref(false)

// Dialog states
const showEditDialog = ref(false)
const showPasswordDialog = ref(false)

// Form data
const editForm = ref({
  username: '',
  email: '',
  avatar: null
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const avatarInput = ref(null)

// Computed
const user = computed(() => authStore.user || {})

const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword.length >= 6
})

// Methods
const loadUserStats = async () => {
  try {
    const [playlistsRes, favoritesRes] = await Promise.all([
      axios.get('/api/playlists'),
      axios.get('/api/favorites')
    ])
    
    const playlists = playlistsRes.data
    const favorites = favoritesRes.data
    
    stats.value = {
      playlists: playlists.length,
      favorites: favorites.length,
      totalTracks: playlists.reduce((total, playlist) => total + (playlist.tracks?.length || 0), 0),
      totalPlays: Math.floor(Math.random() * 1000), // Mock data
      listeningTime: Math.floor(Math.random() * 10000), // Mock data in minutes
      topArtist: favorites.length > 0 ? favorites[0].artist : null,
      topGenre: 'Pop' // Mock data
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

const loadRecentActivity = async () => {
  // Mock recent activity data
  recentActivity.value = [
    {
      id: 1,
      type: 'playlist_created',
      description: 'Criou a playlist "Minhas Favoritas"',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 2,
      type: 'track_favorited',
      description: 'Curtiu "Bohemian Rhapsody" de Queen',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: 3,
      type: 'track_played',
      description: 'Reproduziu "Imagine" de John Lennon',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ]
}

const getActivityIcon = (type) => {
  switch (type) {
    case 'playlist_created': return 'mdi-playlist-plus'
    case 'track_favorited': return 'mdi-heart'
    case 'track_played': return 'mdi-play'
    default: return 'mdi-information'
  }
}

const getActivityColor = (type) => {
  switch (type) {
    case 'playlist_created': return 'primary'
    case 'track_favorited': return 'red'
    case 'track_played': return 'green'
    default: return 'grey'
  }
}

const formatDate = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days} dia${days > 1 ? 's' : ''} atrás`
  } else if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''} atrás`
  } else {
    return 'Agora mesmo'
  }
}

const formatListeningTime = () => {
  const minutes = stats.value.listeningTime
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}min`
  } else {
    return `${remainingMinutes}min`
  }
}

const connectSpotify = () => {
  authStore.connectSpotify()
}

const selectAvatar = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editForm.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const updateProfile = async () => {
  if (!editForm.value.username.trim() || !editForm.value.email.trim()) return
  
  updating.value = true
  try {
    await authStore.updateProfile({
      username: editForm.value.username.trim(),
      email: editForm.value.email.trim(),
      avatar: editForm.value.avatar
    })
    
    showEditDialog.value = false
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (!isPasswordFormValid.value) return
  
  changingPassword.value = true
  try {
    await axios.put('/auth/change-password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    cancelPasswordChange()
    // TODO: Show success message
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    // TODO: Show error message
  } finally {
    changingPassword.value = false
  }
}

const exportData = async () => {
  try {
    const response = await axios.get('/api/user/export', {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'meus-dados-musicais.json')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const cancelEdit = () => {
  showEditDialog.value = false
  editForm.value = {
    username: user.value.username || '',
    email: user.value.email || '',
    avatar: user.value.avatar || null
  }
}

const cancelPasswordChange = () => {
  showPasswordDialog.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

onMounted(() => {
  editForm.value = {
    username: user.value.username || '',
    email: user.value.email || '',
    avatar: user.value.avatar || null
  }
  
  loadUserStats()
  loadRecentActivity()
})
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
}

.user-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.activity-item {
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.usage-stats {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
}

.stat-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.stat-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .profile-header .d-flex {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-header .v-avatar {
    margin-right: 0 !important;
    margin-bottom: 16px;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .profile-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .profile-actions .v-btn {
    margin-left: 0 !important;
  }
}
</style>