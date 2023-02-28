/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-28 18:24:25
 * @FilePath: /configforpagedemo/src/modules/ApplicationManage/PageConfigData/index.ts
 */

import { mainDesktop } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";

import { ApplicationManage } from "@/modules/ApplicationManage/PageConfigData/ApplicationManage";

const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 12,
  },
};

const pageConfig = {
  main: {
    desktopData: mainDesktop,
    ...base,
    cusStyle: {
      ...base.cusStyle,
      Fullscreen: true,
    },
  },
  集成应用管理界面: {
    desktopData: ApplicationManage,
    ...base,
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
