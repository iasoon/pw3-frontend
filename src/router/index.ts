import { createWebHistory, createRouter } from "vue-router";
import HelloWorld from '../components/HelloWorld.vue';
import MatchViewer from '../components/MatchViewer.vue';
import Lobbies from '../components/lobbies/Lobbies.vue';
import Lobby from '../components/lobbies/Lobby.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HelloWorld,
        props: {
            msg: "hallo test",
        }
    },
    {
        path: '/matches/:id',
        name: 'MatchViewer',
        component: MatchViewer,
    },
    {
        path: '/lobbies',
        name: 'Lobbies',
        component: Lobbies,
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