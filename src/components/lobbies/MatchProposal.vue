<template>
<div class=box>
  <ul class= "player-list">
    <li class="list-player" v-for="(player, ix) in players" :key="ix">
      <span class="player-name">
        {{ player.name }}
      </span>
      <div v-if="canAccept(player) && !player.accepted">
        <button v-on:click="accept(ix)" class="button-accept">Accept</button>
      </div>
      <div v-else-if="player.name == me && player.accepted">
        <span class="player-accepted">Accepted</span>
      </div>
      <div v-else>
        <span class="player-status status-pending" v-if="!player.accepted">[pending]</span>
        <span class="player-status status-accepted" v-if="player.accepted">[accepted]</span>
      </div>
    </li>
  </ul>
  <button v-if="proposal.owner == me" v-on:click="start" :disabled="startButtonDisabled()">
    Start
  </button>
</div>
</template>

<style scoped>
@import "./styles.css";
.button-accept {
  color: black;
  border-width: 0px;
}
</style>

<script lang="ts">
import axios from 'redaxios';

export default {
  props: {
    proposal: Object,
  },
  data() {
    return {
      started: false,
    }
  },
  computed: {
    me(): string | undefined {
      return this.$store.state.lobby.lobby?.player?.name;
    },
    owner() : string {
      return this.proposal?.owner;
    },
    players(): any {
      return this.proposal?.players;
    }
  },
  methods: {
    accept(ix: number) {
      this.players[ix].accepted = true;
    },
    canAccept(player: any) {
      return this.me === player.name || player.name === null;
    },
    startButtonDisabled() {
      return this.started;
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
        this.$store.commit('saveMatch', {id: resp.data.match_id });
      })
    }
  }
};
</script>