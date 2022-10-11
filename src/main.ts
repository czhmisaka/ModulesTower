/*
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-11 09:39:23
 * @FilePath: /configforpagedemo/src/main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import iconCell from './components/basicComponents/cell/icon/iconCell.vue'
import './registerServiceWorker'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import pageModules from './config/pageConfigs'
import * as Icons from '@element-plus/icons-vue'
import utils from './utils'
import Vue3DraggableResizable from 'vue3-draggable-resizable'


const app = createApp(App)

app.config.globalProperties.$pageModules = pageModules
app.config.globalProperties.$utils = utils
for (let x in Icons) {
    if (utils.isValidKey(x, Icons)) {
        app.component(x, Icons[x])
    } else {
        console.log('icon 加载失败 : ', x)
    }
}
app.component('CusIcon', iconCell)
app.component('vue-drag-resize', Vue3DraggableResizable)
app.use(router)
app.use(ElementPlus)





app.mount('#app')
