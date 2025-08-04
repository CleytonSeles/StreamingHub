<template>
  <v-card
    class="track-card"
    :class="{ 'track-playing': isPlaying }"
    hover
    @click="playTrack"
  >
    <div class="d-flex align-center pa-3">
      <!-- Track Image -->
      <div class="track-image-container">
        <v-img
          :src="track.imageUrl || '/placeholder-track.png'"
          width="60"
          height="60"
          cover
          class="track-image rounded"
        >
          <div class="track-overlay">
            <v-btn
              icon
              size="small"
              color="primary"
              class="play-button"
            >
              <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>
          </div>
        </v-img>
      </div>

      <!-- Track Info -->
      <div class="track-info flex-grow-1 ml-4">
        <h4 class="text-subtitle-1 font-weight-medium track-title">
          {{ track.title }}
        </h4>
        <p class="text-body-2 text-medium-emphasis track-artist">
          {{ track.artist }}
        </p>
        <p class="text-caption text-medium-emphasis track-album" v-if="track.album">
          {{ track.album }}
        </p>
      </div>

      <!-- Track Duration -->
      <div class="track-duration mr-3">
        <span class="text-body-2 text-medium-emphasis">
          {{ formatDuration(track.duration) }}
        </span>
      </div>

      <!-- Track Actions -->
      <div class="track-actions">
        <v-btn
          icon
          size="small"
          variant="text"
          @click.stop="toggleFavorite"
        >
          <v-icon color="red" v-if="track.isFavorite">mdi-heart</v-icon>
          <v-icon v-else>mdi-heart-outline</v-icon>
        </v-btn>

        <v-menu v-if="showMenu">
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
            <v-list-item @click="addToPlaylist">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-playlist-plus</v-icon>
                Adicionar à playlist
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="shareTrack">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-share</v-icon>
                Compartilhar
              </v-list-item-title>
            </v-list-item>

            <v-list-item 
              v-if="canRemove"
              @click="removeFromPlaylist"
              class="text-error"
            >
              <v-list-item-title>
                <v-icon class="mr-2">mdi-playlist-remove</v-icon>
                Remover da playlist
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'

const props = defineProps({
  track: {
    type: Object,
    required: true
  },
  playlist: {
    type: Array,
    default: () => []
  },
  index: {
    type: Number,
    default: 0
  },
  showMenu: {
    type: Boolean,
    default: true
  },
  canRemove: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['favorite', 'addToPlaylist', 'removeFromPlaylist', 'share'])

const playerStore = usePlayerStore()

const isPlaying = computed(() => {
  return playerStore.currentTrack?.spotifyTrackId === props.track.spotifyTrackId && 
         playerStore.isPlaying
})

const playTrack = () => {
  if (isPlaying.value) {
    playerStore.pause()
  } else {
    playerStore.playTrack(props.track, props.playlist, props.index)
  }
}

const toggleFavorite = () => {
  emit('favorite', props.track)
}

const addToPlaylist = () => {
  emit('addToPlaylist', props.track)
}

const removeFromPlaylist = () => {
  emit('removeFromPlaylist', props.track)
}

const shareTrack = () => {
  emit('share', props.track)
}

const formatDuration = (duration) => {
  if (!duration) return '0:00'
  
  const minutes = Math.floor(duration / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.track-card {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  border: 1px solid transparent;
}

.track-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.track-playing {
  background: rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.5);
}

.track-image-container {
  position: relative;
}

.track-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 4px;
}

.track-card:hover .track-overlay {
  opacity: 1;
}

.track-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.track-artist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.track-album {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.track-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 600px) {
  .track-title,
  .track-artist,
  .track-album {
    max-width: 150px;
  }
  
  .track-duration {
    display: none;
  }
}
</style>