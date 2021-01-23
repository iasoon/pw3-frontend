<template>
<div class=box>
  <ul class= "player-list">
    <li class="list-player" v-for="(player, ix) in players" :key="ix">
      <span class="player-name">
        {{ player.name }}
      </span>
      <span class="player-status status-accepted" v-if="player.accepted">[accepted]</span>
      <span class="player-status status-pending" v-if="!player.accepted">[waiting]</span>
      <span class="player-remove" v-on:click="removePlayer(ix)">remove</span>
    </li>
    <li class=addPlayer>
      <input class="addPlayer-name" v-model="addPlayerName"/>
      <button class="addPlayer-button" v-on:click="addPlayer" :disabled="addPlayerDisabled()">add player</button>
    </li>
  </ul>
</div>
</template>

<style scoped>
.box {
  max-width: 600px;
}
.player-list {
  list-style: none;
  display: flex;
  flex-direction: column;;
  width: 100%;
}

.list-player {
  display: flex;
  padding: 3pt;
}

.list-player:hover {
  background: lightgray;
}

.addPlayer {
  display: flex;
  padding: 3pt;
}

.player-name {
  flex-grow: 1;
}

.player-status {
  flex-grow: 0;
}

.status-accepted {
  color: green;
}

.status-pending {
  color: gray;
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
  data() {
    return {
      addPlayerName: "",
      players: [
        {
          name: "bob",
          accepted: true,
        },
        {
          name: "fred",
          accepted: true,
        },
        {
          name: "bobby",
          accepted: false,
        }
      ]
    }
  },
  methods: {
    addPlayer() {
      this.players.push({
        name: this.addPlayerName,
        accepted: false,
      });
      this.addPlayerName = "";
    },
    removePlayer(ix: number) {
      this.players.splice(ix, 1);
    },
    addPlayerDisabled() {
      return this.addPlayerName == "";
    }
  }
};
</script>