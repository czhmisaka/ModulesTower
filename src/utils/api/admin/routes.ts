/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-06 18:55:59
 * @FilePath: /configforpagedemo/src/utils/api/admin/routes.ts
 */
import { http } from "../../http";
import { get } from "../requests";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = async () => {
  // return http.request<Result>("get", "/getAsyncRoutes");
  // return await get("/getAsyncRoutes",{});
  return {
    data: [],
  };
};
