/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-14 03:30:26
 * @FilePath: /configforpagedemo/src/utils/api/admin/routes.ts
 */
import { useModuleHook } from "@/store/modules/module";
import { http } from "../../http";
import { get, post } from "../requests";
const module = useModuleHook();

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
    module.init([]);
    return {
      // data: module.nowModule.children || [],
      data: [],
    };
  }
};
