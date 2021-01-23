<template>
  sup lobbies
  <input type="text" v-model="lobbyName" />
  <input type="submit" value="Create Lobby" v-on:click="createLobby" />
  <div v-if="loading">Loading...</div>
  <ul>
    <li v-for="lobby in lobbies" :key="lobby.id">
      <router-link :to="{ name: 'lobby', params: { lobbyId: lobby.id }}">
        {{ lobbyDisplayName(lobby) }}
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import axios from "redaxios";

export default {
  name: "Lobbies",
  data() {
    return {
      loading: true,
      lobbies: [],
      lobbyName: "",
    };
  },
  created() {
    this.fetchLobbies();
  },
  methods: {
    fetchLobbies() {
      axios.get("/api/lobbies").then((response) => {
        this.loading = false;
        this.lobbies = response.data;
      });
    },
    createLobby() {
      axios
        .post("/api/lobbies", {
          name: this.lobbyName,
          public: true,
          match_config: {
            max_turns: 100,
            map_file: "hex.json",
          },
        })
        .then((response) => {
          console.log(response.data);
        });
    },
    lobbyDisplayName(lobby: any): string {
      if (lobby.name) {
        return lobby.name;
      } else {
        return lobby.id;
      }
    },
  },
};
</script>