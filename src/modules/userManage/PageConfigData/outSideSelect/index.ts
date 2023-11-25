/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-20 13:39:50
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/outSideSelect/index.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
export const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 6,
  },
};

import { desktopDataTemplate } from "@/modules/userManage/types";
import { userSelect } from "./userSelect";

const pageConfig = {} as { [key: string]: desktopDataTemplate };

let Page = {
  userselect: {
    ...base,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 12,
      Fullscreen: true,
      allPeopleCanSee: true,
    },
    name: "选择用户",
    desktopData: userSelect,
    InRouter: true,
  },
} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
