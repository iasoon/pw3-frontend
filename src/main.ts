import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import {store, key} from './store';
import './index.css'
import init, {Game} from 'planetwars-rs';

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

init().then((_: any) => {
    const app = createApp(App)
        .use(router)
        .use(store, key);
    app.component('fa-icon', FontAwesomeIcon);
    app.mount('#app')
});
