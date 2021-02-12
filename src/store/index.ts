import { createStore, Store } from 'vuex';
import axios from 'redaxios';
import {lobbyStore as lobby, LobbyState} from './lobby';

export type State = {
    lobby: LobbyState,
}

export const store = createStore<State>({
    modules: {
        lobby,
    },
});

export default store;