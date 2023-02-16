/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-16 19:26:00
 * @FilePath: /configforpagedemo/src/store/modules/remoteDict.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { stringAnyObj } from "@/modules/userManage/types";
import { initRouter } from "@/router/utils";
import { useRouter } from "vue-router";

import {
  flatChildrenArr,
  getModuleFromView,
  modulesCellTemplate,
} from "@/router/util";
import { RouteConfigsTable, routerMeta } from "../../../types";
import { get } from "@/utils/api/requests";
import { post } from "@/utils/api/requests";

let licenseMap = {};
let showAbleKeyMap = {};

interface pageCellTemplate extends stringAnyObj {
  name?: string;
  id?: string;
  meta?: routerMeta;
}

interface remoteDictTemplate {
  isLoadKeyList: string[];
  keyMap: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

export const remoteDictStore = defineStore({
  id: "remote-dict",
  state: (): remoteDictTemplate => ({
    isLoadKeyList: [],
    keyMap: {},
  }),
  actions: {
    async loadKey(keys: string[]): Promise<void> {
      keys.map(async (key) => {
        this.isLoadKeyList.push(key);
        let res = await post("/web/usc/dict/get/key", { key });
        let map = {};
        res.data.dictDataList.map((x) => {
          map[x.value] = x.name;
        });
        this.keyMap[key] = map;
      });
    },

    async loadSignleKey(key: string): Promise<stringAnyObj> {
      this.isLoadKeyList.push(key);
      let res = await post("/web/usc/dict/get/key", { key });
      let map = {};
      res.data.dictDataList.map((x) => {
        map[x.value] = x.name;
      });
      this.keyMap[key] = map;
      return map;
    },

    waitForKey(key) {
      return new Promise((res, rej) => {
        const that = this;
        let num = 0;
        let interval = setInterval(() => {
          if (that.keyMap[key]) {
            clearInterval(interval);
            return res(that.keyMap[key]);
          } else if (num > 30) {
            clearInterval(interval);
          } else num++;
        }, 100);
      });
    },

    async getByKey(key: string): Promise<{ [key: string]: any }> {
      if (this.isLoadKeyList.indexOf(key) != -1)
        return await this.waitForKey(key);
      else {
        await this.loadSignleKey(key);
        return this.keyMap[key];
      }
    },
  },
});

export function useRemoteDictHook() {
  return remoteDictStore(store);
}
