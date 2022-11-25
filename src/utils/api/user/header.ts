/*
 * @Date: 2022-10-09 16:23:43
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-25 10:21:21
 * @FilePath: /configforpagedemo/src/utils/api/user/header.ts
 */

import { getCookie } from "./cookie";

/**
 * @name: getheaderTemplate
 * @description: 获取headers模板
 * @authors: CZH  
 * @Date: 2022-10-09 14:39:06
 */
const getheaderTemplate = () => {
  let str = getCookie("authorized-token").replaceAll("%2C", ",");
  if (!str) str = "{}";
  let data = JSON.parse(str);
  let back = {
    token: data["accessToken"], // 向后台发送的token
    "Content-Type": "application/json;charset=utf-8",
    "ddm-parameter-encrypt": true,
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
