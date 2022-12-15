/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-15 14:22:59
 * @FilePath: /configforpagedemo/src/utils/api/admin/routes.ts
 */
import { http } from "../../http";
import { get, post } from "../requests";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = async () => {
  // return http.request<Result>("get", "/getAsyncRoutes");
  // return await get("/getAsyncRoutes",{});
  return { data: [] };
  return await post("/web/usc/menu/list", {});
};
