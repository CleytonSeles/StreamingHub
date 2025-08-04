<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-if="authStore.isAuthenticated"
      v-model="drawer"
      app
      permanent
      width="280"
      color="surface"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="authStore.user?.username || 'Usuário'"
          subtitle="Meu perfil"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Início"
          value="home"
          to="/"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-magnify"
          title="Buscar"
          value="search"
          to="/search"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-playlist-music"
          title="Suas Playlists"
          value="playlists"
          to="/playlists"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-heart"
          title="Músicas Curtidas"
          value="favorites"
          to="/favorites"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            color="error"
            variant="outlined"
            @click="logout"
            prepend-icon="mdi-logout"
          >
            Sair
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      v-if="authStore.isAuthenticated"
      app
      color="surface"
      elevation="1"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title>
        <v-icon color="primary" class="mr-2">mdi-music</v-icon>
        Streaming App
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        icon="mdi-account-circle"
        @click="$router.push('/profile')"
      ></v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Music Player (Fixed Bottom) -->
    <MusicPlayer v-if="authStore.isAuthenticated && playerStore.currentTrack" />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePlayerStore } from '@/stores/player'
import MusicPlayer from '@/components/MusicPlayer.vue'

const authStore = useAuthStore()
const playerStore = usePlayerStore()
const drawer = ref(true)

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.v-app {
  background-color: #121212;
}
</style>