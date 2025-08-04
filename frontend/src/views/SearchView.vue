<template>
  <div class="search-view">
    <!-- Search Header -->
    <div class="search-header pa-6">
      <h1 class="text-h4 font-weight-bold mb-4">Buscar Música</h1>
      
      <!-- Search Input -->
      <v-text-field
        v-model="searchQuery"
        placeholder="Busque por artistas, músicas ou álbuns..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        clearable
        hide-details
        class="search-input"
        @keyup.enter="performSearch"
        @click:clear="clearSearch"
      >
        <template v-slot:append>
          <v-btn
            color="primary"
            variant="flat"
            @click="performSearch"
            :loading="loading"
            :disabled="!searchQuery.trim()"
          >
            Buscar
          </v-btn>
        </template>
      </v-text-field>

      <!-- Search Filters -->
      <div class="search-filters mt-4">
        <v-chip-group
          v-model="selectedFilter"
          selected-class="text-primary"
          mandatory
        >
          <v-chip value="all">Todos</v-chip>
          <v-chip value="track">Músicas</v-chip>
          <v-chip value="artist">Artistas</v-chip>
          <v-chip value="album">Álbuns</v-chip>
        </v-chip-group>
      </div>
    </div>

    <!-- Search Results -->
    <div class="search-results pa-6" v-if="hasSearched">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-h6 mt-4">Buscando...</p>
      </div>

      <!-- No Results -->
      <div v-else-if="!hasResults" class="text-center py-8">
        <v-icon size="64" color="grey">mdi-music-note-off</v-icon>
        <h3 class="text-h5 mt-4 mb-2">Nenhum resultado encontrado</h3>
        <p class="text-body-1 text-medium-emphasis">
          Tente buscar com termos diferentes
        </p>
      </div>

      <!-- Results -->
      <div v-else>
        <!-- Tracks Results -->
        <div v-if="filteredTracks.length > 0" class="results-section mb-8">
          <h2 class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-music-note</v-icon>
            Músicas ({{ filteredTracks.length }})
          </h2>
          
          <div class="tracks-grid">
            <TrackCard
              v-for="(track, index) in filteredTracks"
              :key="track.spotifyTrackId"
              :track="track"
              :playlist="filteredTracks"
              :index="index"
              @favorite="toggleTrackFavorite"
              @addToPlaylist="showAddToPlaylistDialog"
              @share="shareTrack"
            />
          </div>
        </div>

        <!-- Artists Results -->
        <div v-if="filteredArtists.length > 0" class="results-section mb-8">
          <h2 class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-account-music</v-icon>
            Artistas ({{ filteredArtists.length }})
          </h2>
          
          <div class="artists-grid">
            <v-card
              v-for="artist in filteredArtists"
              :key="artist.id"
              class="artist-card"
              hover
              @click="searchArtistTracks(artist)"
            >
              <v-img
                :src="artist.imageUrl || '/placeholder-artist.png'"
                height="200"
                cover
              ></v-img>
              
              <v-card-text class="text-center">
                <h3 class="text-h6 font-weight-medium">{{ artist.name }}</h3>
                <p class="text-body-2 text-medium-emphasis">
                  {{ artist.followers?.toLocaleString() }} seguidores
                </p>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <!-- Albums Results -->
        <div v-if="filteredAlbums.length > 0" class="results-section">
          <h2 class="text-h5 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-album</v-icon>
            Álbuns ({{ filteredAlbums.length }})
          </h2>
          
          <div class="albums-grid">
            <v-card
              v-for="album in filteredAlbums"
              :key="album.id"
              class="album-card"
              hover
              @click="searchAlbumTracks(album)"
            >
              <v-img
                :src="album.imageUrl || '/placeholder-album.png'"
                height="200"
                cover
              ></v-img>
              
              <v-card-text>
                <h3 class="text-subtitle-1 font-weight-medium album-title">
                  {{ album.name }}
                </h3>
                <p class="text-body-2 text-medium-emphasis">
                  {{ album.artist }}
                </p>
                <p class="text-caption text-medium-emphasis">
                  {{ album.releaseDate }} • {{ album.totalTracks }} faixas
                </p>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Searches (when no search performed) -->
    <div v-else class="recent-searches pa-6">
      <h2 class="text-h5 font-weight-bold mb-4">Busque por sua música favorita</h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Explore milhões de músicas, artistas e álbuns
      </p>
      
      <!-- Popular Categories -->
      <div class="popular-categories">
        <h3 class="text-h6 font-weight-medium mb-4">Categorias Populares</h3>
        <div class="categories-grid">
          <v-card
            v-for="category in popularCategories"
            :key="category.name"
            class="category-card"
            :style="{ background: category.color }"
            hover
            @click="searchCategory(category)"
          >
            <v-card-text class="text-center">
              <v-icon size="48" color="white" class="mb-2">{{ category.icon }}</v-icon>
              <h4 class="text-h6 font-weight-bold text-white">{{ category.name }}</h4>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>

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
import TrackCard from '@/components/TrackCard.vue'
import AddToPlaylistDialog from '@/components/AddToPlaylistDialog.vue'

