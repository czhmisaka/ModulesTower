/*
* @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-31 09:56:32
 * @FilePath: /configforpagedemo-toVite/src/router/index.ts
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
  if (to.matched.length === 0) {
    console.log('asd')
    next('/desktop/main/main')
  }
  else {
    next()
  }
})



export default router
