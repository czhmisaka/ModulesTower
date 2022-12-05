/*
 * @Date: 2022-11-04 17:33:33
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-05 09:05:26
 * @FilePath: /configforpagedemo/mock/login.ts
 */

// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

export default [
  // {
  //   url: "/web/usc/login",
  //   method: "post",
  //   response: (req) => {
  //     console.log(req, "qwe");
  //     const {lcdp} = req.body;
  //     if (lcdp.username === "15700197842") {
  //       return {
  //         code: 200,
  //         success: true,
  //         data: {
  //           lcdp,
  //           username: "15700197842",
  //           roles: ["admin"],
  //           accessToken: "eyJhbGciOiJIUzUxMiJ9.admin",
  //           token: "eyJhbGciOiJIUzUxMiJ9.admin",
  //           refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
  //           expires: "2023/10/30 00:00:00",
  //         },
  //       };
  //     } else {
  //       return {
  //         success: true,
  //         data: {
  //           username: "common",
  //           roles: ["common"],
  //           accessToken: "eyJhbGciOiJIUzUxMiJ9.common",
  //           refreshToken: "eyJhbGciOiJIUzUxMiJ9.commonRefresh",
  //           expires: "2023/10/30 00:00:00",
  //         },
  //       };
  //     }
  //   },
  // },
] as MockMethod[];
