/*
 * @Date: 2023-02-04 18:33:26
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-27 20:18:36
 * @FilePath: /configforpagedemo/src/store/modules/settings.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { setType } from "./types";
import { getConfig } from "@/utils/config/appConfig";

export const useSettingStore = defineStore({
  id: "pure-setting",
  state: (): setType => ({
    title: getConfig().Title,
    fixedHeader: getConfig().FixedHeader,
    hiddenSideBar: getConfig().HiddenSideBar,
  }),
  getters: {
    getTitle() {
      return this.title;
    },
    getFixedHeader() {
      return this.fixedHeader;
    },
    getHiddenSideBar() {
      return this.HiddenSideBar;
    },
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    },
  },
});

export function useSettingStoreHook() {
  return useSettingStore(store);
}
