/*
 * @Date: 2022-10-09 16:23:43
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-16 16:37:09
 * @FilePath: /configforpagedemo/src/utils/api/user/header.ts
 */

import { getCookie } from "./cookie";
import { getToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { de } from "element-plus/es/locale";

export function isMobile() {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return "移动端"; // 移动端
  } else {
    return "PC端"; // PC端
  }
}

/**
 * @name: getheaderTemplate
 * @description: 获取headers模板
 * @authors: CZH
 * @Date: 2022-10-09 14:39:06
 */
const getheaderTemplate = () => {
  let DataInfo = getToken() || {};
  const menuId = localStorage.getItem("menuId");
  let back = {
    route: window.location.href.split("#")[1],
    token: DataInfo["accessToken"], // 向后台发送的token
    "Content-Type": "application/json;charset=utf-8",
    "ddm-parameter-encrypt": true,
    menuId,
    equipment: isMobile(),
  };
  return back;
};

/**
 * @name: getHeaders
 * @description: 获取默认的headers配置
 * @authors: CZH
 * @Date: 2022-10-09 14:21:22
 */
export const getHeaders = (
  options: {
    [key: string]: any;
  } = {}
) => {
  let back = {
    ...getheaderTemplate(),
    ...options,
  } as {
    [key: string]: any;
  };
  back["ddm-parameter-encrypt"] = false;
  if (back["ddm-parameter-encrypt"] == true) {
    delete back["ddm-parameter-encrypt"];
  }
  return back;
};

export const getPureRequestHeaders = (
  options: {
    [key: string]: any;
  } = {}
) => {
  let back = {
    ...getheaderTemplate(),
    "ddm-parameter-encrypt": false,
    ...options,
  } as {
    [key: string]: any;
  };
  if (back["ddm-parameter-encrypt"] == true) {
    delete back["ddm-parameter-encrypt"];
  }
  return back;
};
