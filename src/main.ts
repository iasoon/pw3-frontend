import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css'
import init, {Game} from 'planetwars-rs';

init().then(m => {
    createApp(App).use(router).use(store).mount('#app')
});
