<template>
    <canvas ref="canvas"/>
</template>

<script lang="ts">
import * as visualizer from '../visualizer';

function parseMatchLog(entries) {
    return entries.map(e => JSON.parse(e));
}

export default {
    name: 'MatchViewer',
    data() {
        return {
            loading: true,
            error: false,
            matchData: null,
        }
    },
    created() {
        this.fetchData();
    },
    mounted() {
        
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
                    this.matchData = parseMatchLog(data);
                    this.loading = false;
                    this.renderScene();
                })
                .catch(err => { throw(err) });
        },

        renderScene() {
            const state = this.matchData[0];
            visualizer.drawState(this.$refs.canvas, state);
        }
    }
}
</script>