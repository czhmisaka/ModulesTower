/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-26 10:42:35
 * @FilePath: /ConfigForDesktopPage/src/modules/ApplicationManage/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";

const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 12,
  },
};

const pageConfig = {
  // main: {
  //   desktopData: mainDesktop,
  //   ...base,
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
