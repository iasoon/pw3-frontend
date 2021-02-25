<template>
<div class=box>
  <div class="map-line">
    <div class="map-line-label">Map</div>
    <select class="select-map" v-model="selectedMap">
      <option v-for="map in maps" :value="map.name" :key="map.name">
        {{ map.name }}
      </option>
    </select>
  </div>
  <ul class= "player-list">
    <li class="list-player" v-for="(player, ix) in players" :key="ix">
      <span class="player-name">
        {{ lobby.players[player.playerId].name }}
      </span>
      <span class="player-remove" v-on:click="removePlayer(ix)">remove</span>
    </li>
    <li class=addPlayer>
      <select class="select-add-player" v-model="selectedPlayer">
        <option v-for="player in lobby.players" :value="player.id" :key="player.id">
          {{ player.name }}
        </option>
      </select>
      <button class="button-add-player" v-on:click="addPlayer" :disabled="addPlayerButtonDisabled()">
        add player
      </button>
    </li>
  </ul>
  <button class="button-submit" v-on:click="submit" :disabled="sendButtonDisabled()">
    Send proposal
  </button>
</div>
</template>

<style scoped>
@import "styles.css";

.map-line {
  display: flex;
  padding: 10px;
  max-width: 400px;
  margin-left: auto;
  align-items: flex-end;
}

.map-line-label {
  padding: 0 10px;
}

.select-map {
  flex-grow: 1;
  border: 1px solid black;
  box-sizing: border-box;
}

.player-remove {
  padding: 0;
  margin: 0 0.5em;
  border: none;
  color: #bbb;
}

.player-remove:hover {
  text-decoration: underline;
  color: #fff;
}

.select-add-player {
  flex-grow: 1;
  border: 1px solid black;
}

.button-add-player {
  border: 1px solid black;
}

.button-add-player:hover {
  background-color: lightgray;
}

.button-add-player:disabled {
  background-color: lightgray;
  color: gray;
}

.button-submit {
  float: right;
  padding: 8px 16px;
  border-radius: 3px;
  border: 0;
  margin: 5px;
  display: block;
  background-color: #0376da;
  color: white;
}

.button-submit:hover {
  background-color: #025eae;
}

.button-submit:disabled {
  background-color: lightgray;
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
      selectedMap: undefined,
      maps: {},
      players: [],
      submitted: false,
      maxTurns: 500,
    }
  },
  mounted() {
    axios.get('/api/maps').then(resp => {
      const maps: { [ix: string]: any} = {};
      resp.data.forEach((map: any) => {
        maps[map.name] = map;
      });
      this.maps = maps;
    })
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
      axios.post(`/api/lobbies/${this.lobby.id}/proposals`, {
        config: {
          mapName: this.selectedMap,
          maxTurns: this.maxTurns,
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
            if (!this.selectedMap) {
        return true;
      }
      const map = this.maps[this.selectedMap];
      if (this.players.length >= map.maxPlayers) {
        return true;
      }

      return this.selectedPlayer === undefined;
    },
    sendButtonDisabled() {
      if (!this.selectedMap) {
        return true;
      }
      const map = this.maps[this.selectedMap];
      if (this.players.length < 2) {
        return true;
      }
      if (this.players.length > map.maxPlayers) {
        return true;
      }
      return this.submitted;
    }
  }
};
</script>