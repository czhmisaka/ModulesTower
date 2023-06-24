/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-25 01:40:08
 * @FilePath: /ConfigForDesktopPage/src/store/modules/cart.ts
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
import { get, piwigoMethod } from "@/utils/api/requests";
import { post } from "@/utils/api/requests";
import { useUserStoreHook } from "./user";
import { ElMessage } from "element-plus";

let licenseMap = {};
let showAbleKeyMap = {};

interface pageCellTemplate extends stringAnyObj {
  name?: string;
  id?: string;
  meta?: routerMeta;
}

interface remoteDictTemplate {
  image_id: string[];
  count: number;
}

export const cartStore = defineStore({
  id: "cart",
  state: (): remoteDictTemplate => ({
    image_id: [],
    count: 0,
  }),
  actions: {
    // 获取暂存区
    async getCart() {
      const options = await useUserStoreHook().getOptions();
      let res = await post("/my/picture", { user_id: options.id });
      this.count = res.data.length;
      this.image_id = res.data.map((x) => x.image_id);
    },

    // 获取暂存区域的图片列表
    async getCartImage(offset = 0, limit = 100) {
      await this.getCart();
      const options = await useUserStoreHook().getOptions();
      let image_id = JSON.parse(JSON.stringify(this.image_id));
      const res = await post("/my/picture/images", {
        user_id: options.id,
        image_id,
        offset,
        limit,
      });
      return res;
    },

    // 删除暂存区图片
    async deleteCart(data: string[] = []) {
      const options = await useUserStoreHook().getOptions();
      const res = await post("/my/picture/delete", {
        user_id: options.id,
        image_id: data,
      });
      await this.getCart();
      ElMessage.success("删除成功");
    },

    // 清空暂存区的所有图片
    async clearCart() {
      const options = await useUserStoreHook().getOptions();
      let res = await post("/my/picture/clear", { user_id: options.id });
      await this.getCart();
      ElMessage.success("清空成功");
    },

    // 添加图片到暂存区
    async setCart(data: string[] = []) {
      console.log(this.image_id);
      data = data.filter((x) => {
        if (this.image_id.indexOf(x) > -1) return false;
        else return true;
      });
      if (data.length == 0) return ElMessage.error("可存入图片数量为0");
      const options = await useUserStoreHook().getOptions();
      let res = await post("/my/picture/add", {
        user_id: options.id,
        image_id: data,
      });
      await this.getCart();
      ElMessage.success(`当前暂存图片数量【${this.count}】`);
    },
  },
});

export function useCartHook() {
  return cartStore(store);
}
