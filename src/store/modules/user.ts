/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-04 06:10:23
 * @FilePath: /ConfigForDesktopPage/src/store/modules/user.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import {
  UserResult,
  RefreshTokenResult,
  getLogin,
  refreshTokenApi,
} from "@/utils/api/admin/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";
import { stringAnyObj } from "@/modules/userManage/types";
import { menuInfoTemplate } from "@/components/menu/menuConfigTemplate";
import { get, piwigoMethod, post } from "@/utils/api/requests";

import { loginPage } from "@/router/index";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username:
      (
        storageSession.getItem<DataInfo<number>>(sessionKey) ||
        JSON.parse(localStorage.getItem("user-info") || "{}")
      )?.username ?? "",
    // 页面级别权限
    roles:
      (
        storageSession.getItem<DataInfo<number>>(sessionKey) ||
        JSON.parse(localStorage.getItem("user-info") || "{}")
      )?.roles ?? [],
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    isAdminFlag: false,
    options: {} as stringAnyObj,
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 登入 */
    async loginByUsername(query) {
      return new Promise<UserResult>(async (resolve, reject) => {
        // let res = await getLogin(query);
        let preLogin = await piwigoMethod({
          method: "pwg.session.login",
          ...query,
        });
        let data = await this.loadOption();
        resolve(data);
      });
    },

    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.menuList = [];
      removeToken();
      router.push(loginPage);
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      localStorage.setItem("user-info", "");
      resetRouter();
    },

    /** 获取用户详情 */
    async getOptions() {
      if (Object.keys(this.options).length == 0) {
        await this.loadOption();
      }
      return this.options;
    },

    async loadOption() {
      if (!this.options || Object.keys(this.options).length == 0) {
        let res = await piwigoMethod({
          method: "pwg.session.getStatus",
        });
        res = {
          success: res.stat == "ok",
          data: {
            ...res.result,
            token: res.result.pwg_token,
          },
        };
        if (res && res.success && res.data) {
          let data = {
            ...res.data,
            accessToken: res.data.token,
            refreshToken: res.data.token,
            roles: ["admin"],
            expires: new Date(new Date().getTime() + 19999999),
          };
          console.log('data',data)
          let res_userInfo1 = await post('/user-info?username='+data.username,{})
          // let res_userInfo = await piwigoMethod({
          //   method: "pwg.users.getList",
          //   username: data.username,
          // });
          this.options = {
            ...data,
            ...res_userInfo1.data[0],

            // ...res_userInfo.result.users[0],
          };
          this.isAdminFlag = res.data.loginAdminFlag;
          setToken(this.options);
          return this.options;
        }
      } else return this.options;
    },

    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then((data) => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}
