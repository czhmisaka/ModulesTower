/*
 * @Date: 2023-02-04 18:33:26
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-20 16:31:13
 * @FilePath: /lcdp_fe_setup/src/store/modules/settings.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { setType } from "./types";
import { getConfig } from "@/utils/config/appConfig";
import { useModuleHook } from "./module";

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
