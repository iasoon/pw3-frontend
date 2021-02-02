<template>
<div v-if="!isConnected">
  <Connect />
</div>
<div class="container" v-else-if="lobby">
  <div class="sidebar-left">
    Players:
    <ul class="player-list">
      <li v-for="player in lobby.players" :key="player.name" class="player">
        {{ player.name }}
      </li>
    </ul>
  </div>

  <div class="view">
    <div v-if="viewMode == 'matchForm'">
      <match-form v-bind:lobby="lobby" v-on:created="viewProposal" />
    </div>
    <div v-if="viewMode == 'proposal'">
      <match-proposal v-bind:proposal="lobby.proposals[selectedProposal]"/>
    </div>
    <div class="fillHeight" v-if="viewMode == 'match'">
      <match-viewer v-bind:match="selectedMatch" />
    </div>
  </div>

  <div class="sidebar-right">
    <div>
      <button v-on:click="showMatchForm()">
        create match
      </button>
    </div>
    Invites:
    <ul class="invite-list">
      <li v-for="proposal in lobby.proposals" :key=proposal.id v-on:click="viewProposal(proposal.id)">
        {{proposal.id}}
      </li>
    </ul>
    Matches:
    <ul class="match-list">
      <li v-for="match in lobby.matches" :key=match.id v-on:click="viewMatch(match.id)">
        {{match.id}}
      </li>
    </ul>
  </div>
</div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  background-color: #000;
}

.fillHeight {
  height: 100%;
}

.view {
  flex-grow: 1;
}
.player-list {
  list-style: none;
}

.player {
  min-height: 2em;
}

.sidebar-left {
  width: 200px;
  color: #ccc;
  overflow: hidden;
}

.sidebar-right {
  width: 20%;
  max-width: 400px;
  min-width: 200px;
  color: #ccc;
  overflow: hidden;
}

.invite-list {
  list-style: none;
}

.match-list {
  list-style: none;
}
</style>


<script lang="ts">
import axios from "redaxios";
import MatchForm from "./MatchForm.vue";
import MatchProposal from "./MatchProposal.vue";
import Connect from "./Connect.vue"
import MatchViewer from "../MatchViewer.vue";

import { useStore } from 'vuex'

export default {
  components: { MatchForm, MatchProposal, Connect, MatchViewer},
  name: "Lobby",
  data() {
    return {
      viewMode: 'loading',
      selectedProposal: null,
      selectedMatchId: null,
    };
  },
  created() {
    this.fetchLobbyData();
  },
  computed:  {
    lobby() {
      return this.$store.state.lobby.lobby.data;
    },
    isConnected() {
      const lobbyState = this.$store.state.lobby;
      return lobbyState.lobby && lobbyState.lobby.player;
    },
    selectedMatch() {
      if (!this.selectedMatchId) return undefined;
      return this.$store.state.lobby.lobby.data?.matches[this.selectedMatchId];
    }
  },
  methods: {
    viewProposal(id: any) {
      this.viewMode = 'proposal';
      this.selectedProposal = id;
    },
    viewMatch(id: any) {
      this.viewMode = 'match';
      this.selectedMatchId = id;
    },
    showMatchForm() {
      this.viewMode = 'matchForm';
    },
    fetchLobbyData() {
      const lobbyId = this.$route.params.lobbyId;
      axios.get(`/api/lobbies/${lobbyId}`).then((response) => {
        console.log(response.data);
        this.$store.commit('storeLobby', response.data);
        this.viewMode = 'ready';
      });
    },
  },
};
</script>