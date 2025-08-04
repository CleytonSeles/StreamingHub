<template>
  <div class="playlists-view">
    <!-- Header -->
    <div class="playlists-header pa-6">
      <div class="d-flex align-center justify-space-between mb-4">
        <h1 class="text-h4 font-weight-bold">Suas Playlists</h1>
        
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="showCreateDialog = true"
        >
          Nova Playlist
        </v-btn>
      </div>
      
      <p class="text-body-1 text-medium-emphasis">
        Organize suas músicas favoritas em playlists personalizadas
      </p>
    </div>

    <!-- Content -->
    <div class="playlists-content pa-6 pt-0">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-h6 mt-4">Carregando playlists...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="playlists.length === 0" class="empty-state text-center py-8">
        <v-icon size="120" color="grey">mdi-playlist-music-outline</v-icon>
        <h2 class="text-h5 mt-4 mb-2">Nenhuma playlist encontrada</h2>
        <p class="text-body-1 text-medium-emphasis mb-6">
          Crie sua primeira playlist para começar a organizar suas músicas
        </p>
        <v-btn
          color="primary"
          variant="flat"
          size="large"
          prepend-icon="mdi-plus"
          @click="showCreateDialog = true"
        >
          Criar Primeira Playlist
        </v-btn>
      </div>

      <!-- Playlists Grid -->
      <div v-else class="playlists-grid">
        <PlaylistCard
          v-for="playlist in playlists"
          :key="playlist.id"
          :playlist="playlist"
          @click="goToPlaylist(playlist)"
          @edit="editPlaylist"
          @delete="confirmDeletePlaylist"
          @share="sharePlaylist"
        />
      </div>
    </div>

    <!-- Create Playlist Dialog -->
    <v-dialog
      v-model="showCreateDialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2">mdi-playlist-plus</v-icon>
          Nova Playlist
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <v-text-field
            v-model="newPlaylist.name"
            label="Nome da Playlist"
            variant="outlined"
            hide-details="auto"
            :rules="[v => !!v || 'Nome é obrigatório']"
            class="mb-4"
            autofocus
          ></v-text-field>
          
          <v-textarea
            v-model="newPlaylist.description"
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
            @click="cancelCreate"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="createPlaylist"
            :loading="creating"
            :disabled="!newPlaylist.name.trim()"
          >
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            v-model="editingPlaylist.name"
            label="Nome da Playlist"
            variant="outlined"
            hide-details="auto"
            :rules="[v => !!v || 'Nome é obrigatório']"
            class="mb-4"
          ></v-text-field>
          
          <v-textarea
            v-model="editingPlaylist.description"
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
            :disabled="!editingPlaylist.name.trim()"
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
          <p>Tem certeza que deseja excluir a playlist <strong>{{ playlistToDelete?.name }}</strong>?</p>
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

    <!-- Share Dialog -->
    <v-dialog
      v-model="showShareDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-4">
          <v-icon class="mr-2">mdi-share</v-icon>
          Compartilhar Playlist
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <p class="mb-4">Compartilhe sua playlist "{{ playlistToShare?.name }}" com outras pessoas:</p>
          
          <v-text-field
            :value="shareUrl"
            label="Link da Playlist"
            variant="outlined"
            readonly
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copyShareUrl"
          ></v-text-field>
          
          <div class="d-flex gap-2 mt-4">
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-whatsapp"
              @click="shareOnWhatsApp"
            >
              WhatsApp
            </v-btn>
            
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-twitter"
              @click="shareOnTwitter"
            >
              Twitter
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showShareDialog = false"
          >
            Fechar
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
import PlaylistCard from '@/components/PlaylistCard.vue'

const router = useRouter()

// Reactive data
const playlists = ref([])
const loading = ref(false)
const creating = ref(false)
const updating = ref(false)
const deleting = ref(false)

// Dialog states
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const showShareDialog = ref(false)

