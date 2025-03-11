import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import Vant from 'vant';
import 'vant/lib/index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(Vant);
app.use(pinia);
app.mount('#app');
