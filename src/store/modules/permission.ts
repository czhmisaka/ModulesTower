/*
 * @Date: 2022-11-04 17:22:52
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-17 20:49:29
 * @FilePath: /ConfigForDesktopPage/src/store/modules/permission.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { cacheType } from "./types";
import { constantMenus } from "@/router";
import { ascending, filterTree, filterNoPermissionTree } from "@/router/utils";

let menuList = [];
export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 缓存页面keepAlive
    cachePageList: [],
  }),
  actions: {
    /** 组装整体路由生成的菜单 */
    async handleWholeMenus(routes: any[]) {
      this.wholeMenus = filterNoPermissionTree(
        filterTree(ascending(this.constantMenus.concat(routes)))
      );
    },
    cacheOperate({ mode, name }: cacheType) {
      switch (mode) {
        case "add":
          this.cachePageList.push(name);
          this.cachePageList = [...new Set(this.cachePageList)];
          break;
        case "delete":
          // eslint-disable-next-line no-case-declarations
          const delIndex = this.cachePageList.findIndex((v) => v === name);
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          break;
      }
    },
    /** 清空缓存页面 */
    clearAllCachePage() {
      this.wholeMenus = [];
      this.cachePageList = [];
    },
  },
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
