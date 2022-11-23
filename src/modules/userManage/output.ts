/*
 * @Date: 2022-10-26 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-23 15:51:08
 * @FilePath: /configforpagedemo/src/modules/userManage/output.ts
 */
export const moduleInfo = {
  name: "userManage",
  title: "用户管理",
  icon: "",
  info: "部门 人员 角色 权限管理",
  author: "czh",
};

import drawerForm from "./component/searchTable/drawerForm";

export const output = {
  module: {
    drawerForm,
  },

  CardApiInjectComponent: [],
};

// 模组打包配置
export const modulePackConfig = {};
