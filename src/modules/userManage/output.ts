/*
 * @Date: 2022-10-26 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-23 16:55:49
 * @FilePath: /configforpagedemo/src/modules/userManage/output.ts
 */
export const moduleInfo = {
  name: "userManage",
  title: "管理中心组件包",
  icon: "setting",
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
