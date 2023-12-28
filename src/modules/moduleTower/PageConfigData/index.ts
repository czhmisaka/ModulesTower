/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-28 12:41:23
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/index.ts
 */
import { mainDesktop } from "./main";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";

export const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 6,
    allPeopleCanSee: true,
  },
};
let pageConfig = {
  MAIN: {
    name:'MQTT设备列表',
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      ...base.cusStyle,
      wholeScreen: true,
      maxRows:8,
      Fullscreen:true
    },
    menuId:'12'
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
