import store from "./store";

const webSocketProtocol = window.location.protocol.startsWith("https:")
  ? "wss"
  : "ws";
const uri = `${webSocketProtocol}://${location.host}/websocket`;

class WsConnection {
  private socket?: WebSocket;
  private buffer: string[];

  private handlers: { [type: string]: (data: any) => void } = {};
  private matchSubscribers: Map<number, (state: string) => void>;

  private streamCounter = 0;

  constructor() {
    this.buffer = [];
    this.matchSubscribers = new Map();
    this.initHandlers();
  }

  send(object: any) {
    this.sendMessage(JSON.stringify(object));
  }

  subscribeToMatch(matchId: string, cb: (state: string) => void): number {
    this.streamCounter += 1;
    const streamId = this.streamCounter;

    this.matchSubscribers.set(streamId, cb);
    this.send({
      type: "subscribeToMatch",
      matchId,
      streamId,
    });
    return streamId;
  }

  dropSubscription(streamId: number) {
    this.matchSubscribers.delete(streamId);
    // TODO: send this upstream
  }

  private sendMessage(message: string) {
    if (!this.socket) {
      this.socket = new WebSocket(uri);
      this.socket.onopen = (e) => this.onOpen(e);
      this.socket.onclose = (_) => console.log("websocket disconnected");
      this.socket.onmessage = (e) => this.onMessage(e);
    }

    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      this.buffer.push(message);
    }
  }

  private onOpen(_ev: Event) {
    console.log("websocket connected");
    this.buffer.forEach((msg) => this.socket?.send(msg));
    this.buffer = [];
  }

  private onMessage(ev: MessageEvent) {
    const event = JSON.parse(ev.data);
    this.handlers[event.type](event.data);
  }

  private initHandlers() {
    this.handlers.lobbyState = (state: any) => {
      store.commit("storeLobby", state);
    };
    this.handlers.playerData = (data: any) => {
      store.commit("updatePlayer", data);
    };
    this.handlers.proposalData = (data: any) => {
      store.commit("updateProposal", data);
    };
    this.handlers.matchData = (data: any) => {
      store.commit("updateMatch", data);
    };
    this.handlers.matchLogEvent = (data: any) => {
      const subscriber = this.matchSubscribers.get(data.streamId);
      if (subscriber) {
        subscriber(data.event);
      }
    };
  }
}

export const wsConnection = new WsConnection();
export default wsConnection;
