/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-19 06:43:48
 * @FilePath: /ConfigForDesktopPage/src/utils/api/admin/routes.ts
 */
import { useModuleHook } from "@/store/modules/module";
import { http } from "../../http";
import { get, post } from "../requests";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = async (noRefresh: boolean = false) => {
  if (noRefresh) {
    return {
      // data: module.nowModule.children || [],
      data: [],
    };
  } else {
    let data = [];
    // let res = await post("/web/usc/menu/list/role", {});
    // res.data.map((x) => {
    //   data.push(dealAsyncMenuList(x));
    // });
    // data.filter(Boolean);
    const module = useModuleHook();
    await module.init([]);
    return {
      data: module.nowModule.children || [],
    };
  }
};
