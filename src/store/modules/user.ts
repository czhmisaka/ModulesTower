/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-25 22:26:49
 * @FilePath: /ConfigForDesktopPage/src/store/modules/user.ts
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
import { useCacheHook } from "./cache";

sessionStorage;

useCacheHook().setup("loginUserInfo", async () => {
  // return await get("/web/usc/user/select/loginUser", {});
  return await get("/admin/base/comm/person", {});
});
interface userPageConfigData extends stringAnyObj {
  searchTableConfig: {
    [key: string]: {
      showItemTemplate: [];
      searchItemTemplate: [];
    };
  };
}

useCacheHook().setup("pageConfigForUser", async () => {
  let string = await get("/admin/base/sys/user/getPageConfig", {});
  if (string.data == "") return {};
  else return JSON.parse(string.data || "{}");
});

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
            roles: ["admin"],
          };
          this.options = data;
          this.isAdminFlag = true;
          setToken(data);
          localStorage.setItem("user-info", JSON.stringify(data));
          resolve(data);
          this.getOptions();
        }
      });
    },

    /** 前端登出（不调用接口） */
    async logOut() {
      this.username = "";
      this.roles = [];
      this.menuList = [];
      await post("/admin/base/comm/logout", {});
      removeToken();
      storageLocal.clear();
      storageSession.clear();
      const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
      useAppStoreHook().setLayout(Layout);
      useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
      toggleClass(Grey, "html-grey", document.querySelector("html"));
      toggleClass(Weak, "html-weakness", document.querySelector("html"));
      router.push(loginPage);
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
    },

    getLogOutBtn() {
      return btnMaker("登出", btnActionTemplate.Function, {
        elType: "danger",
        function: async (that, data) => {
          await this.logOut();
        },
      });
    },

    /** 获取用户详情 */
    async getOptions() {
      let res = await useCacheHook().getDataByKey("loginUserInfo");
      this.username = res?.data?.name;
      this.options = {
        ...res?.data,
        accessToken: res?.data?.token,
        refreshToken: res?.data?.token,
        username: res?.data?.name,
        roles: ["admin"],
        expires: new Date(new Date().getTime() + 19999999).getTime(),
      };
      return this.options;
    },

    async getPageConfig(compName: string) {
      const menuId = localStorage.getItem("menuId");
      let config = await useCacheHook().getDataByKey("pageConfigForUser");
      console.log(config, "configasd");
      return !compName && config
        ? config
        : !config[compName]
        ? {}
        : !config[compName][menuId]
        ? {}
        : config[compName][menuId];
    },

    async clearPageConfig() {},
    async setPageConfig(
      compKey,
      configData,
      menuId = localStorage.getItem("menuId") as string
    ) {
      let config = await this.getPageConfig();
      console.log("修改时获取到的config", config, config[compKey]);
      if (!config[compKey]) {
        config[compKey] = {};
      }
      config[compKey][menuId] = configData;
      let res = await post("/admin/base/sys/user/setPageConfig", {
        config: JSON.stringify(config),
      });
      useCacheHook().setRefresh("pageConfigForUser");
      return res;
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
