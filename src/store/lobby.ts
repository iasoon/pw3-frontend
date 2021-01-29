export type Lobby = {
    player?: Player,
    // TODO
    data?: any,
}

export type LobbyState = {
    lobby: Lobby,
}

export const lobbyStore = {
    state: {
        lobby: {},
    },
    mutations: {
        setLobbyPlayer(state: LobbyState, player: Player) {
            if (state.lobby) {
                state.lobby.player = player;
            }
        },
        storeLobby(state: LobbyState, lobby: any) {
            if (state.lobby) {
                state.lobby.data = lobby;
            }
        }
    }
};

type Player = {
    name: string,
    token: string,
}


export default lobbyStore;