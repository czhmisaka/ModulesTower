/*
 * @Date: 2022-04-05 14:44:39
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-11 16:41:00
 * @FilePath: /configforpagedemo/src/utils/api/user/user.ts
 */


import {  post } from '@/utils/api/requests'

const mainPath = '/users/'

interface User{
    name?:string,
    email?:string,
    password?:string,
}


// 创建用户
export const CreateUser = async (data:User) => {
    let res = await post(`${mainPath}`, data)
    return res
}



