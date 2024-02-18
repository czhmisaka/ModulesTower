/*
 * @Date: 2023-02-13 09:16:34
 * @LastEditors: CZH
 * @LastEditTime: 2024-02-05 21:50:08
 * @FilePath: /ConfigForDesktopPage/src/router/modules/home.ts
 */
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const homeRouter: RouteConfigsTable = {
  path: "/",
  name: "Home",
  component: Layout,
  meta: {
    icon: "home-filled",
    title: "首页",
    rank: 0,
  },
  children: [],
};

export default homeRouter;
