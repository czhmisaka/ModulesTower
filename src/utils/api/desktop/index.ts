/*
 * @Date: 2022-09-03 20:00:58
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-01 11:13:38
 * @FilePath: /configforpagedemo/src/utils/api/desktop/index.ts
 */

import { get, post } from "@/utils/api/requests";

export const Api = {
  getTableList: "/desktop/upload",
} as { [key: string]: string };

export async function getTableList(): Promise<Array<{ tableName: string }>> {
  let back = [] as { tableName: string }[];
  let res = await get(Api.getTableList, {});
  return back;
}

export default {};
