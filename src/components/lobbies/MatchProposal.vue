<template>
<div class=box>
  <div class="map-name">Map: {{ proposal.config.mapName }}</div>
  <ul class= "player-list">
    <li class="list-player" v-for="(player, ix) in players" :key="ix">
      <span class="player-name">
        {{ lobby.players[player.player_id].name }}
      </span>
      <div>
        <span class="player-status status-pending" v-if="player.status == 'Unanswered'">[pending]</span>
        <span class="player-status status-declined" v-else-if="player.status == 'Rejected'">[declined]</span>
        <span class="player-status status-disconnected" v-else-if="!lobby.players[player.player_id].client_connected">[not connected]</span>
        <span class="player-status status-accepted" v-else-if="player.status == 'Accepted'">[accepted]</span>
      </div>
    </li>
  </ul>
  <div class="buttons">
    <button class="button button-accept" v-on:click="accept()" :disabled="!canAccept()" >
      Accept
    </button>
    <button v-on:click="decline()" class="button button-decline">
      Decline
    </button>
    <button class="button button-start" v-if="proposal.owner_id === me.id" v-on:click="start" :disabled="startButtonDisabled()">
      {{ startButtonText() }}
    </button>
  </div>
</div>
</template>

<style scoped>
@import "./styles.css";
.map-name {
  margin: 20px 0;
}

.buttons {
  margin-top: 20px;
}
.button {
  padding: 5px 16px;
  border: 0;
  border-radius: 3px;
  margin: 3px;
}

.button-accept {
  color: white;
  background-color: green;
}

.button-accept:disabled {
  background-color: lightgray;
}

.button-decline {
  color: white;
  background-color: red;
}

.button-start {
  float: right;
}

.button-start {
  color: white;
  background-color: #0376da;
}
.button-start:hover {
  background-color: #026ac4;
}
.button-start:disabled {
  background-color: lightgray;
}

.status-disconnected {
  color: orange;
}
</style>

<script lang="ts">
import axios from 'redaxios';

export default {
  props: {
    proposal: Object,
    updateAcceptedStatus: Function,
  },
  data() {
    return {
      started: false,
    }
  },
  computed: {
    me(): any | undefined {
      return this.$store.state.lobby.lobby?.player;
    },
    owner() : string {
      return this.proposal?.owner;
    },
    players(): any {
      return this.proposal?.players;
    },
    lobby(): any {
      return this.$store.state.lobby.lobby.data;
    }
  },
  methods: {
    canAccept() {
      return this.players.some((player: any) => player.player_id === this.me.id && player.status == 'Unanswered');
    },
    canStart() {
      return this.players.every((player: any) => player.status == 'Accepted' && this.lobby.players[player.player_id].client_connected);
    },
    startButtonDisabled() {
      return this.started || !this.canStart();
    },
    startButtonText() {
      if (this.started) {
        return "match started";
      }
      if (this.canStart()) {
        return "start match";
      }
      return "waiting for players";
    },
    accept() {
      if (this.updateAcceptedStatus)
        this.updateAcceptedStatus(this.proposal?.id, 'Accepted');
    },
    decline() {
      if (this.updateAcceptedStatus)
        this.updateAcceptedStatus(this.proposal?.id, 'Rejected');
    },
    start() {
      const lobbyId = this.$store.state.lobby.lobby.data.id;
      const proposalId = this.proposal?.id;
      const player = this.$store.state.lobby.lobby.player;
      this.started = true;
      axios.post(`/api/lobbies/${lobbyId}/proposals/${proposalId}/start`, {}, {
        headers: {
          'Authorization': `Bearer ${player?.token}` 
        }
      }).then(resp => {
        // TODO
        console.log(resp);
        this.$store.commit('updateProposal', resp.data);
      })
    }
  }
};
</script>