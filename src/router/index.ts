import { createWebHistory, createRouter } from "vue-router";
import Landing from '../components/Landing.vue';
import Lobby from '../components/lobbies/Lobby.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Landing,
    },
    {
        path: "/lobbies/:lobbyId",
        name: 'lobby',
        component: Lobby,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;