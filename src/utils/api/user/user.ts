/*
 * @Date: 2022-04-05 14:44:39
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-27 23:18:20
 * @FilePath: /configforpagedemo/src/utils/api/user/user.ts
 */


import { post, get } from '@/utils/api/requests'

const modulePath = '/user/'

interface User {
    name?: string,
    email?: string,
    password?: string,
}


// 创建用户
export const CreateUser = async (data: User) => {
    let res = await post(`${modulePath}`, data)
    return res
}


// 获取所有用户信息
export const GetAllUser = async () => {
    let res = await get(`${modulePath}all`, {})
    return res.data
}



export default {
    CreateUser,
    GetAllUser
}

