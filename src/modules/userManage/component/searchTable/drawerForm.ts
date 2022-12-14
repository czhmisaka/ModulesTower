/*
 * @Date: 2022-11-21 08:55:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-13 15:11:24
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/drawerForm.ts
 */

export const OpenDrawerBtn = () => {};

import {
  checkContext,
  refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { cardOnChangeType } from "@/components/basicComponents/grid/module/dataTemplate";
import drawerFormVue from "@/modules/userManage/component/searchTable/drawerForm.vue";
import {
  stringAnyObj,
  drawerProps,
  closeType,
  btnActionTemplate,
  btnCellTemplate,
} from "@/modules/userManage/types";

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
    isShow?: (data: stringAnyObj) => boolean;
    isDisable?: (data: stringAnyObj) => boolean;
    drawerProps?: drawerProps;
    function?: (that: stringAnyObj, data?: stringAnyObj) => void;
    url?: string;
    icon?: string;
    elType?: "success" | "danger" | "primary" | "warning";
    [key: string]: any;
  }
): btnCellTemplate => {
  return {
    label,
    type,
    isShow: () => true,
    isDisable: () => false,
    isLoading: false,
    ...options,
  } as btnCellTemplate;
};

// 关闭按钮
export const closeBtn = btnMaker("结束", btnActionTemplate.Function, {
  icon: "Close",
  function: (that, data) => {
    if (that.close) that.close();
    else refreshDesktop(that);
  },
});

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
