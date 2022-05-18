/*
* @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-15 22:22:46
 * @FilePath: /configforpagedemo/src/router/index.ts
*/
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { routerCellMaker, noMenu } from './util'

const routes: Array<RouteRecordRaw> = [
  routerCellMaker('/', 'Home', () => import('../views/Home.vue'), noMenu()),
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
