/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-15 16:03:49
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/index.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { apiManage } from "./apiManage";
import { department, departmentBtnList } from "./departmenet";
import { pageConfigManage } from "./pageConfigManage";
import { menuManage, menuManageBtnList } from "./menuManage";
import { roleManage, roleManageBtnList } from "./roleManage";
import { roleBindUserManage } from "./roleBindUserManage";
import {
  mainDesktop,
  mainDesktop_licenseKeyBtnList,
  userManage,
  userManageBtnList,
} from "./main";
import { actionLogManage } from "./actionLogManage";
import { adminManage, adminManageBtnList } from "./adminManage";
import { stringAnyObj } from "@/modules/userManage/types";
import { btnCellTemplate } from "../types";
import { dictManageBtnList, dictManage } from "./dictManage";

import { userFieldList } from "./user/userValueManage";
import { systemMonitor, systemMonitorBtnList } from "./systemMonitor";
import { taskDetail } from "./taskDetail";
import { workteamManage } from "./workteam";
export const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 6,
  },
};

import { desktopDataTemplate } from "@/modules/userManage/types";
import { roleBindUserManageBtnList } from "./roleBindUserManage";
import { userValueManageBtnList } from "./user/userValueManage";
import { PageConfig as outSideSelectPageConfig } from "./outSideSelect/index";

const pageConfig = {
  user: {
    name: "用户管理",
    desktopData: userManage,
    btnList: userManageBtnList,
    ...base,
    permission: [],
    dataPermission: [],
  },
  departmentUser: {
    name: "部门成员管理",
    desktopData: mainDesktop,
    btnList: mainDesktop_licenseKeyBtnList,
    ...base,
    permission: [],
    dataPermission: [],
  },
  department: {
    name: "部门管理",
    desktopData: department,
    btnList: departmentBtnList,
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
    name: "操作日志菜单",
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
    btnList: adminManageBtnList,
    ...base,
  },
  userValueManage: {
    name: "成员字段管理",
    desktopData: userFieldList,
    btnList: userValueManageBtnList,
    ...base,
  },
  systemMonitor: {
    name: "系统监听",
    desktopData: systemMonitor,
    btnList: systemMonitorBtnList,
    ...base,
  },
  taskDetail: {
    name: "服务监控",
    desktopData: taskDetail,
    ...base,
  },
  workteamManage: {
    name: "工作组管理",
    desktopData: workteamManage,
    ...base,
  },
  ...outSideSelectPageConfig,
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
