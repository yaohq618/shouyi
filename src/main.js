import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from './store'
import { createPinia } from 'pinia';
import router from "./router"
import {createPersistedState} from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn.js'

const app = createApp(App)
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist)
app.use(pinia);
app.use(ElementPlus,{locale})
app.use(router)
app.use(store)
app.mount('#app')

