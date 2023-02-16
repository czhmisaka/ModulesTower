/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-16 16:52:17
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/index.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { apiManage } from "./apiManage";
import { department } from "./departmenet";
import { pageConfigManage } from "./pageConfigManage";
import { menuManage, menuManageBtnList } from "./menuManage";
import { roleManage, roleManageBtnList } from "./roleManage";
import { roleBindUserManage } from "./roleBindUserManage";
import { mainDesktop, userManage } from "./main";
import { actionLogManage } from "./actionLogManage";
import { adminManage } from "./adminManage";
import { stringAnyObj } from "@/modules/userManage/types";
import { btnCellTemplate } from "../types";
import { dictManageBtnList, dictManage } from "./dictManage";

import { userFieldList } from "./user/userValueManage";
const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 12,
  },
};

import { desktopDataTemplate } from "@/modules/userManage/types";
import { roleBindUserManageBtnList } from "./roleBindUserManage";
import { userValueManageBtnList } from "./user/userValueManage";
const pageConfig = {
  user: {
    name: "用户管理",
    desktopData: userManage,
    ...base,
    permission: [],
    dataPermission: [],
  },
  departmentUser: {
    name: "部门成员管理",
    desktopData: mainDesktop,
    ...base,
    permission: [],
    dataPermission: [],
  },
  department: {
    name: "部门管理",
    desktopData: department,
    ...base,
  },
  menuManage: {
    name: "菜单管理",
    desktopData: menuManage,
    ...base,
    btnList: menuManageBtnList,
  },
  roleManage: {
    name: "角色管理",
    desktopData: roleManage,
    ...base,
    btnList: roleManageBtnList,
  },
  apiManage: {
    name: "API管理",
    desktopData: apiManage,
    ...base,
  },
  roleBindUserManage: {
    name: "用户角色管理",
    desktopData: roleBindUserManage,
    btnList: roleBindUserManageBtnList,
    ...base,
  },
  actionLogManage: {
    name: "用户行为日志",
    desktopData: actionLogManage,
    ...base,
  },
  dictManage: {
    name: "字典管理",
    desktopData: dictManage,
    btnList: dictManageBtnList,
    ...base,
  },
  adminManage: {
    name: "管理员权限编辑",
    desktopData: adminManage,
    ...base,
  },
  userValueManage: {
    name: "成员字段管理",
    desktopData: userFieldList,
    btnList: userValueManageBtnList,
    ...base,
  },
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
