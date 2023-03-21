import type { RouteConfigsTable } from "/#/index";
import { defineAsyncComponent } from "vue";

/**
 * @name: routerCellMaker
 * @description: 路由单元构建函数
 * @authors: CZH
 * @Date: 2022-04-29 14:49:39
 */
export const routerCellMaker = (
  path: string,
  name: string,
  component: any,
  options: {
    meta?: { [key: string]: any };
    router?: { [key: string]: any };
  } = {},
  children?: RouteConfigsTable[]
): RouteConfigsTable => {
  let routerCell: RouteConfigsTable = {
    path,
    name,
    component,
    children,
    meta: {
      title: name,
      icon: "bxs:package",
      ...options["meta"],
      // 这里的false可能需要根据用户的登录身份修改
      showLink: true,
      // 这个属性用于标注这个路由的来源 ，只有超级管理员能保持一直可见
      moduleBackUpRouter: true,
    },
    ...options["router"],
  };
  return routerCell;
};

export default [
  routerCellMaker(
    "/testPath",
    "f_test",
    defineAsyncComponent(() => import("@/views/welcome/index.vue")),
    {
      meta: {
        Fullscreen: true,
      },
    }
  ),
];
