/*
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2021-12-30 17:47:22
 * @FilePath: /configforpagedemo/src/main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

let app = createApp(App)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
