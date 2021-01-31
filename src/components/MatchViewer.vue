<template>
  <div id="main" class="loading">
    <canvas id="canvas"></canvas>
    <div id="name"></div>
    <div id="addbutton" class="button"></div>

    <div id="meta">
      <div id="turnCounter">
        0 / 0
      </div>
      <div>
        <span>Ms per frame:&nbsp;</span>
        <input type="number" id="speed" value="100">
      </div>
      <div class="slidecontainer">
        <input type="range" min="0" max="1" value="1" class="slider" id="turnSlider">
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import '../visualizer/style.css';
</style>

<script lang="ts">
import * as vis from '../visualizer/index.ts';

function parseMatchLog(entries) {
    return entries.map(e => JSON.parse(e));
}

export default {
    name: 'MatchViewer',
    data() {
        return {
            loading: true,
        }
    },
    created() {
        this.fetchData();
    },
    mounted() {
        vis.init();
        vis.set_game_name('sup');
    },
    updated() {
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.error = false;
            this.matchData = null;
            const matchId = this.$route.params.id

            const a = this;
            fetch(`/api/matches/${matchId}`)
                .then(resp => resp.json())
                .then(data => {
                    let str = data.join('\n');
                    vis.set_instance(str);
                })
                .catch(err => { throw(err) });
        },
    }
}
</script>