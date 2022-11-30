/*
 * @Date: 2022-11-21 08:55:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-30 10:50:22
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/drawerForm.ts
 */

export const OpenDrawerBtn = () => {};

import { checkContext } from "@/components/basicComponents/grid/module/cardApi";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { cardOnChangeType } from "@/components/basicComponents/grid/module/dataTemplate";
import drawerFormVue from "@/modules/userManage/component/searchTable/drawerForm.vue";

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

import { tableCellOptions } from "./searchTable";

/**
 * @name: drawerProps
 * @description: 弹窗属性事件
 * @authors: CZH
 * @Date: 2022-11-23 22:49:56
 */
export interface drawerProps {
  title: string;
  queryItemTemplate: tableCellOptions[];
  btnList: btnCellTemplate[];
  data?: stringAnyObj;
  noEdit?: boolean;
}

/**
 * @name: btnCellTemplate
 * @description: 按钮对象
 * @authors: CZH
 * @Date: 2022-11-23 22:50:42
 */
export interface btnCellTemplate extends stringAnyObj {
  label: string;
  type: btnActionTemplate;
  icon?: "";
  elType?: "";
  drawerDetail?: drawerProps;
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
    drawerProps?: drawerProps;
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
export const openDrawerForm = (
  content: { [key: string]: any },
  value: drawerProps
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {};
    data[moduleName + drawerFormVue.name] = value;
    content[func]("onChange", data, {
      type: [cardOnChangeType.moduleApi],
    });
  } catch (err) {
    console.error("openDrawerForm_数据上报错误:", err, content, value);
  }
};

let component = {};
let moduleName = "userManage_";
component[drawerFormVue.name] = drawerFormVue;

export default {
  moduleApi: {
    btnMaker,
    btnActionTemplate,
    openDrawerForm,
  },
  component,
};
