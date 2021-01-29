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
      <div v-else-if="player.name == playerName && player.accepted">
        <span class="player-accepted">Accepted</span>
      </div>
      <div v-else>
        <span class="player-status status-pending" v-if="!player.accepted">[pending]</span>
        <span class="player-status status-accepted" v-if="player.accepted">[accepted]</span>
      </div>
    </li>
  </ul>
</div>
</template>

<style scoped>
@import "./styles.css";
.button-accept {
  color: green;
  border-width: 0px;
}
</style>

<script lang="ts">

const ME = "iasoon";

export default {
  props: {
    proposal: Object,
  },
  data() {
    return {
      // this should come from store
      playerName: ME,
      owner: this.proposal?.owner,
      players: this.proposal?.players,
    }
  },
  methods: {
    accept(ix: number) {
      this.players[ix].accepted = true;
    },
    canAccept(player: any) {
      this.playerName === player.name || player.name === null
    }
  }
};
</script>