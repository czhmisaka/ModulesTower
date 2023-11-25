/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-09 14:41:49
 * @FilePath: /lcdp_fe_setup/src/store/modules/user.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageLocal, storageSession, toggleClass } from "@pureadmin/utils";
import {
  UserResult,
  RefreshTokenResult,
  getLogin,
  refreshTokenApi,
} from "@/utils/api/admin/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";
import { btnActionTemplate, stringAnyObj } from "@/modules/userManage/types";
import { menuInfoTemplate } from "@/components/menu/menuConfigTemplate";
import { get, post } from "@/utils/api/requests";

import { loginPage } from "@/router/index";
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { getConfig } from "@/utils/config/appConfig";
import data from "@iconify-icons/ep/edit";
import { useAppStoreHook } from "./app";

sessionStorage;
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
    isLoading: false,
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
        let res = await getLogin(query).catch((e) => {
          reject(e);
        });
        if (res && res.data) {
          let data = {
            ...res.data,
            accessToken: res.data.token,
            refreshToken: res.data.token,
            roles: ["admin"],
            expires: new Date(
              new Date().getTime() + 4 * 365 * 24 * 86400 * 1000
            ).getTime(),
          };
          this.options = data;
          this.isAdminFlag = res.data.adminFlag;
          setToken(data);
          localStorage.setItem("user-info", JSON.stringify(data));
          resolve(data);
          this.getOptions();
        }
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

    getLogOutBtn() {
      return btnMaker("登出", btnActionTemplate.Function, {
        elType: "danger",
        function: async (that, data) => {
          await post("/web/usc/logout", {});
          removeToken();
          storageLocal.clear();
          storageSession.clear();
          const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } =
            getConfig();
          useAppStoreHook().setLayout(Layout);
          useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
          toggleClass(Grey, "html-grey", document.querySelector("html"));
          toggleClass(Weak, "html-weakness", document.querySelector("html"));
          router.push(loginPage);
          useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
          resetRouter();
        },
      });
    },

    /** 获取用户详情 */
    async getOptions() {
      if (Object.keys(this.options).length == 0 && this.isLoading == false) {
        this.isLoading = true;
        let res = await get("/web/usc/user/select/loginUser", {});
        this.username = res.data.name;
        this.options = {
          ...res.data,
          accessToken: res.data.token,
          refreshToken: res.data.token,
          username: res.data.name,
          roles: ["admin"],
          expires: new Date(new Date().getTime() + 19999999).getTime(),
        };
      } else if (
        Object.keys(this.options).length == 0 &&
        this.isLoading == true
      ) {
        return await new Promise((r, j) => {
          setTimeout(() => {
            r(this.options);
          }, 3000);
        });
      }
      return this.options;
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
