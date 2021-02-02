import store from './store';

const uri = `ws://${location.host}/websocket`;

export const socket = new WebSocket(uri);

socket.onopen = (ev: Event) => {
    console.log('ws connected')
}

socket.onmessage = (ev: MessageEvent) => {
    const event = JSON.parse(ev.data);
    HANDLER_MAP[event.type](event.data);
}

const HANDLER_MAP: {[type: string]: (data: any) => void } = {
    lobbyState(state: any) {
        store.commit('storeLobby', state);
    },
    playerData(data: any) {
        store.commit('updatePlayer', data);
    },
    proposalData(data: any) {
        store.commit('updateProposal', data);
    },
    matchData(data: any) {
        store.commit('updateMatch', data);
    }
};