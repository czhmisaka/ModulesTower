/*
 * @Date: 2022-11-21 16:13:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-29 00:08:58
 * @FilePath: /ConfigForDesktopPage/src/router/modules/home.ts
 */
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const homeRouter: RouteConfigsTable = {
  path: "/",
  name: "Home",
  redirect: "/photoWebSiteModule/MAIN",
  component: Layout,
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
    //     title: "首页",
    //   },
    // },
  ],
};

export default homeRouter;
