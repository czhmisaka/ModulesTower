/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-19 14:11:43
 * @FilePath: /lcdp_fe_setup/src/utils/api/admin/routes.ts
 */
import { useModuleHook } from "@/store/modules/module";
import { http } from "../../http";
import { get, post } from "../requests";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = async (noRefresh: boolean = false) => {
  const module = useModuleHook();
  if (noRefresh) {
    return {
      data: module.nowModule.children || [],
    };
  } else {
    let data = [];
    let res = await post("/web/usc/menu/list/role", {});
    await module.init(res.data);
    return {
      data: module.nowModule.children || [],
    };
  }
};
