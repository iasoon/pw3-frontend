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

function parseMatchLog(entries: string[]) {
    return entries.map(e => JSON.parse(e));
}

export default {
    name: 'MatchViewer',
    props: {
      matchId: String,
    },
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
      this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true;

            const a = this;
            fetch(`/api/matches/${this.matchId}`)
                .then(resp => resp.json())
                .then(data => {
                    let str = data.join('\n');
                    vis.set_instance(str);
                    this.loading = false;
                })
                .catch(err => { throw(err) });
        },
    }
}
</script>