/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-27 18:59:27
 * @FilePath: /configforpagedemo/src/store/modules/localStorage.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { stringAnyObj } from "@/modules/userManage/types";

interface localStorageStoreTemplate {
  data: stringAnyObj;
  keyLoadMap: {
    [key: string]: boolean;
  };
}

export const localStorageStore = defineStore({
  id: "module-info",
  state: (): localStorageStoreTemplate => ({
    data: {} as stringAnyObj,
    keyLoadMap: {},
  }),
  actions: {
    load(key) {},

    async get(key: string) {
      if (key in this.keyLoadMap) return this.data[key];
    },

    async set(key: string, value: stringAnyObj) {},
  },
});

export function useModuleHook() {
  return localStorageStore(store);
}
