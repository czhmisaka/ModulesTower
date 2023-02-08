/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-08 22:53:11
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/index.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { mainDesktop, userManage } from "./main";
import { actionLogManage } from "./actionLogManage";
import { adminManage } from "./adminManage";
import { stringAnyObj } from "@/modules/userManage/types";
import { btnCellTemplate } from "../types";
import { dictManageBtnList, dictManage } from "./dictManage";

const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 12,
  },
};
export interface desktopDataTemplate {
  desktopData?: () => Promise<gridCellTemplate[]>;
  gridColNum?: number;
  cusStyle?: {
    wholeScreen: boolean;
    maxRows: number;
    margin: number;
  };
  permission?: stringAnyObj[];
  dataPermission?: stringAnyObj[];
  btnList?: btnCellTemplate[];
}

const pageConfig = {} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
