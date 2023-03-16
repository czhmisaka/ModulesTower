/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-16 17:17:08
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { PageConfig as ManageOnlyPageConfig } from "./managerOnly";
import { chosSearch, chosSearch_low } from "./chosSearch";
export interface desktopDataTemplate {
  name: string;
  desktopData?: () => Promise<gridCellTemplate[]>;
  gridColNum?: number;
  cusStyle?: {
    wholeScreen: boolean;
    maxRows: number;
    margin: number;
  };
}

const pageConfig = {
  main: {
    name: "图库",
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 12,
      margin: 12,
    },
  },
  main1: {
    name: "全屏图库",
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 12,
      margin: 12,
      Fullscreen: true,
    },
  },
  chosSearch: {
    name: "搜索图片",
    desktopData: chosSearch,
    gridColNum: 24,
    cusStyle: {
      wholeScreen: true,
      maxRows: 16,
      margin: 6,
      Fullscreen: true,
    },
  },
  chosSearch_low: {
    name: "搜索图片_低配版本",
    desktopData: chosSearch_low,
    gridColNum: 18,
    cusStyle: {
      wholeScreen: true,
      maxRows: 12,
      margin: 6,
      Fullscreen: true,
    },
  },
  ...ManageOnlyPageConfig,
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