// Form data
const newPlaylist = ref({
  name: '',
  description: ''
})

const editingPlaylist = ref({
  id: null,
  name: '',
  description: ''
})

const playlistToDelete = ref(null)
const playlistToShare = ref(null)

// Computed
const shareUrl = computed(() => {
  if (!playlistToShare.value) return ''
  return `${window.location.origin}/playlist/${playlistToShare.value.id}`
})

// Methods
const loadPlaylists = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/playlists')
    playlists.value = response.data.map(playlist => ({
      ...playlist,
      trackCount: playlist.tracks?.length || 0
    }))
  } catch (error) {
    console.error('Erro ao carregar playlists:', error)
  } finally {
    loading.value = false
  }
}

const createPlaylist = async () => {
  if (!newPlaylist.value.name.trim()) return
  
  creating.value = true
  try {
    const response = await axios.post('/api/playlists', {
      name: newPlaylist.value.name.trim(),
      description: newPlaylist.value.description.trim() || null
    })
    
    playlists.value.unshift({
      ...response.data,
      trackCount: 0
    })
    
    cancelCreate()
  } catch (error) {
    console.error('Erro ao criar playlist:', error)
  } finally {
    creating.value = false
  }
}

const editPlaylist = (playlist) => {
  editingPlaylist.value = {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description || ''
  }
  showEditDialog.value = true
}

const updatePlaylist = async () => {
  if (!editingPlaylist.value.name.trim()) return
  
  updating.value = true
  try {
    const response = await axios.put(`/api/playlists/${editingPlaylist.value.id}`, {
      name: editingPlaylist.value.name.trim(),
      description: editingPlaylist.value.description.trim() || null
    })
    
    const index = playlists.value.findIndex(p => p.id === editingPlaylist.value.id)
    if (index !== -1) {
      playlists.value[index] = {
        ...playlists.value[index],
        ...response.data
      }
    }
    
    cancelEdit()
  } catch (error) {
    console.error('Erro ao atualizar playlist:', error)
  } finally {
    updating.value = false
  }
}

const confirmDeletePlaylist = (playlist) => {
  playlistToDelete.value = playlist
  showDeleteDialog.value = true
}

const deletePlaylist = async () => {
  if (!playlistToDelete.value) return
  
  deleting.value = true
  try {
    await axios.delete(`/api/playlists/${playlistToDelete.value.id}`)
    
    playlists.value = playlists.value.filter(p => p.id !== playlistToDelete.value.id)
    
    showDeleteDialog.value = false
    playlistToDelete.value = null
  } catch (error) {
    console.error('Erro ao excluir playlist:', error)
  } finally {
    deleting.value = false
  }
}

const sharePlaylist = (playlist) => {
  playlistToShare.value = playlist
  showShareDialog.value = true
}

const copyShareUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    // TODO: Show success message
  } catch (error) {
    console.error('Erro ao copiar URL:', error)
  }
}

const shareOnWhatsApp = () => {
  const text = `Confira minha playlist "${playlistToShare.value.name}": ${shareUrl.value}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const shareOnTwitter = () => {
  const text = `Confira minha playlist "${playlistToShare.value.name}"`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank')
}

const goToPlaylist = (playlist) => {
  router.push(`/playlist/${playlist.id}`)
}

const cancelCreate = () => {
  showCreateDialog.value = false
  newPlaylist.value = {
    name: '',
    description: ''
  }
}

const cancelEdit = () => {
  showEditDialog.value = false
  editingPlaylist.value = {
    id: null,
    name: '',
    description: ''
  }
}

onMounted(() => {
  loadPlaylists()
})
</script>

<style scoped>
.playlists-view {
  min-height: 100vh;
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .playlists-grid {
    grid-template-columns: 1fr;
  }
  
  .playlists-header {
    padding: 16px !important;
  }
  
  .playlists-content {
    padding: 16px !important;
    padding-top: 0 !important;
  }
}
</style>