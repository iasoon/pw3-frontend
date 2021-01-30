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
            state.lobby.player = player;
        },
        storeLobby(state: LobbyState, lobby: any) {
            state.lobby.data = lobby;
        },
        updatePlayer(state: LobbyState, player: any) {
            state.lobby.data.players[player.name] = player;
        }
    }
};

type Player = {
    name: string,
    token: string,
}


export default lobbyStore;