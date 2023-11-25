/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-15 16:16:51
 * @FilePath: /lcdp_fe_setup/src/modules/Graph/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { threemainDesktop } from "./3dmain";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";

const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 12,
    Fullscreen: true,
  },
};

const pageConfig = {
  main: {
    desktopData: mainDesktop,
    ...base,
  },
  three: {
    desktopData: threemainDesktop,
    ...base,
    InRouter: true,
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
