<template>
<div class="container">
  <div class="content">
    <h3> Welcome to PlanetWars </h3>
    <button class="create-lobby-button" v-on:click="createLobby()" :disabled="createPending">
      Create a lobby
    </button>
    <p> Or ask a friends for a link </p>
  </div>
</div>
</template>

<style scoped>
.container {
  background-color: #000;
  height: 100vh;
  width: 100vw;
  display: flex;
}

.content {
  margin: auto;
  /* max-width: 300px; */
  color: #eee;
  text-align: center;
}

.create-lobby-button {
  color: white;
    padding: 5px 16px;
    margin: 0;
    border: #0376da 3px solid;
    background-color: #0376da;
    border-radius: 3px;
}
</style>

<script lang="ts">
import axios from "redaxios";

export default {
  name: 'Landing',
  data() {
    return {
      createPending: false
    };
  },
  methods: {
    createLobby() {
      this.createPending = true;
      axios.post("/api/lobbies", {
        name: "lobby",
        public: false,
      }).then((response) => {
        const lobbyId = response.data.id;
        this.$router.push({ name: 'lobby', params: { lobbyId }});
      });
    }
  }
}
</script>
