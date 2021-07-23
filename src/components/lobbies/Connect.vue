<template>
  <div class="join-card">
    <div>
      <input type="text" class="connect-input" v-model="name" placeholder="Enter your name here"/>
    </div>
    <div>
      <input type="text" class="connect-input" v-model="token" placeholder="connection token" />
    </div>
    <div>
      <button v-on:click="connect" :disabled="buttonDisabled()" v-bind:class="buttonClass()">
        {{ buttonText() }}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .join-card {
    margin: auto;
    padding: 25px;
    border-radius: 10px;
    /* background-color: #333; */
    display: flex;
    flex-direction: column;
    min-width: 320px;
    max-width: 400px;
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


  .join-button {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 8px 16px;
    margin: 0;
    color: white;
    border: 0;
    border-radius: 3px;
  }

  .join-button.logged-out {
    background-color: #0376da;
  }
  .join-button.logged-out:hover {
    background-color: #026ac4;
  }

  .join-button.logged-out:disabled {
    background-color: lightgray;
    color: gray;
  }

  .join-button.login-success {
    background-color: #008000;
  }
    .join-button.login-success:hover {
    background-color: #007300;
  }

  .join-button.login-success:disabled {
    background-color: #008000;
  }
</style>

<script lang="ts">
import axios from 'redaxios';

import wsConnection from '../../websocket';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { key } from '../../store';

function getSavedUser(): any {
    const retrieved = window.localStorage.getItem('credentials');
    if (!retrieved) {
        return;
    }
    const parsed = JSON.parse(retrieved);

    if (parsed.name && parsed.token) {
        return {
            name: parsed.name,
            token: parsed.token,
        }
    }
}

function saveUser(user: any) {
  window.localStorage.setItem('credentials', JSON.stringify(user));
}


export default {
  setup(props) {
    const store = useStore(key);

    return {
      lobby: computed(() => store.state.lobby.lobby.data),
      player: computed(() => store.state.lobby.lobby.player),
      login: (lobbyPlayer: object) => store.commit('setLobbyPlayer', lobbyPlayer),
    };
  },
  data() {
    let player = this.player || getSavedUser();
    if (player) {
      return {
        name: player.name,
        token: player.token,
      };
    } else {
      return {
        name: "",
        token: this.$route.query.token ? this.$route.query.token : "",
      };
    }
  },
  methods: {
    credentialsChanged(): boolean {
      if (!this.player) {
        return false;
      }
      return this.name !== this.player.name || this.token !== this.player.token;
    },
    buttonDisabled(): boolean {
      if (this.player) {
        return !this.credentialsChanged();
      }
      const nameValid = this.name.length > 0;
      const tokenValid = this.token.match(/^[a-f0-9]{64}$/i) !== null;
      return !nameValid || !tokenValid;
    },
    buttonClass(): object {
      return {
        'join-button': true,
        'login-success': this.player !== undefined,
        'logged-out': this.player === undefined,
      };
    },
    buttonText(): string {
      if (!this.player) {
        return 'Join lobby';
      }
      if (this.credentialsChanged()) {
        return 'update credentials';
      } else {
        return 'Connected';
      }
      
    },
    connect() {
      const playerParams = {
        name: this.name,
        token: this.token,
      };
      saveUser(playerParams);
      axios.post(`/api/lobbies/${this.lobby.id}/join`, playerParams).then((response) => {
        this.login({
          ...response.data,
          token: this.token,
        });
        wsConnection.send({
          type: 'authenticatePlayer',
          lobbyId: this.lobby.id,
          token: this.token,
        });
      })
      .catch((err) => alert(`${err.status} ${JSON.stringify(err.body)}`));
    }
  }
};
</script>