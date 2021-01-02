<template>
    <div v-if="matchData">
        {{ matchData }}
    </div>
</template>

<script lang="ts">
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
                })
                .catch(err => { throw(err) });
        }
    }
}
</script>