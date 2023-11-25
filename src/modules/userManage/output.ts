/*
 * @Date: 2022-10-26 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-04 14:01:36
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/output.ts
 */
export const moduleInfo = {
  name: "userManage",
  title: "管理中心组件包",
  icon: "EL_Setting",
  info: "部门 人员 角色 权限管理",
  author: "czh",
};

import drawerForm from "@/modules/userManage/component/searchTable/drawerForm";
import licenseModuleApi from "@/modules/userManage/component/premission/licenseModuleApi";

export const output = {
  moduleApi: {
    ...drawerForm.moduleApi,
    ...licenseModuleApi.moduleApi,
  },
  CardApiInjectComponent: {
    ...drawerForm.component,
  },
  routerChecker: {},
};

// 模组打包配置
export const modulePackConfig = {};
