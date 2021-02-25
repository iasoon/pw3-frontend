import { createStore, Store } from 'vuex';
import axios from 'redaxios';
import {lobbyStore as lobby, LobbyState} from './lobby';
import { InjectionKey } from 'vue';

export type State = {
    lobby: LobbyState,
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    modules: {
        lobby,
    },
});

export default store;