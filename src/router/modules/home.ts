/*
 * @Date: 2022-11-21 16:13:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-16 20:43:25
 * @FilePath: /configforpagedemo/src/router/modules/home.ts
 */
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const homeRouter: RouteConfigsTable = {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "home-filled",
    title: "所有模块",
    rank: 0,
  },
  children: [
    // {
    //   path: "/welcome",
    //   name: "Welcome",
    //   component: () => import("@/views/welcome/index.vue"),
    //   meta: {
    //     title: "首页"
    //   }
    // }
  ],
};

export default homeRouter;
