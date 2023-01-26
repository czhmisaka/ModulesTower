/*
 * @Date: 2022-01-22 18:59:01
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-21 20:52:36
 * @FilePath: /configforpagedemo/src/utils/api/requests.ts
 */

import axios from "axios";
import { clearCookie, getCookie } from "./config/cookie";
import { getHeaders } from "./user/header";
export const CancelToken: any = axios.CancelToken; // axios 的取消请求
import { ElMessage } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { stringAnyObj } from "@/modules/userManage/types";

// development , production
const Env = import.meta.env.VITE_MODE;
const isDev = () => Env == "development";
import { loadEnv } from "@build/index";
const { VITE_PROXY_DOMAIN_REAL } = loadEnv();

export function isMobile() {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true; // 移动端
  } else {
    return false; // PC端
  }
}

let baseURL = isDev ? "/" : "/";
const request = axios.create({
  baseURL: baseURL, // 可以不需要
  timeout: 100000000, // 超时时间
  withCredentials: true,
  validateStatus() {
    return true;
  },
});

// 防止重复提交 利用axios的cancelToken
// 这里保存了部分拒绝进入重复请求中断功能的请求
let pendingList: string[] = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识

/**
 * 取消重复请求
 * @param config
 * @param f
 */
const queue: any[] = [];
// axios内置的中断ajax的方法

// 同样的url、方法、参数可以视为相同的请求
const configString = (config: any) => {
  if (
    pendingList
      .map((x) => {
        return config.url.indexOf(x) > -1 ? true : false;
      })
      .filter(Boolean).length > 0
  ) {
    return `${config.url}_${config.method}_${config.data}_${Math.random()}`;
  }
  // return `${config.url}_${config.method}_${config.data}`;
  return `${config.url}_${config.method}_${config.data}_${Math.random()}`;
};

// 响应拦截调用
// 中断重复的请求，并从队列中移除
const removeQueue = (config: any) => {
  for (let i = 0, size = queue.length; i < size; i++) {
    const task = queue[i];
    if (task.token === configString(config)) {
      if (task.cancel) task.cancel();
      queue.splice(i, 1);
      break;
    }
  }
};
/**
 * 请求拦截器
 */
request.interceptors.request.use((config) => {
  removeQueue(config);
  // 添加cancelToken
  config.cancelToken = new CancelToken((c) => {
    queue.push({ token: configString(config), cancel: c });
  });
  //一定要将config return 出去
  return config;
});

/**
 * 响应拦截器
 */
//响应拦截
request.interceptors.response.use(
  (response) => {
    removeQueue(response.config);
    const res = response.data;
    if (
      (res.code === 200 && res.type != "error") ||
      res.type == "success" ||
      res.code == 0
    ) {
      return Promise.resolve(res);
    } else if (res.code === 401) {
      // 未登录状态
      ElMessage({
        message: "登录过期啦",
        type: "warning",
      });
      useUserStoreHook().logOut();
    } else {
      if (res.message) ElMessage.error(res.message);
      return Promise.reject(res);
    }
  },
  (error: any) => {
    // Http错误状态码处理
    return Promise.reject(error);
  }
);

export const get = (url: string, params: any) => {
  return request({
    url: VITE_PROXY_DOMAIN_REAL + url,
    method: "get",
    headers: getHeaders(),
    params,
  }) as stringAnyObj;
};

export function post(url: string, data: object) {
  return request({
    url: VITE_PROXY_DOMAIN_REAL + url,
    headers: getHeaders(),
    method: "post",
    data,
  }) as stringAnyObj;
}
