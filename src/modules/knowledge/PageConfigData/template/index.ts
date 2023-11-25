/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-29 14:45:52
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/PageConfigData/template/index.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { 模板列表搜索页面 } from "./templateManage";
import { 模板编辑桌面 } from "./templateDetail";

let pageConfig = {} as { [key: string]: desktopDataTemplate };
const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 2,
  },
};
let Page = {
  模板列表搜索页面: {
    ...base,
    desktopData: 模板列表搜索页面,
  },
  模板编辑桌面: {
    gridColNum: 18,
    cusStyle: {
      wholeScreen: true,
      maxRows: 15,
      margin: 3,
    },
    desktopData: 模板编辑桌面,
  },
} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
