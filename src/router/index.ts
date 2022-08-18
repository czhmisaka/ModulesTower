/*
* @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-16 12:57:24
 * @FilePath: /configforpagedemo/src/router/index.ts
*/
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { routerCellMaker, noMenu } from './util'

const routes: Array<RouteRecordRaw> = [
  routerCellMaker('/index/:PageName', 'Home', () => import('../views/Home.vue'), noMenu()),
  routerCellMaker('/mobile/:PageName', 'MobileHome', () => import('../views/Home.vue'), noMenu()),
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
// 控制默认到index界面执行匹配
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    next('/index/czhmisaka')
  }
  else {
    next()
  }
})

export default router
