/*
 * @Date: 2022-11-21 16:13:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-14 18:08:03
 * @FilePath: /lcdp_fe_setup/src/router/modules/error.ts
 */
import type { RouteConfigsTable } from "/#/index";
import { wholeScreen } from "../../modules/ApplicationManage/PageConfigData/main";

const errorRouter: RouteConfigsTable = {
  path: "/error",
  redirect: "/error/403",
  meta: {
    icon: "information-line",
    title: "异常页面",
    rank: 9,
    showLink: false,
  },
  children: [
    {
      path: "/error/403",
      name: "403",
      component: () => import("@/views/error/403.vue"),
      meta: {
        title: "403",
        showLink: false,
      },
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: "404",
        showLink: false,
        wholeScreen: true,
        Fullscreen: true,
      },
    },
    {
      path: "/error/500",
      name: "500",
      component: () => import("@/views/error/500.vue"),
      meta: {
        title: "500",
        showLink: false,
      },
    },
  ],
};

export default errorRouter;
