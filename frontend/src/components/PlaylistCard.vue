<template>
  <v-card
    class="playlist-card"
    hover
    @click="$emit('click')"
  >
    <v-img
      :src="getPlaylistImage()"
      height="200"
      cover
      class="playlist-image"
    >
      <div class="playlist-overlay">
        <v-btn
          icon
          size="large"
          color="primary"
          class="play-button"
          @click.stop="playPlaylist"
        >
          <v-icon size="32">mdi-play</v-icon>
        </v-btn>
      </div>
    </v-img>

    <v-card-text class="pa-4">
      <h3 class="text-h6 font-weight-medium mb-1 playlist-title">
        {{ playlist.name }}
      </h3>
      
      <p class="text-body-2 text-medium-emphasis mb-2 playlist-description">
        {{ playlist.description || 'Sem descrição' }}
      </p>
      
      <div class="d-flex align-center justify-space-between">
        <div class="playlist-info">
          <v-chip
            size="small"
            variant="outlined"
            color="primary"
          >
            {{ playlist.trackCount || 0 }} músicas
          </v-chip>
        </div>
        
        <div class="playlist-actions">
          <v-btn
            icon
            size="small"
            variant="text"
            @click.stop="toggleFavorite"
          >
            <v-icon>
              {{ playlist.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
          </v-btn>
          
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                size="small"
                variant="text"
                v-bind="props"
                @click.stop
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            
            <v-list>
              <v-list-item @click="editPlaylist">
                <v-list-item-title>
                  <v-icon class="mr-2">mdi-pencil</v-icon>
                  Editar
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item @click="sharePlaylist">
                <v-list-item-title>
                  <v-icon class="mr-2">mdi-share</v-icon>
                  Compartilhar
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item @click="deletePlaylist" class="text-error">
                <v-list-item-title>
                  <v-icon class="mr-2">mdi-delete</v-icon>
                  Excluir
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'edit', 'delete', 'share'])

const playerStore = usePlayerStore()

const getPlaylistImage = () => {
  // If playlist has tracks with images, use the first one
  if (props.playlist.tracks && props.playlist.tracks.length > 0) {
    const firstTrackWithImage = props.playlist.tracks.find(track => track.imageUrl)
    if (firstTrackWithImage) {
      return firstTrackWithImage.imageUrl
    }
  }
  
  // Default playlist image
  return '/placeholder-playlist.png'
}

const playPlaylist = () => {
  if (props.playlist.tracks && props.playlist.tracks.length > 0) {
    playerStore.playTrack(props.playlist.tracks[0], props.playlist.tracks, 0)
  }
}

const toggleFavorite = () => {
  // TODO: Implement favorite playlist functionality
  console.log('Toggle favorite playlist:', props.playlist.id)
}

const editPlaylist = () => {
  emit('edit', props.playlist)
}

const sharePlaylist = () => {
  emit('share', props.playlist)
}

const deletePlaylist = () => {
  emit('delete', props.playlist)
}
</script>

<style scoped>
.playlist-card {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.playlist-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.08);
}

.playlist-image {
  position: relative;
}

.playlist-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.playlist-card:hover .playlist-overlay {
  opacity: 1;
}

.play-button {
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.playlist-card:hover .play-button {
  transform: scale(1);
}

.playlist-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5em;
}

.playlist-actions {
  display: flex;
  gap: 4px;
}
</style>