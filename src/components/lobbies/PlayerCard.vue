<template>
<div>
  <fa-icon icon="circle" v-bind:class="['status-icon', statusClass]"/>
  {{ player.name }}
</div>

</template>

<style scoped>
.status-icon {
  width: .5em;
}

.status-connected {
  color: green;
}

.status-semi {
  color: orange;
}

.player-disconnected {
  color: #777;
}

</style>

<script lang="ts">
export default {
  name: "PlayerCard",
  props: {
    player: Object,
  },
  computed: {
    statusClass(): string {
      if (this.player?.connected && this.player?.client_connected) {
        return "status-connected";
      }
      if (this.player?.connected) {
        return "status-semi";
      }
      return "player-disconnected";
    }
  }
};
</script>