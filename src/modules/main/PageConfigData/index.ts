/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-30 23:20:48
 * @FilePath: /ConfigForDesktopPage/src/modules/main/PageConfigData/index.ts
 */
import { mainDesktop } from "./main";
import { mobileDesktop } from "./mobile/mobile";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";
import { eat } from "./eat";

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
  // EAT:{
  //   desktopData:eat,
  //   gridColNum: 24,
  //   cusStyle: {
  //     ...base.cusStyle,
  //     wholeScreen: true,
  //     maxRows:16,
  //     Fullscreen:false
  //   },
  // },
  // MAIN: {
  //   desktopData: mainDesktop,
  //   gridColNum: 12,
  //   cusStyle: {
  //     ...base.cusStyle,
  //     wholeScreen: false,
  //     // Fullscreen:true
  //   },
  // },
  // MOBILE: {
  //   ...base,
  //   desktopData: mobileDesktop,
  //   gridColNum: 4,
  // },
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
