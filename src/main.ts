// svg-mesh requires global to exist
(window as any).global = window;

import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import {store, key} from './store';
import './index.css'
import Game from 'planetwars-rs';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faCircle,
    faCheck,
} from '@fortawesome/free-solid-svg-icons'


library.add(
    faCircle,
    faCheck,
);

const app = createApp(App)
    .use(router)
    .use(store, key);
app.component('fa-icon', FontAwesomeIcon);
app.mount('#app')

