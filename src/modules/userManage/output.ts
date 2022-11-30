/*
 * @Date: 2022-10-26 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-30 10:49:59
 * @FilePath: /configforpagedemo/src/modules/userManage/output.ts
 */
export const moduleInfo = {
  name: "userManage",
  title: "管理中心组件包",
  icon: "EL_Setting",
  info: "部门 人员 角色 权限管理",
  author: "czh & ljh",
};

import drawerForm from "@/modules/userManage/component/searchTable/drawerForm";

export const output = {
  moduleApi: {
    ...drawerForm.moduleApi,
  },
  CardApiInjectComponent: {
    ...drawerForm.component,
  },
};

// 模组打包配置
export const modulePackConfig = {};
