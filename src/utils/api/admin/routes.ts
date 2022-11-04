/*
 * @Date: 2022-11-04 08:44:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-04 08:45:33
 * @FilePath: /configforpagedemo/src/utils/api/admin/routes.ts
 */
import { http } from "../../http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/getAsyncRoutes");
};
