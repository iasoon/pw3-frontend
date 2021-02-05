<template>
<div class=box>
  <ul class= "player-list">
    <li class="list-player" v-for="(player, ix) in players" :key="ix">
      <span class="player-name">
        {{ lobby.players[player.playerId].name || "[open]" }}
      </span>
      <span class="player-remove" v-on:click="removePlayer(ix)">remove</span>
    </li>
    <li class=addPlayer>
      <select class="addPlayer-name" v-model="selectedPlayer">
        <!-- <option value=null> [Open for all] </option> -->
        <option v-for="player in lobby.players" :value="player.id" :key="player.id">
          {{ player.name }}
        </option>
      </select>
      <button class="addPlayer-button" v-on:click="addPlayer" :disabled="addPlayerButtonDisabled()">
        add player
      </button>
    </li>
  </ul>
  <button class="submitButton" v-on:click="submit" :disabled="sendButtonDisabled()">
    Send
  </button>
</div>
</template>

<style scoped>
@import "styles.css";

.player-remove {
  padding: 0;
  margin: 0 0.5em;
  border: none;
}

.addPlayer-name {
  flex-grow: 1;
  border: 1px solid black;
}

.addPlayer-button {
  border: 1px solid black;
}

</style>

<script lang="ts">
import axios from 'redaxios';

export default {
  name: 'MatchForm',
  props: {
    lobby: Object,
  },
  data() {
    return {
      selectedPlayer: this.defaultSelected(),
      players: [],
      submitted: false,
    }
  },
  methods: {
    defaultSelected(): string | undefined {
      return this.$store.state.lobby.lobby?.player?.id;
    },
    addPlayer() {
      this.players.push({
        playerId: this.selectedPlayer,
      });
    },
    removePlayer(ix: number) {
      this.players.splice(ix, 1);
    },
    submit() {
      if (!this.lobby) {
        throw "no lobby given";
      }
      this.submitted = true;

      const player = this.$store.state.lobby.lobby?.player;
      console.log(player);
      axios.post(`/api/lobbies/${this.lobby.id}/proposals`, {
        owner: player?.name,
        config: {
          'map_file': 'hex.json',
          'max_turns': 300,
        },
        players: this.players.map(p => p.playerId),
      }, {
        headers: {
          'Authorization': `Bearer ${player?.token}` 
        }
      }).then(resp => {
        this.$store.commit('updateProposal', resp.data);
        this.$emit('created', resp.data.id);
      })
    },
    addPlayerButtonDisabled() {
      return this.selectedPlayer === undefined;
    },
    sendButtonDisabled() {
      return this.submitted;
    }
  }
};
</script>