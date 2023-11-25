/*
 * @Date: 2022-11-21 16:13:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-28 15:05:49
 * @FilePath: /lcdp_fe_setup/src/store/modules/types.ts
 */
import { stringAnyObj } from "@/modules/userManage/types";
import { extend } from "lodash";
import { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
  path?: string;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
};

export type multiType = {
  path: string;
  parentPath: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  username?: string;
  roles?: Array<string>;
  verifyCode?: string;
  isAdminFlag?: boolean;
  currentPage?: number;
  menuList?: stringAnyObj[];
  options: stringAnyObj;
  isLoading: boolean;
};

export type loadingType = {
  fullScreenLoading: boolean;
  [key: string]: boolean;
};
