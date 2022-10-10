/*
* @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-10 20:43:32
 * @FilePath: /configforpagedemo/src/router/index.ts
*/
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { routerCellMaker, noMenu } from './util'
import { isMobile } from '../utils/Env';

const routes: Array<RouteRecordRaw> = [
  routerCellMaker('/desktop/:PageName', 'Home', () => import('../views/Home.vue'), noMenu()),
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
// 控制默认到index界面执行匹配
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    if (isMobile())
      next('/desktop/mobile')
    else
      next('/desktop/main')
  }
  else {
    next()
  }
})

export default router
