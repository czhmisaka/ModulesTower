/*
* @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-03 14:43:25
 * @FilePath: /configforpagedemo/src/router/index.ts
*/
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { routerCellMaker, noMenu, getModuleFromView, modulesCellTemplate } from './util';
import { isMobile } from '../utils/Env';

const routes: Array<RouteRecordRaw> = [
  // routerCellMaker('/desktop/:PageName', 'Home', () => import('../modules/main/Index.vue'), noMenu()),
]



const moduleList = getModuleFromView(true);

moduleList.map((module: modulesCellTemplate) => {
  module.routers.map((route: RouteRecordRaw) => {
    routes.push(route)
  })
})

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
// 控制默认到index界面执行匹配
router.beforeEach((to, from, next) => {
    next()
})

  

export default router
