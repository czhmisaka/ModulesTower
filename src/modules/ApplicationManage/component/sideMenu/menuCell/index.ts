/*
 * @Date: 2023-05-30 10:47:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-12 16:21:11
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/component/sideMenu/menuCell/index.ts
 */
import * as Icons from "@element-plus/icons-vue";
import { stringAnyObj } from "@/modules/userManage/types";
import { menuCellActionTemplate, menuCellTemplate } from "./types";

type iconType = keyof typeof Icons;

/**
 * @name: menuCellMaker
 * @description: 侧边菜单构建
 * @authors: CZH
 * @Date: 2023-10-08 15:56:13
 */
export const sideMenuCellMaker = (
  title: string = "",
  key: string = "/",
  icon: iconType,
  options: stringAnyObj = {},
  type: menuCellActionTemplate = menuCellActionTemplate.RouterPush
): menuCellTemplate => {
  let back = {
    icon,
    title,
    type,
    key,
    options: {
      ...options,
    },
  } as menuCellTemplate;
  return back;
};

export const sideMenuCellListMaker = (
  title: string = "",
  icon: iconType,
  menuCellTemplateList: menuCellTemplate[] = [],
  options: stringAnyObj = {}
): menuCellTemplate => {
  let back = {
    icon,
    title,
    key: "1",
    type: menuCellActionTemplate.MenuCellList,
    options: {
      path: "/",
      ...options,
    },
    children: menuCellTemplateList,
  } as menuCellTemplate;
  return back;
};

export default {};
