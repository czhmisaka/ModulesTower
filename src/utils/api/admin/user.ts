/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-16 16:55:56
 * @FilePath: /configforpagedemo/src/utils/api/admin/user.ts
 */
import { http } from "../../http";
import { post } from "../requests";
import { deviceDetection } from "@pureadmin/utils";
import {
  menuCellMaker,
  menuInfoTemplate,
  menuInfoType,
} from "@/components/menu/menuConfigTemplate";

export type UserResult = {
  success: boolean;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export interface menuCell {}

const terminalType = {
  1: "PC",
  2: "H5",
};

/** 登录 */
export const getLogin = async (data?: object) => {
  // return http.request<UserResult>("post", "/login", { data });
  return await post("/web/usc/login", {
    lcdp: data,
    terminalType: deviceDetection() ? 2 : 1,
  });
};

export const getMenuList = async () => {
  let menuList = [] as menuInfoTemplate[];
  let res = await post("/web/usc/menu/list", {});
  menuList = res.data;
  return menuList;
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};
