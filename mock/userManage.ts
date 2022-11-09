/*
 * @Date: 2022-11-09 17:19:16
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-09 19:13:19
 * @FilePath: /configforpagedemo/mock/userManage.ts
 */
// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";


const unitCell = {
  id: "integer($int64)",
  createUserId: "integer($int64)",
  createTime: "integer($int64)",
  updateUserId: "integer($int64)",
  updateTime: "integer($int64)",
  orderNumber: "integer($int32)",
  top: "boolean",
  deleted: "boolean",
  name: "string",
  description: "string",
  parentId: "integer($int64)",
  parentIds: "string",
  parentNames: "string",
  regionId: "integer($int64)",
  zzdCode: "string",
}

const permissionRouter = {
  path: "/list",
  meta: {
    title: "权限管理",
    icon: "lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"],
        auths: ["btn_add", "btn_edit", "btn_delete"]
      }
    }
  ]
};

export default [
  {
    url: "/web/usc/unit/",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [permissionRouter]
      };
    }
  }
] as MockMethod[];
