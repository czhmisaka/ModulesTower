/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-19 18:05:04
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/index.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { tagManage } from "./tagManage";
import { categoryManage } from "./categoryManage";

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
  tagManage: {
    name: "标签管理",
    desktopData: tagManage,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 6,
    },
  },

  categoryManage: {
    name: "相册管理",
    desktopData: categoryManage,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 6,
    },
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
