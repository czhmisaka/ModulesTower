/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-21 20:57:41
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/PageConfigData/index.ts
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
import { mainDesktop, userManage } from "./main";
import { actionLogManage } from "./actionLogManage";
import { adminManage, adminManageBtnList } from "./adminManage";
import { stringAnyObj } from "@/modules/userManage/types";
import { btnCellTemplate } from "../types";
import { dictManageBtnList, dictManage } from "./dictManage";

import { userFieldList } from "./user/userValueManage";
const base = {
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
const pageConfig = {} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
