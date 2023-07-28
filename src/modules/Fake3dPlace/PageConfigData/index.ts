/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-27 22:16:17
 * @FilePath: /ConfigForDesktopPage/src/modules/Fake3dPlace/PageConfigData/index.ts
 */
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { Fake3dPlace } from "./fake3d";

let pageConfig = {} as { [key: string]: desktopDataTemplate };

let Page = {
  Fake3dPlace: {
    name: "哦fuck",
    desktopData: Fake3dPlace,
    gridColNum: 12,
    cusStyle: {
      testProps: false,
      wholeScreen: true,
      showLink: false,
      maxRows: 8,
      margin: 0,
      Fullscreen: true,
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
