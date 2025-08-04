<template>
  <v-container fluid class="pa-6">
    <!-- Welcome Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="welcome-section">
          <h1 class="text-h3 font-weight-bold mb-2">
            Olá, {{ authStore.user?.username }}! 👋
          </h1>
          <p class="text-h6 text-medium-emphasis">
            {{ getGreeting() }}
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-medium mb-4">Ações Rápidas</h2>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card
              class="quick-action-card"
              hover
              @click="$router.push('/search')"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="primary" class="mb-3">
                  mdi-magnify
                </v-icon>
                <h3 class="text-h6 mb-2">Buscar Música</h3>
                <p class="text-body-2 text-medium-emphasis">
                  Encontre suas músicas favoritas
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="quick-action-card"
              hover
              @click="$router.push('/playlists')"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="primary" class="mb-3">
                  mdi-playlist-music
                </v-icon>
                <h3 class="text-h6 mb-2">Suas Playlists</h3>
                <p class="text-body-2 text-medium-emphasis">
                  Gerencie suas coleções
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="quick-action-card"
              hover
              @click="$router.push('/favorites')"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="primary" class="mb-3">
                  mdi-heart
                </v-icon>
                <h3 class="text-h6 mb-2">Favoritas</h3>
                <p class="text-body-2 text-medium-emphasis">
                  Suas músicas curtidas
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="quick-action-card"
              hover
              @click="authStore.connectSpotify"
              v-if="!authStore.user?.spotifyAccessToken"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="success" class="mb-3">
                  mdi-spotify
                </v-icon>
                <h3 class="text-h6 mb-2">Conectar Spotify</h3>
                <p class="text-body-2 text-medium-emphasis">
                  Acesse seu catálogo
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Recent Playlists -->
    <v-row class="mb-6" v-if="recentPlaylists.length > 0">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-medium">Playlists Recentes</h2>
          <v-btn
            variant="text"
            color="primary"
            @click="$router.push('/playlists')"
          >
            Ver todas
          </v-btn>
        </div>
        
        <v-row>
          <v-col
            v-for="playlist in recentPlaylists.slice(0, 4)"
            :key="playlist.id"
            cols="12"
            sm="6"
            md="3"
          >
            <PlaylistCard
              :playlist="playlist"
              @click="$router.push(`/playlists/${playlist.id}`)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-medium mb-4">Suas Estatísticas</h2>
        <v-row>
          <v-col cols="12" sm="4">
            <v-card class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="primary" class="mb-2">
                  mdi-playlist-music
                </v-icon>
                <h3 class="text-h4 font-weight-bold">{{ stats.playlists }}</h3>
                <p class="text-body-2 text-medium-emphasis">Playlists</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="primary" class="mb-2">
                  mdi-music
                </v-icon>
                <h3 class="text-h4 font-weight-bold">{{ stats.tracks }}</h3>
                <p class="text-body-2 text-medium-emphasis">Músicas</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card class="stats-card">
              <v-card-text class="text-center pa-4">
                <v-icon size="32" color="primary" class="mb-2">
                  mdi-heart
                </v-icon>
                <h3 class="text-h4 font-weight-bold">{{ stats.favorites }}</h3>
                <p class="text-body-2 text-medium-emphasis">Favoritas</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PlaylistCard from '@/components/PlaylistCard.vue'
import axios from 'axios'

const authStore = useAuthStore()
const recentPlaylists = ref([])
const stats = ref({
  playlists: 0,
  tracks: 0,
  favorites: 0
})

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia! Que tal começar o dia com uma boa música?'
  if (hour < 18) return 'Boa tarde! Hora de relaxar com suas músicas favoritas.'
  return 'Boa noite! Desfrute de uma playlist para relaxar.'
}

const fetchDashboardData = async () => {
  try {
    // Fetch recent playlists
    const playlistsResponse = await axios.get('/api/playlists')
    recentPlaylists.value = playlistsResponse.data.data || []
    
    // Calculate stats
    stats.value.playlists = recentPlaylists.value.length
    
    // You can add more API calls here for tracks and favorites count
    // For now, we'll use placeholder values
    stats.value.tracks = recentPlaylists.value.reduce((total, playlist) => {
      return total + (playlist.trackCount || 0)
    }, 0)
    
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.welcome-section {
  background: linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(30, 215, 96, 0.05) 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(29, 185, 84, 0.2);
}

.quick-action-card {
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
}

.quick-action-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.08);
}

.stats-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>