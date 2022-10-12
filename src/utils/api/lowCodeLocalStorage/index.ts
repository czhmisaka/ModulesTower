/*
 * @Date: 2022-09-03 20:00:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-12 08:39:23
 * @FilePath: /configforpagedemo/src/utils/api/lowCodeLocalStorage/index.ts
 */

import { get, post } from '@/utils/api/requests'


export const Api = {
    getTableList: '/getTableList',
    
} as { [key: string]: string }



export async function getTableList(): Promise<Array<{ tableName: string }>> {
    let back = [] as { tableName: string }[];
    let res = await get(Api.getTableList, {})
    console.log(res)
    return back
}





export default {

}