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
        },
        updateProposal(state: LobbyState, proposal: any) {
            if (!state.lobby.data.proposals) {
                state.lobby.data.proposals = {};
            }
            state.lobby.data.proposals[proposal.id] = proposal;
        },
        updateMatch(state: LobbyState, match: any) {
            if (!state.lobby.data.matches) {
                state.lobby.data.matches = {};
            }
            state.lobby.data.matches[match.id] = match;
        }
    }
};

type Player = {
    name: string,
    token: string,
}


export default lobbyStore;