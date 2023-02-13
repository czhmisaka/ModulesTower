/*
 * @Date: 2023-02-04 18:33:26
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-13 10:17:34
 * @FilePath: /configforpagedemo/src/router/modules/remaining.ts
 */
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const remainingRouter: Array<RouteConfigsTable> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101,
      loginPage: true,
      allPeopleCanSee: true,
    },
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      icon: "home-filled",
      title: "首页",
      showLink: false,
      rank: 104,
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue"),
      },
    ],
  },
];

export default remainingRouter;
