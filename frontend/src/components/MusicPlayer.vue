<template>
  <v-footer
    app
    color="surface"
    elevation="8"
    height="90"
    class="music-player"
  >
    <v-container fluid class="pa-2">
      <v-row align="center" no-gutters>
        <!-- Track Info -->
        <v-col cols="3" class="d-flex align-center">
          <v-avatar
            size="56"
            rounded="lg"
            class="mr-3"
          >
            <v-img
              :src="playerStore.currentTrack?.imageUrl || '/placeholder-album.png'"
              :alt="playerStore.currentTrack?.title"
            />
          </v-avatar>
          
          <div class="track-info">
            <div class="track-title text-body-1 font-weight-medium">
              {{ playerStore.currentTrack?.title || 'Nenhuma música' }}
            </div>
            <div class="track-artist text-body-2 text-medium-emphasis">
              {{ playerStore.currentTrack?.artist || 'Artista desconhecido' }}
            </div>
          </div>
        </v-col>

        <!-- Player Controls -->
        <v-col cols="6" class="text-center">
          <div class="player-controls">
            <!-- Control Buttons -->
            <div class="control-buttons mb-2">
              <v-btn
                icon
                size="small"
                variant="text"
                @click="playerStore.toggleShuffle()"
                :color="playerStore.shuffle ? 'primary' : 'default'"
              >
                <v-icon>mdi-shuffle</v-icon>
              </v-btn>

              <v-btn
                icon
                size="small"
                variant="text"
                @click="playerStore.playPrevious()"
                :disabled="!playerStore.canPlayPrevious"
              >
                <v-icon>mdi-skip-previous</v-icon>
              </v-btn>

              <v-btn
                icon
                size="large"
                color="primary"
                @click="playerStore.togglePlay()"
              >
                <v-icon size="32">
                  {{ playerStore.isPlaying ? 'mdi-pause' : 'mdi-play' }}
                </v-icon>
              </v-btn>

              <v-btn
                icon
                size="small"
                variant="text"
                @click="playerStore.playNext()"
                :disabled="!playerStore.canPlayNext"
              >
                <v-icon>mdi-skip-next</v-icon>
              </v-btn>

              <v-btn
                icon
                size="small"
                variant="text"
                @click="playerStore.toggleRepeat()"
                :color="playerStore.repeat !== 'off' ? 'primary' : 'default'"
              >
                <v-icon>
                  {{ getRepeatIcon() }}
                </v-icon>
              </v-btn>
            </div>

            <!-- Progress Bar -->
            <div class="progress-container d-flex align-center">
              <span class="time-text text-caption mr-2">
                {{ playerStore.formattedCurrentTime }}
              </span>
              
              <v-slider
                v-model="progress"
                @update:model-value="onProgressChange"
                :max="100"
                :min="0"
                hide-details
                density="compact"
                color="primary"
                track-color="grey-darken-3"
                class="flex-grow-1"
              />
              
              <span class="time-text text-caption ml-2">
                {{ playerStore.formattedDuration }}
              </span>
            </div>
          </div>
        </v-col>

        <!-- Volume and Actions -->
        <v-col cols="3" class="d-flex align-center justify-end">
          <v-btn
            icon
            size="small"
            variant="text"
            class="mr-2"
          >
            <v-icon>mdi-heart-outline</v-icon>
          </v-btn>

          <div class="volume-control d-flex align-center">
            <v-btn
              icon
              size="small"
              variant="text"
              @click="toggleMute"
            >
              <v-icon>{{ getVolumeIcon() }}</v-icon>
            </v-btn>
            
            <v-slider
              v-model="volume"
              @update:model-value="onVolumeChange"
              :max="1"
              :min="0"
              :step="0.01"
              hide-details
              density="compact"
              color="primary"
              track-color="grey-darken-3"
              style="width: 100px"
              class="ml-2"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

const progress = ref(0)
const volume = ref(playerStore.volume)
const lastVolume = ref(playerStore.volume)

// Watch for progress changes from the store
watch(() => playerStore.progress, (newProgress) => {
  progress.value = newProgress
})

// Watch for volume changes from the store
watch(() => playerStore.volume, (newVolume) => {
  volume.value = newVolume
})

const onProgressChange = (value) => {
  playerStore.seekToProgress(value)
}

const onVolumeChange = (value) => {
  playerStore.setVolume(value)
  if (value > 0) {
    lastVolume.value = value
  }
}

const toggleMute = () => {
  if (volume.value > 0) {
    lastVolume.value = volume.value
    playerStore.setVolume(0)
  } else {
    playerStore.setVolume(lastVolume.value)
  }
}

const getVolumeIcon = () => {
  if (volume.value === 0) return 'mdi-volume-mute'
  if (volume.value < 0.5) return 'mdi-volume-low'
  return 'mdi-volume-high'
}

const getRepeatIcon = () => {
  switch (playerStore.repeat) {
    case 'one': return 'mdi-repeat-once'
    case 'all': return 'mdi-repeat'
    default: return 'mdi-repeat-off'
  }
}
</script>

<style scoped>
.music-player {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.track-info {
  min-width: 0;
  flex: 1;
}

.track-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.track-artist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.player-controls {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.progress-container {
  width: 100%;
}

.time-text {
  min-width: 40px;
  text-align: center;
}

.volume-control {
  min-width: 140px;
}
</style>