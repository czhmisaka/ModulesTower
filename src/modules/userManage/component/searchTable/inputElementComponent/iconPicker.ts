/*
 * @Date: 2023-07-24 15:13:16
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-26 18:00:59
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/searchTable/inputElementComponent/iconPicker.ts
 */

import { stringAnyObj } from "@/modules/userManage/types";

export enum IconType {
  elIcon = "elicon",
  svg = "svg",
  image = "image",
}

export interface iconTemplate {
  iconType: IconType;
  src: string;
  color?: string;
  bgColor?: string;
  options?: stringAnyObj;
}
