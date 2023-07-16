/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-16 20:53:17
 * @FilePath: /ConfigForDesktopPage/src/modules/dailyTask/PageConfigData/index.ts
 */
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";
import { TaskManage } from "./TaskManage";
import { mainDesktop } from "@/modules/main/PageConfigData/main";
import { mobileDesktop } from "@/modules/main/PageConfigData/mobile/mobile";

let pageConfig = {} as { [key: string]: desktopDataTemplate };

let Page = {
  renwuliebiao: {
    name: "任务列表",
    desktopData: mobileDesktop,
    gridColNum: 4,
    cusStyle: {
      maxRows: 8,
      wholeScreen: true,
      margin: 8,
      Fullscreen: true,
      showLink: false,
    },
  },
  main: {
    name: "ads任务列表",
    desktopData: mainDesktop,
    gridColNum: 12,
    cusStyle: {
      maxRows: 8,
      wholeScreen: true,
      margin: 8,
      Fullscreen: false,
      showLink: false,
    },
  },
} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
