<template>
<div class="container">
  <div class="join-card">
    <div>
      <input type="text" class="connect-input" v-model="name" placeholder="Enter your name here"/>
    </div>
    <div>
      <input type="text" class="connect-input" v-model="token" placeholder="connection token" />
    </div>
    <div>
      <button v-on:click="connect" :disabled="buttonDisabled()" class="join-button">
        Join lobby
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>
  .container {
    background-color: #000;
    /* width: 100vw;
    height: 100vh; */
  }

  .join-card {
    margin: auto;
    padding: 25px;
    border-radius: 10px;
    /* background-color: #333; */
    display: flex;
    flex-direction: column;
    min-width: 320px;
  }

  .join-card > div {
    margin: 0;
    padding: 5px 0;
    width: 100%;
  }

  .connect-input {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }

  .join-button:disabled {
    background-color: lightgray;
    border-color: lightgray;
    color: gray;
  }

  .join-button {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 5px 16px;
    margin: 0;
    color: white;
    border: #0376da 3px solid;
    background-color: #0376da;
    border-radius: 3px;
  }
</style>

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
  computed: {
    lobbyId() {
      return this.$route.params.lobbyId;
    }
  },
  methods: {
    buttonDisabled(): boolean {
      const nameValid = this.name.length > 0;
      const tokenValid = this.token.match(/^[a-f0-9]{64}$/i) !== null;
      return !nameValid || !tokenValid;
    },
    connect() {
      const playerParams = {
        name: this.name,
        token: this.token,
      };
      axios.post(`/api/lobbies/${this.lobbyId}/join`, playerParams).then((response) => {
        this.$store.commit('setLobbyPlayer', {
          ...response.data,
          token: this.token,
        });
          socket.send(JSON.stringify({
            type: 'connect',
            lobbyId: this.lobbyId,
            token: this.token,
          }));
      });
    }
  }
};
</script>