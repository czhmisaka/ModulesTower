/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-16 20:55:19
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { PageConfig as ManageOnlyPageConfig } from "./managerOnly";
import { chosSearch, chosSearchMobile, chosSearchTest } from "./chosSearch";
import { myPicture } from "./myPicture";
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
      margin: 6,
    },
  },
  myPicture: {
    name: "暂存区",
    desktopData: myPicture,
    gridColNum: 12,
    cusStyle: {
      showLink: false,
      wholeScreen: true,
      Fullscreen: false,
      maxRows: 12,
      margin: 6,
    },
  },
  chosSearch: {
    name: "搜索图片",
    desktopData: chosSearch,
    gridColNum: 24,
    cusStyle: {
      showLink: false,
      wholeScreen: true,
      maxRows: 16,
      margin: 6,
      Fullscreen: true,
    },
  },
  chosSearchs: {
    name: "搜索图片手机端",
    desktopData: chosSearchMobile,
    gridColNum: 8,
    cusStyle: {
      showLink: false,
      wholeScreen: true,
      maxRows: 16,
      margin: 6,
      Fullscreen: true,
    },
  },
  chosSearch_test: {
    name: "测试页面",
    desktopData: chosSearchTest,
    gridColNum: 8,
    cusStyle: {
      showLink: false,
      wholeScreen: true,
      maxRows: 16,
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
