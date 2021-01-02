import { createWebHistory, createRouter } from "vue-router";
import HelloWorld from '../components/HelloWorld.vue'
import MatchViewer from '../components/MatchViewer.vue'

const routes = [
    {
        path: '/',
        name: "Home",
        component: HelloWorld,
        props: {
            msg: "hallo test",
        }
    },
    {
        path: '/matches/:id',
        name: 'MatchViewer',
        component: MatchViewer,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;