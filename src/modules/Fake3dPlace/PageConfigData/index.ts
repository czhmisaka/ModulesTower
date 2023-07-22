/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-23 01:56:42
 * @FilePath: /ConfigForDesktopPage/src/modules/Fake3dPlace/PageConfigData/index.ts
 */
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { Fake3dPlace } from "./fake3d";

let pageConfig = {} as { [key: string]: desktopDataTemplate };

let Page = {
  // Fake3dPlace: {
  //   name: "哦fuck",
  //   desktopData: Fake3dPlace,
  //   gridColNum: 24,
  //   cusStyle: {
  //     testProps: true,
  //     wholeScreen: true,
  //     maxRows: 16,
  //     margin: 3,
  //     Fullscreen: false,
  //   },
  // },
} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
