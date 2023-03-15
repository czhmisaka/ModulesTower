/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-15 22:54:58
 * @FilePath: /ConfigForDesktopPage/src/modules/main/PageConfigData/index.ts
 */
import { mainDesktop } from "./main";
import { mobileDesktop } from "./mobile/mobile";
import { ChenYi } from "./ChenYi";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";

let pageConfig = {
  // MAIN: { desktopData: mainDesktop, gridColNum: 12 },
  // MAIN2: { desktopData: mainDesktop, gridColNum: 14 },
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
