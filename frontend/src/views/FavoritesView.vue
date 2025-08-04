<template>
  <div class="favorites-view">
    <!-- Header -->
    <div class="favorites-header">
      <div class="header-background"></div>
      <div class="header-overlay"></div>
      
      <div class="header-content pa-6">
        <div class="d-flex align-end">
          <div class="favorites-icon-container mr-6">
            <div class="favorites-icon">
              <v-icon size="80" color="white">mdi-heart</v-icon>
            </div>
          </div>
          
          <div class="favorites-info">
            <p class="text-overline text-white mb-2">PLAYLIST</p>
            <h1 class="text-h3 font-weight-bold text-white mb-2">Músicas Curtidas</h1>
            <p class="text-body-1 text-white mb-4">
              Suas músicas favoritas em um só lugar
            </p>
            <div class="favorites-stats text-white">
              <span class="text-body-2">{{ favorites.length }} músicas</span>
              <span class="mx-2" v-if="favorites.length > 0">•</span>
              <span class="text-body-2" v-if="favorites.length > 0">{{ formatTotalDuration() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="favorites-actions pa-6 pb-4" v-if="favorites.length > 0">
      <div class="d-flex align-center gap-3">
        <v-btn
          color="primary"
          variant="flat"
          size="large"
          prepend-icon="mdi-play"
          @click="playFavorites"
        >
          {{ isFavoritesPlaying ? 'Pausar' : 'Reproduzir' }}
        </v-btn>
        
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-shuffle"
          @click="shuffleFavorites"
        >
          Aleatório
        </v-btn>
        
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              v-bind="props"
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          
          <v-list>
            <v-list-item @click="createPlaylistFromFavorites">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-playlist-plus</v-icon>
                Criar playlist com favoritas
              </v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="clearAllFavorites" class="text-error">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-heart-remove</v-icon>
                Limpar todas as favoritas
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Content -->
    <div class="favorites-content pa-6 pt-0">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-h6 mt-4">Carregando favoritas...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="empty-state text-center py-8">
        <v-icon size="120" color="grey">mdi-heart-outline</v-icon>
        <h2 class="text-h5 mt-4 mb-2">Nenhuma música favorita</h2>
        <p class="text-body-1 text-medium-emphasis mb-6">
          Curta suas músicas favoritas para vê-las aqui
        </p>
        <v-btn
          color="primary"
          variant="flat"
          size="large"
          prepend-icon="mdi-magnify"
          @click="goToSearch"
        >
          Buscar Músicas
        </v-btn>
      </div>

      <!-- Favorites List -->
      <div v-else>
        <!-- Sort Options -->
        <div class="sort-options mb-4">
          <div class="d-flex align-center justify-space-between">
            <h2 class="text-h6 font-weight-medium">Suas Favoritas</h2>
            
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-sort"
                  v-bind="props"
                >
                  {{ getSortLabel() }}
                </v-btn>
              </template>
              
              <v-list>
                <v-list-item
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="changeSortOrder(option.value)"
                  :class="{ 'v-list-item--active': sortBy === option.value }"
                >
                  <v-list-item-title>{{ option.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <!-- Tracks List -->
        <div class="tracks-list">
          <TrackCard
            v-for="(track, index) in sortedFavorites"
            :key="track.spotifyTrackId"
            :track="track"
            :playlist="sortedFavorites"
            :index="index"
            @favorite="removeFavorite"
            @addToPlaylist="showAddToPlaylistDialog"
            @share="shareTrack"
          />
        </div>
      </div>
    </div>

    <!-- Create Playlist Dialog -->
    <v-dialog
      v-model="showCreatePlaylistDialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2">mdi-playlist-plus</v-icon>
          Criar Playlist com Favoritas
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <p class="mb-4">
            Criar uma nova playlist com suas {{ favorites.length }} músicas favoritas?
          </p>
          
          <v-text-field
            v-model="newPlaylistName"
            label="Nome da Playlist"
            variant="outlined"
            hide-details="auto"
            :rules="[v => !!v || 'Nome é obrigatório']"
            class="mb-4"
            placeholder="Minhas Favoritas"
          ></v-text-field>
          
          <v-textarea
            v-model="newPlaylistDescription"
            label="Descrição (opcional)"
            variant="outlined"
            rows="3"
            hide-details
            placeholder="Playlist criada a partir das minhas músicas favoritas"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showCreatePlaylistDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="createPlaylist"
            :loading="creatingPlaylist"
            :disabled="!newPlaylistName.trim()"
          >
            Criar Playlist
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Clear Favorites Confirmation -->
    <v-dialog
      v-model="showClearDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2" color="error">mdi-heart-remove</v-icon>
          Limpar Favoritas
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <p>Tem certeza que deseja remover todas as {{ favorites.length }} músicas favoritas?</p>
          <p class="text-body-2 text-medium-emphasis mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showClearDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmClearFavorites"
            :loading="clearingFavorites"
          >
            Limpar Todas
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add to Playlist Dialog -->
    <AddToPlaylistDialog
      v-model="showAddToPlaylistDialog"
      :track="selectedTrack"
      @added="onTrackAddedToPlaylist"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { usePlayerStore } from '@/stores/player'
import TrackCard from '@/components/TrackCard.vue'
import AddToPlaylistDialog from '@/components/AddToPlaylistDialog.vue'

const router = useRouter()
const playerStore = usePlayerStore()

// Reactive data
const favorites = ref([])
const loading = ref(false)
const creatingPlaylist = ref(false)
const clearingFavorites = ref(false)
const sortBy = ref('recent') // recent, title, artist

// Dialog states
const showCreatePlaylistDialog = ref(false)
const showClearDialog = ref(false)
const showAddToPlaylistDialog = ref(false)

// Form data
const newPlaylistName = ref('Minhas Favoritas')
const newPlaylistDescription = ref('Playlist criada a partir das minhas músicas favoritas')
const selectedTrack = ref(null)

// Sort options
const sortOptions = ref([
  { value: 'recent', label: 'Adicionadas recentemente' },
  { value: 'title', label: 'Título (A-Z)' },
  { value: 'artist', label: 'Artista (A-Z)' },
  { value: 'duration', label: 'Duração' }
])

// Computed
const isFavoritesPlaying = computed(() => {
  return playerStore.currentPlaylist?.some(track => 
    favorites.value.some(favorite => 
      favorite.spotifyTrackId === track.spotifyTrackId
    )
  ) && playerStore.isPlaying
})

const sortedFavorites = computed(() => {
  const sorted = [...favorites.value]
  
  switch (sortBy.value) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'artist':
      return sorted.sort((a, b) => a.artist.localeCompare(b.artist))
    case 'duration':
      return sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0))
    case 'recent':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

// Methods
const loadFavorites = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/favorites')
    favorites.value = response.data.map(fav => ({
      ...fav,
      isFavorite: true
    }))
  } catch (error) {
    console.error('Erro ao carregar favoritas:', error)
  } finally {
    loading.value = false
  }
}

const formatTotalDuration = () => {
  const totalMs = favorites.value.reduce((total, track) => total + (track.duration || 0), 0)
  const totalMinutes = Math.floor(totalMs / 60000)
  
  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  return `${hours}h ${minutes}min`
}

const playFavorites = () => {
  if (favorites.value.length === 0) return
  
  if (isFavoritesPlaying.value) {
    playerStore.pause()
  } else {
    playerStore.playTrack(sortedFavorites.value[0], sortedFavorites.value, 0)
  }
}

const shuffleFavorites = () => {
  if (favorites.value.length === 0) return
  
  const shuffled = [...sortedFavorites.value].sort(() => Math.random() - 0.5)
  playerStore.playTrack(shuffled[0], shuffled, 0)
}

const removeFavorite = async (track) => {
  try {
    await axios.delete(`/api/favorites/${track.spotifyTrackId}`)
    favorites.value = favorites.value.filter(fav => fav.spotifyTrackId !== track.spotifyTrackId)
  } catch (error) {
    console.error('Erro ao remover favorita:', error)
  }
}

const createPlaylistFromFavorites = () => {
  if (favorites.value.length === 0) return
  showCreatePlaylistDialog.value = true
}

const createPlaylist = async () => {
  if (!newPlaylistName.value.trim() || favorites.value.length === 0) return
  
  creatingPlaylist.value = true
  try {
    // Create playlist
    const playlistResponse = await axios.post('/api/playlists', {
      name: newPlaylistName.value.trim(),
      description: newPlaylistDescription.value.trim() || null
    })
    
    const playlist = playlistResponse.data
    
    // Add all favorites to playlist
    for (const track of favorites.value) {
      await axios.post(`/api/playlists/${playlist.id}/tracks`, {
        spotifyTrackId: track.spotifyTrackId,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        imageUrl: track.imageUrl
      })
    }
    
    showCreatePlaylistDialog.value = false
    router.push(`/playlist/${playlist.id}`)
    
  } catch (error) {
    console.error('Erro ao criar playlist:', error)
  } finally {
    creatingPlaylist.value = false
  }
}

const clearAllFavorites = () => {
  if (favorites.value.length === 0) return
  showClearDialog.value = true
}

const confirmClearFavorites = async () => {
  clearingFavorites.value = true
  try {
    // Remove all favorites
    await Promise.all(
      favorites.value.map(track => 
        axios.delete(`/api/favorites/${track.spotifyTrackId}`)
      )
    )
    
    favorites.value = []
    showClearDialog.value = false
    
  } catch (error) {
    console.error('Erro ao limpar favoritas:', error)
  } finally {
    clearingFavorites.value = false
  }
}

const changeSortOrder = (newSort) => {
  sortBy.value = newSort
}

const getSortLabel = () => {
  const option = sortOptions.value.find(opt => opt.value === sortBy.value)
  return option ? option.label : 'Ordenar'
}

const showAddToPlaylistDialog = (track) => {
  selectedTrack.value = track
  showAddToPlaylistDialog.value = true
}

const shareTrack = (track) => {
  // TODO: Implement track sharing
  console.log('Share track:', track)
}

const onTrackAddedToPlaylist = () => {
  showAddToPlaylistDialog.value = false
  selectedTrack.value = null
}

const goToSearch = () => {
  router.push('/search')
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.favorites-header {
  position: relative;
  height: 350px;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #e91e63 0%, #ad1457 100%);
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.header-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.favorites-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorites-icon {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .favorites-header {
    height: 300px;
  }
  
  .header-content .d-flex {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .favorites-icon-container {
    margin-right: 0 !important;
    margin-bottom: 24px;
  }
  
  .favorites-icon {
    width: 150px;
    height: 150px;
  }
  
  .favorites-icon .v-icon {
    font-size: 60px !important;
  }
}
</style>