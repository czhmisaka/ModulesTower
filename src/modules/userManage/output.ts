/*
 * @Date: 2022-10-26 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-22 12:43:18
 * @FilePath: /configforpagedemo/src/modules/userManage/output.ts
 */
export const moduleInfo = {
  name: "userManage",
  label: "用户管理模块",
  info: "部门 人员 角色 权限管理",
  author: "czh",
};

export const output = {
  cardApi: {},
  editCard:[
      {
          label:'权限编辑',
          component:()=>{}
      }
  ],
};

// 模组打包配置
export const modulePackConfig = {
  noDefaultRouter: false,
};

