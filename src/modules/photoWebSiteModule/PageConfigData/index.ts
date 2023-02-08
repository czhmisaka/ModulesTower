/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-08 22:42:12
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/PageConfigData/index.ts
 */

import { mainDesktop, mobile } from "./main";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

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
  main1: {
    name: "全屏图库",
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 12,
      margin: 12,
      Fullscreen: true,
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
