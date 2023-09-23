/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-24 03:48:10
 * @FilePath: /ConfigForDesktopPage/src/modules/main/PageConfigData/index.ts
 */
import { mainDesktop } from "./main";
import { mobileDesktop } from "./mobile/mobile";
import { ChenYi } from "./ChenYi";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";
import { eat } from "./eat";

let pageConfig = {
  // MAIN: {
  //   name: "asd",
  //   desktopData: mainDesktop,
  //   gridColNum: 8,
  //   cusStyle: {
  //     maxRows: 12,
  //     wholeScreen: true,
  //     margin: 6,
  //     Fullscreen: true,
  //     showLink: true,
  //   },
  // },
  // MOBILE: { desktopData: mobileDesktop, gridColNum: 4 },
  // CHENYI: { desktopData: ChenYi, gridColNum: 4 }
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
