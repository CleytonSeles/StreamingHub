<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 pa-6 pb-4">
        <v-icon class="mr-2">mdi-playlist-plus</v-icon>
        Adicionar à Playlist
      </v-card-title>

      <v-card-text class="pa-6 pt-0">
        <!-- Track Info -->
        <div v-if="track" class="track-preview mb-6">
          <div class="d-flex align-center">
            <v-img
              :src="track.imageUrl || '/placeholder-track.png'"
              width="60"
              height="60"
              cover
              class="rounded mr-4"
            ></v-img>
            
            <div>
              <h4 class="text-subtitle-1 font-weight-medium">{{ track.title }}</h4>
              <p class="text-body-2 text-medium-emphasis">{{ track.artist }}</p>
            </div>
          </div>
        </div>

        <!-- Create New Playlist Option -->
        <v-card
          class="mb-4 playlist-option"
          variant="outlined"
          hover
          @click="showCreateForm = true"
        >
          <v-card-text class="d-flex align-center pa-4">
            <v-avatar color="primary" class="mr-4">
              <v-icon>mdi-plus</v-icon>
            </v-avatar>
            <div>
              <h4 class="text-subtitle-1">Criar Nova Playlist</h4>
              <p class="text-body-2 text-medium-emphasis">
                Crie uma nova playlist com esta música
              </p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Create Playlist Form -->
        <v-expand-transition>
          <v-card v-if="showCreateForm" class="mb-4" variant="tonal">
            <v-card-text class="pa-4">
              <v-text-field
                v-model="newPlaylistName"
                label="Nome da Playlist"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[v => !!v || 'Nome é obrigatório']"
                class="mb-3"
              ></v-text-field>
              
              <v-textarea
                v-model="newPlaylistDescription"
                label="Descrição (opcional)"
                variant="outlined"
                density="compact"
                rows="2"
                hide-details
                class="mb-3"
              ></v-textarea>
              
              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  variant="flat"
                  @click="createAndAddToPlaylist"
                  :loading="creating"
                  :disabled="!newPlaylistName.trim()"
                >
                  Criar e Adicionar
                </v-btn>
                <v-btn
                  variant="outlined"
                  @click="cancelCreate"
                >
                  Cancelar
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Existing Playlists -->
        <div v-if="!showCreateForm">
          <h4 class="text-subtitle-1 mb-3">Suas Playlists</h4>
          
          <!-- Loading -->
          <div v-if="loadingPlaylists" class="text-center py-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          
          <!-- No Playlists -->
          <div v-else-if="playlists.length === 0" class="text-center py-4">
            <v-icon size="48" color="grey">mdi-playlist-music-outline</v-icon>
            <p class="text-body-2 text-medium-emphasis mt-2">
              Você ainda não tem playlists
            </p>
          </div>
          
          <!-- Playlists List -->
          <div v-else class="playlists-list">
            <v-card
              v-for="playlist in playlists"
              :key="playlist.id"
              class="mb-2 playlist-option"
              variant="outlined"
              hover
              @click="addToExistingPlaylist(playlist)"
            >
              <v-card-text class="d-flex align-center pa-3">
                <v-avatar color="primary" variant="tonal" class="mr-3">
                  <v-icon>mdi-playlist-music</v-icon>
                </v-avatar>
                
                <div class="flex-grow-1">
                  <h4 class="text-subtitle-2">{{ playlist.name }}</h4>
                  <p class="text-caption text-medium-emphasis">
                    {{ playlist.trackCount || 0 }} músicas
                  </p>
                </div>
                
                <v-icon color="medium-emphasis">mdi-chevron-right</v-icon>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="closeDialog"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  track: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'added'])

// Reactive data
const playlists = ref([])
const loadingPlaylists = ref(false)
const creating = ref(false)
const showCreateForm = ref(false)
const newPlaylistName = ref('')
const newPlaylistDescription = ref('')

// Computed
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const loadPlaylists = async () => {
  loadingPlaylists.value = true
  try {
    const response = await axios.get('/api/playlists')
    playlists.value = response.data
  } catch (error) {
    console.error('Erro ao carregar playlists:', error)
  } finally {
    loadingPlaylists.value = false
  }
}

const createAndAddToPlaylist = async () => {
  if (!newPlaylistName.value.trim() || !props.track) return
  
  creating.value = true
  try {
    // Create playlist
    const playlistResponse = await axios.post('/api/playlists', {
      name: newPlaylistName.value.trim(),
      description: newPlaylistDescription.value.trim() || null
    })
    
    const newPlaylist = playlistResponse.data
    
    // Add track to playlist
    await axios.post(`/api/playlists/${newPlaylist.id}/tracks`, {
      spotifyTrackId: props.track.spotifyTrackId,
      title: props.track.title,
      artist: props.track.artist,
      album: props.track.album,
      duration: props.track.duration,
      imageUrl: props.track.imageUrl
    })
    
    // Reset form
    resetCreateForm()
    
    // Close dialog and emit success
    emit('added', newPlaylist)
    closeDialog()
    
  } catch (error) {
    console.error('Erro ao criar playlist:', error)
    // TODO: Show error message
  } finally {
    creating.value = false
  }
}

const addToExistingPlaylist = async (playlist) => {
  if (!props.track) return
  
  try {
    await axios.post(`/api/playlists/${playlist.id}/tracks`, {
      spotifyTrackId: props.track.spotifyTrackId,
      title: props.track.title,
      artist: props.track.artist,
      album: props.track.album,
      duration: props.track.duration,
      imageUrl: props.track.imageUrl
    })
    
    // Close dialog and emit success
    emit('added', playlist)
    closeDialog()
    
  } catch (error) {
    console.error('Erro ao adicionar música à playlist:', error)
    // TODO: Show error message
  }
}

const resetCreateForm = () => {
  showCreateForm.value = false
  newPlaylistName.value = ''
  newPlaylistDescription.value = ''
}

const cancelCreate = () => {
  resetCreateForm()
}

const closeDialog = () => {
  dialog.value = false
  resetCreateForm()
}

// Watch for dialog changes
watch(dialog, (newValue) => {
  if (newValue) {
    loadPlaylists()
  } else {
    resetCreateForm()
  }
})
</script>

<style scoped>
.playlist-option {
  cursor: pointer;
  transition: all 0.3s ease;
}

.playlist-option:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.track-preview {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
}

.playlists-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>