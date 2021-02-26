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
        <input type="number" id="speed" value="300">
      </div>
      <div class="slidecontainer">
        <input type="range" min="0" max="1" value="1" class="slider" id="turnSlider">
      </div>
    </div>
    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<style scoped>
  @import '../visualizer/style.css';
</style>

<script lang="ts">
import * as vis from '../visualizer/index';
import wsConnection from '/@/websocket';

// TODO how should this be called
class MatchLogSpaghetti {
  matchId: string;
  states: string[];
  gameInstance?: vis.GameInstance;
  streamId: number;


  constructor(matchId: string) {
    this.matchId = matchId;
    this.states = [];

    this.streamId = wsConnection.subscribeToMatch(
      matchId,
      this.receiveState.bind(this)
    );
  }

  receiveState(state: string) {
    this.states.push(state);
    if (this.states.length == 1) {
      vis.set_instance(this.states.join('\n'))
        .then(gameInstance => {
          this.gameInstance = gameInstance;
          // update with missed states
          this.states.slice(1).forEach(state => {
            gameInstance.push_state(state);
          });
        });
    }
    if (this.gameInstance) {
      this.gameInstance.push_state(state);
    }
  }

  cleanup() {
    wsConnection.dropSubscription(this.streamId);
  }
}

var activeSpaghetti: MatchLogSpaghetti | undefined = undefined;

function setActiveSpaghetti(spaghetti?: MatchLogSpaghetti) {
  if (activeSpaghetti) {
    activeSpaghetti.cleanup();
  }
  activeSpaghetti = spaghetti;
}

export default {
    name: 'MatchViewer',
    props: {
      match: Object,
    },
    data() {
      return {
        loading: true,
        matchId: this.match?.id,
      }
    },
    created() {
      this.fetchData();
    },
    mounted() {
      vis.init();
    },
    unmounted() {
      setActiveSpaghetti(undefined);
      vis.stop();
    },
    updated() {
      if (this.match && this.match.id !== this.matchId) {
        this.matchId = this.match.id;
        this.fetchData();
      }
    },
    methods: {
      fetchData() {
        if (this.match && this.match?.status === 'playing') {
          setActiveSpaghetti(new MatchLogSpaghetti(this.match.id))
        }
        if (this.match?.status === 'done') {
          setActiveSpaghetti(undefined);
          this.loading = true;
          fetch(`/api/matches/${this.match.id}`)
            .then(resp => resp.json())
            .then(data => {
                vis.set_instance(data.join('\n'));
                this.loading = false;
            })
            .catch(err => { throw(err) });

        }
      },
    }
}
</script>