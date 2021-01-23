<template>
  <div v-if="lobby" class="lobby">
    {{ lobby.name }}
    <match-form />
    <!-- {{ lobby.match_config }}
    <ul class="player_list">
      <li v-for="player in lobby.players" :key="player.name" class="player">
        {{ player.name }}
      </li>
    </ul> -->
  </div>
</template>

<style scoped>
</style>


<script lang="ts">
import axios from "redaxios";
import MatchForm from "./MatchForm.vue";

export default {
  components: { MatchForm },
  name: "Lobby",
  data() {
    return {
      lobby: null,
    };
  },
  created() {
    // this.fetchLobbyData();
    this.lobby = {
      id: "28010f10fe5715738ace2517eaaa708d",
      name: "blab",
      public: true,
      match_config: { map_file: "hex.json", max_turns: 100 },
      players: {
        "simplebot": {
          name: "simplebot",
          ready: false,
        },
        "peter": {
          name: "peter",
          ready: true,
        },
        "jan": {
          name: "jan",
          ready: false,
        }
      },
    };
  },
  methods: {
    fetchLobbyData() {
      const lobbyId = this.$route.params.lobbyId;
      axios.get(`/api/lobbies/${lobbyId}`).then((response) => {
        this.lobby = response.data;
      });
    },
  },
};
</script>