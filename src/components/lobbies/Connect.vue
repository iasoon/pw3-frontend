<template>
<div>
  <label for="name">Name</label>
  <input type="text" name="name" v-model="name" />
</div>
<div>
  <label for="token">Token</label>
  <input type="text" name="token" v-model="token" />
</div>
<button v-on:click="connect" :disabled="buttonDisabled()">Join lobby</button>
</template>

<script lang="ts">
import axios from 'redaxios';

import { socket } from '../../websocket';

export default {
  data() {
    const player = this.$store.state.lobby.lobby.player;
    if (player) {
      return {
        name: player.name,
        token: player.token,
      };
    } else {
      return {
        name: "",
        token: "",
      };
    }
  },
  methods: {
    buttonDisabled(): boolean {
      return false;
    },
    connect() {
      const player = {
        name: this.name,
        token: this.token,
      };
      const lobbyId = this.$route.params.lobbyId;
      axios.post(`/api/lobbies/${lobbyId}/join`, player).then((response) => {
        this.$store.commit('setLobbyPlayer', player);
          socket.send(JSON.stringify({
            type: 'connect',
            lobbyId: lobbyId,
            token: this.token,
          }));
      });
    }
  }
};
</script>