const router = useRouter()

// Reactive data
const searchQuery = ref('')
const selectedFilter = ref('all')
const loading = ref(false)
const hasSearched = ref(false)

// Search results
const tracks = ref([])
const artists = ref([])
const albums = ref([])

// Dialog state
const showAddToPlaylistDialog = ref(false)
const selectedTrack = ref(null)

// Popular categories
const popularCategories = ref([
  { name: 'Pop', icon: 'mdi-star', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Rock', icon: 'mdi-guitar-electric', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Hip Hop', icon: 'mdi-microphone', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Eletrônica', icon: 'mdi-music-note', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Jazz', icon: 'mdi-saxophone', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Clássica', icon: 'mdi-violin', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
])

// Computed properties
const hasResults = computed(() => {
  return tracks.value.length > 0 || artists.value.length > 0 || albums.value.length > 0
})

const filteredTracks = computed(() => {
  return selectedFilter.value === 'all' || selectedFilter.value === 'track' 
    ? tracks.value 
    : []
})

const filteredArtists = computed(() => {
  return selectedFilter.value === 'all' || selectedFilter.value === 'artist' 
    ? artists.value 
    : []
})

const filteredAlbums = computed(() => {
  return selectedFilter.value === 'all' || selectedFilter.value === 'album' 
    ? albums.value 
    : []
})

// Methods
const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  hasSearched.value = true
  
  try {
    const response = await axios.get('/api/search', {
      params: {
        q: searchQuery.value,
        type: selectedFilter.value === 'all' ? 'track,artist,album' : selectedFilter.value
      }
    })
    
    tracks.value = response.data.tracks || []
    artists.value = response.data.artists || []
    albums.value = response.data.albums || []
    
  } catch (error) {
    console.error('Erro na busca:', error)
    // TODO: Show error message to user
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  tracks.value = []
  artists.value = []
  albums.value = []
  hasSearched.value = false
}

const searchCategory = (category) => {
  searchQuery.value = category.name
  performSearch()
}

const searchArtistTracks = (artist) => {
  searchQuery.value = artist.name
  selectedFilter.value = 'track'
  performSearch()
}

const searchAlbumTracks = (album) => {
  searchQuery.value = `album:${album.name} artist:${album.artist}`
  selectedFilter.value = 'track'
  performSearch()
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

const onTrackAddedToPlaylist = () => {
  showAddToPlaylistDialog.value = false
  selectedTrack.value = null
}

const shareTrack = (track) => {
  // TODO: Implement track sharing
  console.log('Share track:', track)
}

onMounted(() => {
  // Check if there's a search query in the route
  const query = router.currentRoute.value.query.q
  if (query) {
    searchQuery.value = query
    performSearch()
  }
})
</script>

<style scoped>
.search-view {
  min-height: 100vh;
}

.search-input {
  max-width: 800px;
}

.tracks-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.artists-grid,
.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.artist-card,
.album-card,
.category-card {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.artist-card:hover,
.album-card:hover,
.category-card:hover {
  transform: translateY(-4px);
}

.album-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.results-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 32px;
}

.results-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

@media (max-width: 600px) {
  .artists-grid,
  .albums-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>