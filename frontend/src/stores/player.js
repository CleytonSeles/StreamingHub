import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const currentTrack = ref(null)
  const isPlaying = ref(false)
  const volume = ref(0.5)
  const currentTime = ref(0)
  const duration = ref(0)
  const playlist = ref([])
  const currentIndex = ref(0)
  const shuffle = ref(false)
  const repeat = ref('off') // 'off', 'one', 'all'
  
  // Audio element
  const audio = ref(null)

  const progress = computed(() => {
    if (!duration.value) return 0
    return (currentTime.value / duration.value) * 100
  })

  const formattedCurrentTime = computed(() => {
    return formatTime(currentTime.value)
  })

  const formattedDuration = computed(() => {
    return formatTime(duration.value)
  })

  const canPlayPrevious = computed(() => {
    return playlist.value.length > 0 && (currentIndex.value > 0 || repeat.value === 'all')
  })

  const canPlayNext = computed(() => {
    return playlist.value.length > 0 && (currentIndex.value < playlist.value.length - 1 || repeat.value === 'all')
  })

  const initializeAudio = () => {
    if (!audio.value) {
      audio.value = new Audio()
      
      audio.value.addEventListener('loadedmetadata', () => {
        duration.value = audio.value.duration
      })
      
      audio.value.addEventListener('timeupdate', () => {
        currentTime.value = audio.value.currentTime
      })
      
      audio.value.addEventListener('ended', () => {
        handleTrackEnd()
      })
      
      audio.value.addEventListener('error', (e) => {
        console.error('Erro no player:', e)
        isPlaying.value = false
      })
    }
  }

  const playTrack = (track, trackList = null, index = 0) => {
    initializeAudio()
    
    currentTrack.value = track
    
    if (trackList) {
      playlist.value = trackList
      currentIndex.value = index
    }
    
    if (track.previewUrl) {
      audio.value.src = track.previewUrl
      audio.value.volume = volume.value
      
      audio.value.play().then(() => {
        isPlaying.value = true
      }).catch(error => {
        console.error('Erro ao reproduzir:', error)
        isPlaying.value = false
      })
    } else {
      console.warn('Track sem preview URL:', track.title)
    }
  }

  const togglePlay = () => {
    if (!audio.value || !currentTrack.value) return
    
    if (isPlaying.value) {
      audio.value.pause()
      isPlaying.value = false
    } else {
      audio.value.play().then(() => {
        isPlaying.value = true
      }).catch(error => {
        console.error('Erro ao reproduzir:', error)
      })
    }
  }

  const setVolume = (newVolume) => {
    volume.value = newVolume
    if (audio.value) {
      audio.value.volume = newVolume
    }
  }

  const seek = (time) => {
    if (audio.value) {
      audio.value.currentTime = time
      currentTime.value = time
    }
  }

  const seekToProgress = (progressPercent) => {
    if (audio.value && duration.value) {
      const time = (progressPercent / 100) * duration.value
      seek(time)
    }
  }

  const playNext = () => {
    if (!playlist.value.length) return
    
    let nextIndex = currentIndex.value + 1
    
    if (shuffle.value) {
      nextIndex = Math.floor(Math.random() * playlist.value.length)
    } else if (nextIndex >= playlist.value.length) {
      if (repeat.value === 'all') {
        nextIndex = 0
      } else {
        return
      }
    }
    
    currentIndex.value = nextIndex
    playTrack(playlist.value[nextIndex], playlist.value, nextIndex)
  }

  const playPrevious = () => {
    if (!playlist.value.length) return
    
    let prevIndex = currentIndex.value - 1
    
    if (prevIndex < 0) {
      if (repeat.value === 'all') {
        prevIndex = playlist.value.length - 1
      } else {
        return
      }
    }
    
    currentIndex.value = prevIndex
    playTrack(playlist.value[prevIndex], playlist.value, prevIndex)
  }

  const handleTrackEnd = () => {
    if (repeat.value === 'one') {
      seek(0)
      audio.value.play()
    } else {
      playNext()
    }
  }

  const toggleShuffle = () => {
    shuffle.value = !shuffle.value
  }

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one']
    const currentModeIndex = modes.indexOf(repeat.value)
    repeat.value = modes[(currentModeIndex + 1) % modes.length]
  }

  const stop = () => {
    if (audio.value) {
      audio.value.pause()
      audio.value.currentTime = 0
    }
    isPlaying.value = false
    currentTime.value = 0
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playlist,
    currentIndex,
    shuffle,
    repeat,
    progress,
    formattedCurrentTime,
    formattedDuration,
    canPlayPrevious,
    canPlayNext,
    playTrack,
    togglePlay,
    setVolume,
    seek,
    seekToProgress,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    stop
  }
})