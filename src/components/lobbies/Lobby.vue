<template>
<div class="container" v-if="lobby">
  <div class="sidebar-left">
    Players:
    <ul class="player-list">
      <player-card v-bind:player="player" v-for="player in lobby.players" :key="player.id"/>
    </ul>
  </div>

  <div class="view">
    <div v-if="viewMode == 'joinForm'">
      <Connect />
    </div>
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
      <button v-on:click="showMatchForm()" class="action-button button-create-match" v-if="userConnected">
        new game
      </button>
      <button v-on:click="showJoinForm()" class="action-button button-join-lobby" v-else>
        join lobby
      </button>
    </div>
    Invites:
    <ul class="invite-list">
      <li v-for="proposal in openProposals" :key=proposal.id v-on:click="viewProposal(proposal.id)" class="invite-li">
        {{lobby.players[proposal.owner_id].name}} {{proposal.config.map_file}}
      </li>
    </ul>
    Matches:
    <ul class="match-list">
      <li v-for="match in orderedMatches" :key=match.id v-on:click="viewMatch(match.id)" class="match-li">
        {{showTimestamp(match.timestamp)}} {{match.config.map_file}}
        <ul class="match-player-list">
          <li v-for="(player_id, ix) in match.players" :key="ix" v-bind:style="{ color: playerColor(ix) }" class="match-player">
            {{lobby.players[player_id].name}}
          </li>
        </ul>
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
  background-color: rgb(41, 41, 41);
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

.action-button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 0;
  font-size: 18pt;
  display: block;
  margin: 20px auto;
}

.button-join-lobby {
  background-color: #0376da;
  color: white;
}

.button-create-match {
  background-color: #cc5900;
  color: white;
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
  padding: 0;
  list-style: none;
}

.invite-li {
  padding: 0 3px;
}

.invite-li:hover {
  background-color: #333;
}

.match-list {
  list-style: none;
  padding: 0;
}

.match-li {
  padding: .5em;
}

.match-li:hover {
  background-color: #333;
}


</style>


<script lang="ts">
import axios from "redaxios";
import MatchForm from "./MatchForm.vue";
import MatchProposal from "./MatchProposal.vue";  
import Connect from "./Connect.vue"
import MatchViewer from "../MatchViewer.vue";
import PlayerCard from "./PlayerCard.vue";

import { useStore } from 'vuex'
import wsConnection from '../../websocket';


const PLAYER_COLORS = [
  "#FF8000",
  "#0080ff",
  "#FF6693",
  "#3fcb55",
  "#cbc33f",
  "#cf40e9",
  "#FF3F0D",
  "#1beef0",
  "#0DC5FF",
];

export default {
  components: { MatchForm, MatchProposal, Connect, MatchViewer, PlayerCard},
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
    userConnected() {
      const lobbyState = this.$store.state.lobby;
      return lobbyState.lobby && lobbyState.lobby.player;
    },
    selectedMatch() {
      if (!this.selectedMatchId) return undefined;
      return this.$store.state.lobby.lobby.data?.matches[this.selectedMatchId];
    },
    openProposals() {
      const lobby = this.$store.state.lobby.lobby.data;
      return Object.values(lobby.proposals).filter(p => p.status === 'pending');
    },
    orderedMatches() {
      const lobby = this.$store.state.lobby.lobby.data;
      return Object.values(lobby.matches).sort((a:any, b:any) => (new Date(a.timestamp) < new Date(b.timestamp)) ? 1 : -1)
    }
  },
  methods: {
    showTimestamp(dateStr: string): string {
      const date = new Date(dateStr);
      return `${date.getHours()}:${date.getMinutes()}`;
    },
    playerColor(num: number): string {
      return PLAYER_COLORS[num % PLAYER_COLORS.length];
    },
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
    showJoinForm() {
      this.viewMode = 'joinForm';
    },
    fetchLobbyData() {
      const lobbyId = this.$route.params.lobbyId;
      axios.get(`/api/lobbies/${lobbyId}`).then((response) => {
        this.$store.commit('storeLobby', response.data);
        console.log(response.data);
        this.viewMode = 'ready';
        // TODO: provide feedback from websocket calls, and replace REST call
        wsConnection.send({
          type: 'subscribeToLobby',
          lobbyId: lobbyId,
        });
      }).catch(err => {
        if (err.status == 404) {
          // todo: maybe there is a more appropriate way? 
          this.$router.push({ name: 'Home' });;
        } else {
          throw err;
        }
      });
    },
  },
};
</script>