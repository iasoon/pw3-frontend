<template>
<div class="container" v-if="lobby">
  <div class="sidebar-left">
    <div class="sidebar-players">
      <div class="sidebar-header">players</div>
      <ul class="player-list">
        <player-card v-bind:player="player" v-for="player in lobby.players" :key="player.id"/>
      </ul>
    </div>
  </div>

  <div class="view">
    <div v-if="viewMode == 'joinForm'">
      <Connect />
    </div>
    <div v-if="viewMode == 'matchForm'">
      <match-form v-bind:lobby="lobby" v-on:created="viewProposal" />
    </div>
    <div v-if="viewMode == 'proposal'">
      <match-proposal v-bind:proposal="selectedProposal"/>
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
    <div class="sidebar-header">invites</div>
    <ul class="invite-list">
      <li v-for="proposal in openInvites" :key=proposal.id v-on:click="viewProposal(proposal.id)" class="invite-li">
        {{lobby.players[proposal.owner_id].name}} {{proposal.config.map_file}}
      </li>
    </ul>
    <div class="sidebar-header">match history</div>
    <ul class="match-list">
      <li v-for="match in orderedMatches" :key=match.id v-on:click="viewMatch(match.id)" v-bind:class="matchCardClass(match.id)">
        <span class="match-timestamp">{{showTimestamp(match.timestamp)}}</span>
        <span class="match-mapname">{{match.config.mapName}}</span>
        <span v-if="match.status == 'playing'" class="match-progress">in progress</span>
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
@import "./lobby.scss";
</style>


<script lang="ts">
import axios from "redaxios";
import MatchForm from "./MatchForm.vue";
import MatchProposal from "./MatchProposal.vue";  
import Connect from "./Connect.vue"
import MatchViewer from "../MatchViewer.vue";
import PlayerCard from "./PlayerCard.vue";
import moment from "moment";

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

function proposalHasPlayer(proposal: any, playerId: number): boolean {
  return proposal.players.some((player: any) => player.player_id === playerId);
}

export default {
  components: { MatchForm, MatchProposal, Connect, MatchViewer, PlayerCard},
  name: "Lobby",
  data() {
    return {
      viewMode: 'loading',
      selectedProposalId: undefined,
      selectedMatchId: undefined,
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
    selectedProposal() {
      if (!this.selectedProposalId || !this.lobby) {
        return undefined;
      }
      return this.lobby.proposals[this.selectedProposalId];
    },
    openInvites() {
      const lobby = this.$store.state.lobby.lobby.data;
      const myId = this.$store.state.lobby.lobby?.player?.id;
      return Object.values(lobby.proposals).filter((p: any) => proposalHasPlayer(p, myId) && p.status === 'pending');
    },
    orderedMatches() {
      const lobby = this.$store.state.lobby.lobby.data;
      return Object.values(lobby.matches).sort((a:any, b:any) => (new Date(a.timestamp) < new Date(b.timestamp)) ? 1 : -1)
    }
  },
  watch: {
    selectedProposal: {
      handler(val, _oldval) {
        // if the proposal you are viewing starts, go to match view
        if (this.viewMode === 'proposal' && val.match_id) {
          this.viewMatch(val.match_id);
        }
      }
    }
  },
  methods: {
    showTimestamp(dateStr: string): string {
      let t = moment(dateStr);
      if (t.day() == moment().day()) {
        return moment(dateStr).format("HH:mm");
      } else {
        return moment(dateStr).format("DD/MM");
      }
    },
    playerColor(num: number): string {
      return PLAYER_COLORS[num % PLAYER_COLORS.length];
    },
    viewProposal(id: any) {
      this.viewMode = 'proposal';
      this.selectedProposalId = id;
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
    matchCardClass(matchId: string): object {
      const matchSelected = this.viewMode == 'match' && this.selectedMatchId == matchId;
      return {
        "match-card": true,
        "selected":  matchSelected,
      };
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