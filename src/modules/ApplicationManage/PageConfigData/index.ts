/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-17 23:37:57
 * @FilePath: /ConfigForDesktopPage/src/modules/ApplicationManage/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";

const base = {
  name: "集成应用管理界面",
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 12,
    Fullscreen: false, //占满整个屏幕
    showLink: false,
  },
};

const pageConfig = {
  main: {
    name: "开放平台应用管理界面-应用信息和管理界面",
    desktopData: mainDesktop,
    gridColNum: 192,
    cusStyle: {
      wholeScreen: true,
      maxRows: 108,
      margin: 0.01,
      Fullscreen: true,
      showLink: false,
      // NoMenu: true,
    },
    // InRouter: true,
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
