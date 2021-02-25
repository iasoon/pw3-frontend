import store from './store';

const uri = `ws://${location.host}/websocket`;

class WsConnection {
    private socket?: WebSocket;
    private buffer: string[];

    constructor() {
        this.buffer = [];
        console.log(this.buffer);
    }

    send(object: any) {
        this.sendMessage(JSON.stringify(object));
    }

    private sendMessage(message: string) {
        if (!this.socket) {
            this.socket = new WebSocket(uri);
            this.socket.onopen = e => this.onOpen(e);
            this.socket.onclose = _ => console.log('websocket disconnected');
            this.socket.onmessage = e => this.onMessage(e);
        }

        if (this.socket.readyState == WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            this.buffer.push(message);
        }
    }

    private onOpen(_ev: Event) {
        console.log('websocket connected');
        this.buffer.forEach(msg => this.socket?.send(msg));
        this.buffer = [];
    }

    private onMessage(ev: MessageEvent) {
        const event = JSON.parse(ev.data);
        HANDLER_MAP[event.type](event.data);
    }
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

export const wsConnection = new WsConnection();
export default wsConnection;