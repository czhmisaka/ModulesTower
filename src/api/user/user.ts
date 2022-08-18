/*
 * @Date: 2022-04-05 14:44:39
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-11 23:36:37
 * @FilePath: /configforpagedemo/src/api/user/user.ts
 */


import {  post } from '@/api/requests'

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



