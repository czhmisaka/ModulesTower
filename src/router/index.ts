/*
* @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-22 02:03:47
 * @FilePath: /configforpagedemo/src/router/index.ts
*/
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { routerCellMaker, noMenu, getModuleFromView, modulesCellTemplate } from './util';
import { isMobile } from '../utils/Env';

const routes: Array<RouteRecordRaw> = [
  // routerCellMaker('/desktop/:PageName', 'Home', () => import('../modules/main/Index.vue'), noMenu()),
]



const moduleList = getModuleFromView();

moduleList.map((module: modulesCellTemplate) => {
  module.routers.map((route: RouteRecordRaw) => {
    routes.push(route)
  })
})

console.log(routes)


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
// 控制默认到index界面执行匹配
router.beforeEach((to, from, next) => {
  console.log(to,'asd',to.matched)
  if (to.matched.length === 0) {
    next('/desktop/main/main')
    // if (isMobile())
    //   next('/desktop/mobile')
    // else
    //   next('/desktop/main')
  }
  else {
    next()
  }
})



export default router
