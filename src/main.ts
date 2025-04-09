import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import Vant from 'vant';
import 'vant/lib/index.css';
// 引入iconfont图标
import '../public/icons/iconfont.js';
import '../public/icons/iconfont.css';

// 设置网页标题
document.title = '智云星课';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(Vant);
app.use(pinia);
app.mount('#app');
