/*
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-03 16:23:32
 * @FilePath: /configforpagedemo/src/main.ts
 */
import {
    RouterHistory,
    RouteRecordRaw,
    RouteComponent,
    createWebHistory,
    createWebHashHistory,
    RouteRecordNormalized
} from "vue-router";
import { createApp } from 'vue'
import App from './App.vue'
import iconCell from './components/basicComponents/cell/icon/iconCell.vue'
import './registerServiceWorker'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { MotionPlugin } from "@vueuse/motion";
import { getModuleFromView, modulesCellTemplate } from '@/router/util'
import * as Icons from '@element-plus/icons-vue'
import utils from './utils'
import Vue3DraggableResizable from 'vue3-draggable-resizable'

const app = createApp(App)




// 全局注册`@iconify/vue`图标库
import {
    IconifyIconOffline,
    IconifyIconOnline,
    FontIcon
} from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);


// 全局注册按钮级别权限组件
import { Auth } from "@/components/ReAuth";
app.component("Auth", Auth);


app.config.globalProperties.$modulesList = getModuleFromView;
app.config.globalProperties.$utils = utils;


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

app.use(MotionPlugin).use(ElementPlus);

app.mount('#app')
