/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-29 17:08:41
 * @FilePath: /configforpagedemo/src/store/modules/loading.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { loadingType, userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import {
  UserResult,
  RefreshTokenResult,
  getLogin,
  refreshTokenApi,
  getMenuList,
} from "@/utils/api/admin/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";
import { stringAnyObj } from "@/modules/userManage/types";
import { menuInfoTemplate } from "@/components/menu/menuConfigTemplate";

import { ElLoading } from "element-plus";
let loadingInstance1 = null;
export const loadingStore = defineStore({
  id: "loadingStore",
  state: (): loadingType => ({
    fullScreenLoading: false,
  }),
  actions: {
    SET_FULLSCREENLOADING(value: boolean) {
      this.fullScreenLoading = value;
      if (!value) loadingInstance1.close();
      else loadingInstance1 = ElLoading.service({ fullscreen: true });
    },
    fullScreenloading(val) {
      console.log("asd", val);
      this.SET_FULLSCREENLOADING(val);
    },
  },
});

export function useLoading() {
  return loadingStore(store);
}
