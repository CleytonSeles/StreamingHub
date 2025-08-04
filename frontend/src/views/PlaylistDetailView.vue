<template>
  <div class="playlist-detail-view" v-if="playlist">
    <!-- Playlist Header -->
    <div class="playlist-header">
      <div class="header-background" :style="{ backgroundImage: `url(${getPlaylistImage()})` }"></div>
      <div class="header-overlay"></div>
      
      <div class="header-content pa-6">
        <v-btn
          icon
          variant="text"
          color="white"
          class="back-button mb-4"
          @click="goBack"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        
        <div class="d-flex align-end">
          <div class="playlist-image-container mr-6">
            <v-img
              :src="getPlaylistImage()"
              width="200"
              height="200"
              cover
              class="playlist-image rounded"
            >
              <div class="image-overlay">
                <v-btn
                  icon
                  size="x-large"
                  color="primary"
                  class="play-button"
                  @click="playPlaylist"
                  :disabled="!playlist.tracks || playlist.tracks.length === 0"
                >
                  <v-icon size="48">{{ isPlaylistPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                </v-btn>
              </div>
            </v-img>
          </div>
          
          <div class="playlist-info">
            <p class="text-overline text-white mb-2">PLAYLIST</p>
            <h1 class="text-h3 font-weight-bold text-white mb-2">{{ playlist.name }}</h1>
            <p class="text-body-1 text-white mb-4" v-if="playlist.description">
              {{ playlist.description }}
            </p>
            <div class="playlist-stats text-white">
              <span class="text-body-2">{{ playlist.tracks?.length || 0 }} músicas</span>
              <span class="mx-2">•</span>
              <span class="text-body-2">{{ formatTotalDuration() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Playlist Actions -->
    <div class="playlist-actions pa-6 pb-4">
      <div class="d-flex align-center gap-3">
        <v-btn
          color="primary"
          variant="flat"
          size="large"
          prepend-icon="mdi-play"
          @click="playPlaylist"
          :disabled="!playlist.tracks || playlist.tracks.length === 0"
        >
          {{ isPlaylistPlaying ? 'Pausar' : 'Reproduzir' }}
        </v-btn>
        
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-shuffle"
          @click="shufflePlaylist"
          :disabled="!playlist.tracks || playlist.tracks.length === 0"
        >
          Aleatório
        </v-btn>
        
        <v-btn
          icon
          variant="text"
          @click="toggleFavoritePlaylist"
        >
          <v-icon>{{ playlist.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
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
            <v-list-item @click="editPlaylist">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-pencil</v-icon>
                Editar playlist
              </v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="sharePlaylist">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-share</v-icon>
                Compartilhar
              </v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="confirmDeletePlaylist" class="text-error">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-delete</v-icon>
                Excluir playlist
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Tracks List -->
    <div class="tracks-section pa-6 pt-0">
      <!-- Empty State -->
      <div v-if="!playlist.tracks || playlist.tracks.length === 0" class="empty-state text-center py-8">
        <v-icon size="80" color="grey">mdi-music-note-off</v-icon>
        <h3 class="text-h5 mt-4 mb-2">Playlist vazia</h3>
        <p class="text-body-1 text-medium-emphasis mb-6">
          Adicione algumas músicas para começar a ouvir
        </p>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-magnify"
          @click="goToSearch"
        >
          Buscar Músicas
        </v-btn>
      </div>

      <!-- Tracks -->
      <div v-else>
        <!-- Tracks Header -->
        <div class="tracks-header mb-4">
          <div class="d-flex align-center justify-space-between">
            <h2 class="text-h6 font-weight-medium">Músicas</h2>
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-plus"
              @click="goToSearch"
            >
              Adicionar Músicas
            </v-btn>
          </div>
        </div>

        <!-- Tracks List -->
        <div class="tracks-list">
          <TrackCard
            v-for="(track, index) in playlist.tracks"
            :key="track.id"
            :track="track"
            :playlist="playlist.tracks"
            :index="index"
            :can-remove="true"
            @favorite="toggleTrackFavorite"
            @addToPlaylist="showAddToPlaylistDialog"
            @removeFromPlaylist="confirmRemoveTrack"
            @share="shareTrack"
          />
        </div>
      </div>
    </div>

    <!-- Edit Playlist Dialog -->
    <v-dialog
      v-model="showEditDialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2">mdi-pencil</v-icon>
          Editar Playlist
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <v-text-field
            v-model="editForm.name"
            label="Nome da Playlist"
            variant="outlined"
            hide-details="auto"
            :rules="[v => !!v || 'Nome é obrigatório']"
            class="mb-4"
          ></v-text-field>
          
          <v-textarea
            v-model="editForm.description"
            label="Descrição (opcional)"
            variant="outlined"
            rows="3"
            hide-details
          ></v-textarea>
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
            @click="updatePlaylist"
            :loading="updating"
            :disabled="!editForm.name.trim()"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2" color="error">mdi-delete</v-icon>
          Excluir Playlist
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <p>Tem certeza que deseja excluir a playlist <strong>{{ playlist.name }}</strong>?</p>
          <p class="text-body-2 text-medium-emphasis mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="deletePlaylist"
            :loading="deleting"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Remove Track Confirmation Dialog -->
    <v-dialog
      v-model="showRemoveTrackDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2" color="warning">mdi-playlist-remove</v-icon>
          Remover Música
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <p>Tem certeza que deseja remover <strong>{{ trackToRemove?.title }}</strong> desta playlist?</p>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showRemoveTrackDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="warning"
            variant="flat"
            @click="removeTrack"
            :loading="removingTrack"
          >
            Remover
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

  <!-- Loading State -->
  <div v-else-if="loading" class="loading-state d-flex align-center justify-center" style="height: 100vh;">
    <div class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="text-h6 mt-4">Carregando playlist...</p>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="error-state d-flex align-center justify-center" style="height: 100vh;">
    <div class="text-center">
      <v-icon size="80" color="error">mdi-alert-circle</v-icon>
      <h2 class="text-h5 mt-4 mb-2">Playlist não encontrada</h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        A playlist que você está procurando não existe ou foi removida.
      </p>
      <v-btn
        color="primary"
        variant="flat"
        @click="goBack"
      >
        Voltar
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { usePlayerStore } from '@/stores/player'
import TrackCard from '@/components/TrackCard.vue'
import AddToPlaylistDialog from '@/components/AddToPlaylistDialog.vue'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

// Reactive data
const playlist = ref(null)
const loading = ref(false)
const updating = ref(false)
const deleting = ref(false)
const removingTrack = ref(false)

// Dialog states
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const showRemoveTrackDialog = ref(false)
const showAddToPlaylistDialog = ref(false)

// Form data
const editForm = ref({
  name: '',
  description: ''
})

const trackToRemove = ref(null)
const selectedTrack = ref(null)

// Computed
const isPlaylistPlaying = computed(() => {
  return playerStore.currentPlaylist?.some(track => 
    playlist.value?.tracks?.some(playlistTrack => 
      playlistTrack.spotifyTrackId === track.spotifyTrackId
    )
  ) && playerStore.isPlaying
})

// Methods
const loadPlaylist = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/playlists/${route.params.id}`)
    playlist.value = response.data
  } catch (error) {
    console.error('Erro ao carregar playlist:', error)
    playlist.value = null
  } finally {
    loading.value = false
  }
}

const getPlaylistImage = () => {
  if (playlist.value?.tracks && playlist.value.tracks.length > 0) {
    const firstTrackWithImage = playlist.value.tracks.find(track => track.imageUrl)
    if (firstTrackWithImage) {
      return firstTrackWithImage.imageUrl
    }
  }
  return '/placeholder-playlist.png'
}

const formatTotalDuration = () => {
  if (!playlist.value?.tracks) return '0 min'
  
  const totalMs = playlist.value.tracks.reduce((total, track) => total + (track.duration || 0), 0)
  const totalMinutes = Math.floor(totalMs / 60000)
  
  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  return `${hours}h ${minutes}min`
}

const playPlaylist = () => {
  if (!playlist.value?.tracks || playlist.value.tracks.length === 0) return
  
  if (isPlaylistPlaying.value) {
    playerStore.pause()
  } else {
    playerStore.playTrack(playlist.value.tracks[0], playlist.value.tracks, 0)
  }
}

const shufflePlaylist = () => {
  if (!playlist.value?.tracks || playlist.value.tracks.length === 0) return
  
  const shuffledTracks = [...playlist.value.tracks].sort(() => Math.random() - 0.5)
  playerStore.playTrack(shuffledTracks[0], shuffledTracks, 0)
}

const toggleFavoritePlaylist = () => {
  // TODO: Implement favorite playlist functionality
  console.log('Toggle favorite playlist')
}

const editPlaylist = () => {
  editForm.value = {
    name: playlist.value.name,
    description: playlist.value.description || ''
  }
  showEditDialog.value = true
}

const updatePlaylist = async () => {
  if (!editForm.value.name.trim()) return
  
  updating.value = true
  try {
    const response = await axios.put(`/api/playlists/${playlist.value.id}`, {
      name: editForm.value.name.trim(),
      description: editForm.value.description.trim() || null
    })
    
    playlist.value = { ...playlist.value, ...response.data }
    cancelEdit()
  } catch (error) {
    console.error('Erro ao atualizar playlist:', error)
  } finally {
    updating.value = false
  }
}

const confirmDeletePlaylist = () => {
  showDeleteDialog.value = true
}

const deletePlaylist = async () => {
  deleting.value = true
  try {
    await axios.delete(`/api/playlists/${playlist.value.id}`)
    router.push('/playlists')
  } catch (error) {
    console.error('Erro ao excluir playlist:', error)
  } finally {
    deleting.value = false
  }
}

const sharePlaylist = () => {
  // TODO: Implement playlist sharing
  console.log('Share playlist')
}

const toggleTrackFavorite = async (track) => {
  try {
    if (track.isFavorite) {
      await axios.delete(`/api/favorites/${track.spotifyTrackId}`)
    } else {
      await axios.post('/api/favorites', {
        spotifyTrackId: track.spotifyTrackId,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        imageUrl: track.imageUrl
      })
    }
    
    track.isFavorite = !track.isFavorite
  } catch (error) {
    console.error('Erro ao alterar favorito:', error)
  }
}

const showAddToPlaylistDialog = (track) => {
  selectedTrack.value = track
  showAddToPlaylistDialog.value = true
}

const confirmRemoveTrack = (track) => {
  trackToRemove.value = track
  showRemoveTrackDialog.value = true
}

const removeTrack = async () => {
  if (!trackToRemove.value) return
  
  removingTrack.value = true
  try {
    await axios.delete(`/api/playlists/${playlist.value.id}/tracks/${trackToRemove.value.id}`)
    
    playlist.value.tracks = playlist.value.tracks.filter(t => t.id !== trackToRemove.value.id)
    
    showRemoveTrackDialog.value = false
    trackToRemove.value = null
  } catch (error) {
    console.error('Erro ao remover música:', error)
  } finally {
    removingTrack.value = false
  }
}

const shareTrack = (track) => {
  // TODO: Implement track sharing
  console.log('Share track:', track)
}

const onTrackAddedToPlaylist = () => {
  showAddToPlaylistDialog.value = false
  selectedTrack.value = null
}

const cancelEdit = () => {
  showEditDialog.value = false
  editForm.value = {
    name: '',
    description: ''
  }
}

const goBack = () => {
  router.go(-1)
}

const goToSearch = () => {
  router.push('/search')
}

// Watch for route changes
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadPlaylist()
  }
}, { immediate: true })

onMounted(() => {
  loadPlaylist()
})
</script>

<style scoped>
.playlist-header {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px);
  transform: scale(1.1);
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.7) 100%
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

.playlist-image-container {
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 4px;
}

.playlist-image-container:hover .image-overlay {
  opacity: 1;
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
  .playlist-header {
    height: 300px;
  }
  
  .header-content .d-flex {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .playlist-image-container {
    margin-right: 0 !important;
    margin-bottom: 24px;
  }
  
  .playlist-image-container .v-img {
    width: 150px !important;
    height: 150px !important;
  }
}
</style>