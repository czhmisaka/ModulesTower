/*
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-05 18:46:52
 * @FilePath: /configforpagedemo/src/main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import pageModules from './config/pageConfigs'


const app = createApp(App)
app.config.globalProperties.$pageModules = pageModules
app.use(router)
app.use(ElementPlus)
app.mount('#app')
