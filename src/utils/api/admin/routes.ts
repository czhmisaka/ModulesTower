/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-21 09:38:02
 * @FilePath: /configforpagedemo/src/utils/api/admin/routes.ts
 */
import { flatChildrenArr, getModuleFromView } from "@/router/util";
import { http } from "../../http";
import { get, post } from "../requests";

type Result = {
  success: boolean;
  data: Array<any>;
};

/**
 * @name: dealAsyncMenuList
 * @description: 处理异步路由
 * @authors: CZH
 * @Date: 2022-12-19 09:35:30
 */
function dealAsyncMenuList(cell) {
  // 排除按钮
  if (cell.type == 4) return false;

  // 判断是否需要处理子节点
  if (cell.children && cell.children.length > 0)
    cell.children = cell.children
      .map((x) => dealAsyncMenuList(x))
      .filter(Boolean);

  // 检查目录下是否存在菜单,如果一个目录下没有菜单则移除
  if (cell.type == 2) {
    if (!cell.children || cell.children.length == 0) return false;
    const flatMenuArr = flatChildrenArr(cell.children).filter(
      (x) => x.type == 3
    );
    if (!flatMenuArr || flatMenuArr.length == 0) return false;
  }

  // 检查模块下是否存在拥有菜单的目录，如不存在则移除整个模块
  if (cell.type == 1) {
    if (!cell.children || cell.children.length == 0) return false;
    const flatIndexMenuArr = flatChildrenArr(cell.children).filter(
      (x) => x.type == 3
    );
    if (!flatIndexMenuArr || flatIndexMenuArr.length == 0) return false;
  }

  // 补充meta
  if (!cell.meta || typeof cell.meta != "object")
    cell.meta = {
      title: cell.name,
      icon: cell.icon,
    };

  // 补充path
  if (cell.urls && cell.urls.length > 0) {
    cell["path"] = cell.urls[0];
  } else {
    cell["path"] = "/" + cell.name;
  }

  // 补充基本组件信息
  cell.component = () => import("@/views/mainPageForPageConfig/index.vue");
  return cell;
}

export const getAsyncRoutes = async () => {
  let data = [];
  let res = await post("/web/usc/menu/list", {});
  res.data.map((x) => {
    data.push(dealAsyncMenuList(x));
  });
  data.filter(Boolean);
  let realMenu = data[0].children;
  return {
    data: realMenu,
  };
};
