/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2024-02-11 23:16:44
 * @FilePath: /ConfigForDesktopPage/src/store/modules/cardStyleConfig.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { stringAnyObj } from "@/modules/userManage/types";
import { deviceDetection, useDark, useGlobal } from "@pureadmin/utils";
import { useUserStoreHook } from "./user";
import { useCacheHook } from "./cache";

interface cardStyle {
  borderRadius: number;
  filter: string;
  background: string;
  [key: string]: any;
}

interface defaultSizeType {
  hurge: number;
  large: number;
  normal: number;
  small: number;
  mini: number;
  none: number;
}
interface keys {
  borderRadius: "borderRadius";
  margin: "margin";
  shadow: "shadow";
  filter: "filter";
  cardBoxShadow: "cardBoxShadow";
  cardBoxBackDropFilter: "cardBoxBackDropFilter";
  cardBoxBackground: "cardBoxBackground";
}

interface cacheStoreTemplate extends stringAnyObj {
  card: cardStyle;
  cardDark: cardStyle;
  config: {
    [key in keyof keys]: defaultSizeType | stringAnyObj;
  };
  key: {
    [key in keyof keys]: keyof defaultSizeType | string | any;
  };
}

const baseSize = {
  hurge: 24,
  large: 12,
  normal: 6,
  small: 4,
  mini: 2,
  none: 0,
} as defaultSizeType;

export const cardStyleConfigStore = defineStore({
  id: "cardStyleConfig",
  state: (): cacheStoreTemplate => ({
    localStorageSaverKey: "cardStyleConfig",
    card: {
      borderRadius: 6,
      filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))",
      background: "rgba(255,255,255,1)",
    },
    cardDark: {
      borderRadius: 6,
      filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))",
      background: "rgba(60,60,60,.3)",
    },
    key: {
      borderRadius: "none",
      margin: "small",
      shadow: "small",
      filter: "small",
      cardBoxShadow: "small",
      cardBoxBackground: "white",
      cardBoxBackDropFilter: "none",
    },
    config: {
      cardBoxBackground: {},
      cardBoxBackDropFilter: {},
      cardBoxShadow: {
        large: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.1))",
        normal: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.1))",
        small: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))",
        none: "drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.0))",
      },
      filter: {
        normal: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))",
        none: "none",
      },
      shadow: {
        colorFul: "",
        normal: "0px 0px 5px rgba(0, 0, 0, 0.1)",
        small: "0px 0px 5px rgba(0, 0, 0, 0.05)",
        none: "none",
      },
      borderRadius: baseSize,
      margin: baseSize,
    },
  }),
  actions: {
    async webLoader() {
      if (!useCacheHook().isInCache(this.localStorageSaverKey))
        useCacheHook().setup(this.localStorageSaverKey, async () => {}, false);
    },

    async init() {
      const userinfo = await useUserStoreHook().getOptions();
      this.localStorageSaverKey = userinfo.id + "__cardStyleConfig";
      const data = localStorage.getItem(this.localStorageSaverKey);
      if (data) {
        try {
          const jd = JSON.parse(data);
          Object.keys(jd).map((x) => {
            this.key[x] = jd[x];
          });
        } catch (e) {
          console.error(`【样式数据载入失败】`, e);
          localStorage.setItem(this.localStorageSaverKey, null);
        }
      }
    },

    get(type: keyof keys) {
      return this.config[type][this.key[type]];
    },

    set(type: keyof keys, value: keyof defaultSizeType) {
      this.key[type] = value;
      localStorage.setItem(this.localStorageSaverKey, JSON.stringify(this.key));
    },
  },
});

export function useCardStyleConfigHook() {
  return cardStyleConfigStore(store);
}
