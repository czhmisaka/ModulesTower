/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-18 23:04:46
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/PageConfigData/index.ts
 */

import { isValidKey } from "@/utils/index";

const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 6,
  },
};

import { desktopDataTemplate } from "@/modules/userManage/types";
const pageConfig = {} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
