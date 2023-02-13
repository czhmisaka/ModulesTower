/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-13 18:56:44
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
  id: "module-info",
  state: (): remoteDictTemplate => ({
    isLoadKeyList: [],
    keyMap: {},
  }),
  actions: {
    async loadKey(key): Promise<{ [key: string]: any }> {
      let res = await post("/web/usc/dict/get/key", { key });
      console.log(key, res, "asd");
      this.isLoadKeyList.push(key);
      let map = {};
      res.data.map((x) => {
        map[x.value] = x.name;
      });
      this.keyMap[key] = map;
      return this.keyMap[key];
    },
    async getByKey(key: string): Promise<{ [key: string]: any }> {
      //   if (this.isLoadKeyList.indexOf(key) != -1)
      //     return JSON.parse(JSON.stringify(this.keyMap[key]));
      //   else {
      return await this.loadKey([key]);
      //   }
    },
  },
});

export function useRemoteDictHook() {
  return remoteDictStore(store);
}
