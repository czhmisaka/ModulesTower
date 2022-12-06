/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-06 14:21:14
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { apiManage } from "./apiManage";
import { department } from "./departmenet";
import { pageConfigManage } from "./pageConfigManage";
import { menuManage } from "./menuManage";
import { roleManage } from "./roleManage";

export interface desktopDataTemplate {
  desktopData?: () => Promise<gridCellTemplate[]>;
  gridColNum?: number;
  cusStyle?: {
    wholeScreen: boolean;
    maxRows: number;
    margin: number;
  };
}

const pageConfig = {
  user: {
    name: "用户管理(基于部门)",
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 12,
    },
    permission: [],
    dataPermission: [],
  },
  department: {
    name: "部门管理",
    desktopData: department,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 12,
    },
  },
  // pageConfigManage: {
  //   name: "页面配置管理",
  //   desktopData: pageConfigManage,
  //   gridColNum: 12,
  //   cusStyle: {
  //     wholeScreen: true,
  //     maxRows: 8,
  //     margin: 12,
  //   },
  // },
  menuManage: {
    name: "菜单管理",
    desktopData: menuManage,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 12,
    },
  },
  roleManage: {
    name: "角色管理",
    desktopData: roleManage,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 12,
    },
  },
  apiManage: {
    name: "API管理",
    desktopData: apiManage,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 12,
    },
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
