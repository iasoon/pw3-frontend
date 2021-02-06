import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css'
import init, {Game} from 'planetwars-rs';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCircle);

init().then(m => {
    const app = createApp(App).use(router).use(store);
    app.component('fa-icon', FontAwesomeIcon);
    app.mount('#app')
});
