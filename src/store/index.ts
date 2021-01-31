import { createStore, Store } from 'vuex';
import axios from 'redaxios';
import {lobbyStore as lobby, LobbyState} from './lobby';

export type State = {
    lobby: LobbyState,
}

// function getUser(): User | undefined {
//     const retrieved = window.localStorage.getItem('user');
//     if (!retrieved) {
//         return;
//     }
//     const parsed = JSON.parse(retrieved);

//     if (parsed.nickname && parsed.token) {
//         return {
//             nickname: parsed.nickname,
//             token: parsed.token,
//         }
//     }
// }
export const store = createStore<State>({
    modules: {
        lobby,
    },
});

export default store;