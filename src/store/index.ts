import { createStore, Store } from 'vuex';
import axios from 'redaxios';

type State = {
    user?: User,
}

type User = {
    nickname: string,
    token: string,
}

function getUser(): User | undefined {
    const retrieved = window.localStorage.getItem('user');
    if (!retrieved) {
        return;
    }
    const parsed = JSON.parse(retrieved);

    if (parsed.nickname && parsed.token) {
        return {
            nickname: parsed.nickname,
            token: parsed.token,
        }
    }
}

export const store = createStore<State>({
    state: {
        user: getUser(),
    },
    mutations: {
        setUser(state, user: User) {
            state.user = user;
            window.localStorage.setItem('user', JSON.stringify(user));
        }
    },
    actions: {
        connect(context, user: User) {
            axios.post('/api/connect', user)
                .then(response => {
                    context.commit('setUser', user);
                })
        }
    }
});

export default store;