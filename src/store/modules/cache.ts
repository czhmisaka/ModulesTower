/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-23 11:41:24
 * @FilePath: /ConfigForDesktopPage/src/store/modules/cache.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { stringAnyObj } from "@/modules/userManage/types";

enum loadStatus {
  isInit = "isInit",
  isLoading = "isLoading",
  success = "success",
  error = "error",
}

interface cacheStoreTemplate {
  data: stringAnyObj;
  keyLoadMap: {
    [key: string]: loadStatus;
  };
  dataLoadFuncMap: {
    [key: string]: () => Promise<stringAnyObj>;
  };
  isDevKey: string[];
}

export const cacheStore = defineStore({
  id: "cache",
  state: (): cacheStoreTemplate => ({
    data: {} as stringAnyObj,
    keyLoadMap: {},
    dataLoadFuncMap: {},
    isDevKey: [],
  }),
  actions: {
    isInCache(key) {
      if (this.keyLoadMap[key] && this.dataLoadFuncMap[key]) return true;
      else return false;
    },

    // 提示若已有数据应当刷新
    setRefresh(key) {
      if (this.isInCache(key)) this.keyLoadMap[key] = loadStatus.isInit;
    },

    // 注册需要缓存的数据和key
    async setup(key, func, needInit = false, pushIsDevKey = false) {
      this.data[key] = null;
      this.dataLoadFuncMap[key] = func;
      this.keyLoadMap[key] = loadStatus.isInit;
      if (needInit) return this.getDataByKey(key);
      if (this.isDevKey.indexOf(key) != -1)
        console.log(
          `当前已经保存的所有key:【${Object.keys(this.keyLoadMap).join(
            "】、【"
          )}】`
        );
      if (pushIsDevKey) this.isDevKey.push(key);
    },

    // 获取数据，若数据不存在则调用load func
    async getDataByKey(key) {
      // 未注册的key则直接失效
      if (key in this.keyLoadMap) {
        const status = this.keyLoadMap[key];
        // 尚未加载
        if (status == loadStatus.isInit) return await this.refresh(key);
        // 加载中
        if (status == loadStatus.isLoading) return await this.waitKey(key);
        // 数据已缓存
        if (status == loadStatus.success) return this.data[key];
        // 缓存出错 // 可能超时等
        if (status == loadStatus.error) return null;
      } else return null;
    },

    // 等待数据获取
    waitKey(key) {
      let that = this;
      return new Promise((res, rej) => {
        let times = 0;
        let loadingInterval = setInterval(() => {
          const status = that.keyLoadMap[key];
          if (status == loadStatus.success) {
            clearInterval(loadingInterval);
            return res(that.data[key]);
          }
          if (times > 100) {
            clearInterval(loadingInterval);
            return rej(that.data[key]);
          }
          times++;
        }, 30);
      });
    },

    // 数据获取
    async refresh(key) {
      if (this.isDevKey.indexOf(key) != -1) console.log(`【${key}】加载中`);
      if (!this.dataLoadFuncMap[key]) {
        if (this.isDevKey.indexOf(key) != -1)
          console.error(`【${key}】尚未配置加载函数`);
        return null;
      }
      const status = this.keyLoadMap[key];
      if (this.keyLoadMap == loadStatus.isLoading)
        return await this.waitKey(key);
      try {
        this.keyLoadMap[key] = loadStatus.isLoading;
        const func = this.dataLoadFuncMap[key];
        let resData = await func();
        this.data[key] = resData;
        this.keyLoadMap[key] = loadStatus.success;
      } catch (e) {
        if (this.isDevKey.indexOf(key) != -1)
          console.error(`【${key}】加载报错`, e);
        this.keyLoadMap[key] = loadStatus.error;
      }
      return this.data[key];
    },

    // 清除key和data
    async clear(key) {},
  },
});

export function useCacheHook() {
  return cacheStore(store);
}
