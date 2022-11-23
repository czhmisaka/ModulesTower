/*
 * @Date: 2022-11-21 08:55:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-23 20:58:58
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/drawerForm.ts
 */

export const OpenDrawerBtn = () => {};

import drawerForm from "./drawerForm.vue";
export const drawerFormSon = drawerForm;

// 主要是懒得重复写了
export interface stringAnyObj {
  [key: string]: any;
}

/**
 * @name: btnCell
 * @description: 自定义事件按钮
 * @authors: CZH
 * @Date: 2022-11-21 17:11:45
 */
export enum btnActionTemplate {
  OpenDrawer = "OpenDrawer",
  Function = "Function",
  Url = "Url",
}
export interface btnCellTemplate extends stringAnyObj {
  label: string;
  type: btnActionTemplate;
  icon?: "";
  elType?: "";
  drawerDetail?: stringAnyObj;
  function?: (that: stringAnyObj) => void;
  url?: string;
}
/**
 * @name: btnMaker
 * @description: 自定义按钮生成函数
 * @authors: CZH
 * @Date: 2022-11-21 18:34:08
 */
export const btnMaker = (
  label: string,
  type: btnActionTemplate,
  options: {
    drawerProps?: stringAnyObj;
    function?: (that: stringAnyObj) => void;
    url?: string;
    icon?: string;
    elType?: string;
    [key: string]: any;
  }
): btnCellTemplate => {
  return {
    label,
    type,
    ...options,
  } as btnCellTemplate;
};

/**
 * @name: openDrawerForm
 * @description: moduleApi，BtnMaker 制作出来的按钮 响应drawerForm事件.
 * @authors: CZH
 * @Date: 2022-11-23 19:52:33
 */
export const openDrawerForm = (that) => {};

let component = {};
let moduleName = "userManage_";
component[drawerForm.name] = drawerForm;

export default {
  moduleApi: {
    btnMaker,
    btnActionTemplate,
    openDrawerForm,
  },
  component,
};
