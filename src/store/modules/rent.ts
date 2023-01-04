/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-04 09:29:51
 * @FilePath: /configforpagedemo/src/store/modules/rent.ts
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
} from "@/utils/api/admin/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";
import { stringAnyObj } from "@/modules/userManage/types";
import { menuInfoTemplate } from "@/components/menu/menuConfigTemplate";
import { ElLoading } from "element-plus";

interface rentCellTemplate extends stringAnyObj {
  name?: string;
  id?: string;
}

interface rentTemplate {
  nowRent: rentCellTemplate;
  rentList: rentCellTemplate[];
}

export const rentStore = defineStore({
  id: "rent",
  state: (): rentTemplate => ({
    rentList: [], 
    nowRent: {},
  }),
  actions: {},
});

export function useLoading() {
  return rentStore();
}
