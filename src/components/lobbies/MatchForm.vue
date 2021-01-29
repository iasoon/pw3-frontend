<template>
<div class=box>
  <ul class= "player-list">
    <li class="list-player" v-for="(player, ix) in players" :key="ix">
      <span class="player-name">
        {{ player.name || "[open]" }}
      </span>
      <span class="player-remove" v-on:click="removePlayer(ix)">remove</span>
    </li>
    <li class=addPlayer>
      <select class="addPlayer-name" v-model="addPlayerName">
        <option value=null> [Open for all] </option>
        <option v-for="player in lobby.players" :value="player.name" :key="player.name">
          {{ player.name }}
        </option>
      </select>
      <button class="addPlayer-button" v-on:click="addPlayer" :disabled="addPlayerDisabled()">add player</button>
    </li>
  </ul>
  <button>Send</button>
</div>
</template>

<style scoped>
@import "styles.css";

.box {
  margin: auto;
  max-width: 600px;
}

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
export default {
  name: 'MatchForm',
  props: {
    lobby: Object,
  },
  data() {
    return {
      addPlayerName: null,
      players: [],
    }
  },
  methods: {
    addPlayer() {
      this.players.push({
        name: this.addPlayerName,
      });
      this.addPlayerName = null;
    },
    removePlayer(ix: number) {
      this.players.splice(ix, 1);
    },
    addPlayerDisabled() {
      false
    }
  }
};
</script>