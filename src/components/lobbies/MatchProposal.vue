<template>
<div class=box>
  <ul class= "player-list">
    <li class="list-player" v-for="(player, ix) in players" :key="ix">
      <span class="player-name">
        {{ player.name }}
      </span>
      <div>
        <span class="player-status status-pending" v-if="player.status == 'Unanswered'">[pending]</span>
        <span class="player-status status-accepted" v-if="player.status == 'Accepted'">[accepted]</span>
        <span class="player-status status-declined" v-if="player.status == 'Rejected'">[declined]</span>
      </div>
    </li>
  </ul>
  <button class="button button-accept" v-on:click="accept()" :disabled="!canAccept()" >
    Accept
  </button>
  <button v-on:click="decline()" class="button button-decline">
    Decline
  </button>
  <button v-if="proposal.owner == me" v-on:click="start" :disabled="startButtonDisabled()">
    Start
  </button>
</div>
</template>

<style scoped>
@import "./styles.css";

.button {
  padding: 5px 16px;
  border: 0;
  border-radius: 5px;
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
    canAccept() {
      return this.players.some((player: any) => player.name == this.me && player.status == 'Unanswered');
    },
    canStart() {
      return this.players.every((player: any) => player.status == 'Accepted');
    },
    startButtonDisabled() {
      return this.started || !this.canStart();
    },
    accept() {
      this.updateAcceptedStatus('Accepted');
    },
    decline() {
      this.updateAcceptedStatus('Rejected');
    },
    updateAcceptedStatus(status: string) {
      const lobbyId = this.$store.state.lobby.lobby.data.id;
      const proposalId = this.proposal?.id;
      const player = this.$store.state.lobby.lobby.player;

      axios.post(`/api/lobbies/${lobbyId}/proposals/${proposalId}/accept`, {
        name: player?.name,
        status: status,
      }, {
        headers: {
          'Authorization': `Bearer ${player?.token}` 
        }
      }).then(resp => {
        this.$store.commit('updateProposal', resp.data);
        console.log(resp.data);
      })

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