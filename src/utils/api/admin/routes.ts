/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-13 15:26:14
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
      data: module.nowModule.children || [],
    };
  } else {
    let data = [];
    let res = await post("/web/usc/menu/list/role", {});
    // res.data.map((x) => {
    //   data.push(dealAsyncMenuList(x));
    // });
    // data.filter(Boolean);
    module.init(res.data);
    return {
      data: module.nowModule.children || [],
    };
  }
};
