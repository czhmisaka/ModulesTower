import { iconType } from "@/components/ReIcon/src/types";
import { stringAnyObj } from "@/modules/userManage/types";

/*
 * @Date: 2023-10-08 18:45:53
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-12 16:21:29
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/component/sideMenu/menuCell/types.ts
 */
export enum menuCellActionTemplate {
  Function = "Function",
  RouterPush = "RouterPush",
  MenuCellList = "MenuCellList",
}

export interface menuCellOptions {
  function?: (that: stringAnyObj, data?: stringAnyObj) => void | Promise<void>;
  router?: {
    path: string;
    [key: string]: any;
  };
}

export interface menuCellTemplate {
  icon: iconType;
  title: string;
  key: string;
  type: menuCellActionTemplate;
  options?: menuCellOptions;
  children?: menuCellTemplate[];
}
