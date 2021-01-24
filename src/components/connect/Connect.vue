<template>
<div>
  <label for="nickname">Nickname</label>
  <input type="text" name="nickname" v-model="nickname" />
</div>
<div>
  <label for="token">Token</label>
  <input type="text" name="token" v-model="token" />
</div>
<button v-on:click="connect" :disabled="buttonDisabled()">Connect</button>
</template>

<script lang="ts">

export default {
  data() {
    const user = this.$store.state.user;
    return {
      nickname: user?.nickname,
      token: user?.token,
    }
  },
  methods: {
    buttonDisabled(): boolean {
      const user = this.$store.state.user;
      return this.nickname == user?.nickname && this.token == user?.token;
    },
    connect() {
      const user = {
        nickname: this.nickname,
        token: this.token,
      }
      this.$store.dispatch('connect', user);
      console.log(user);
    }
  }
};
</script>