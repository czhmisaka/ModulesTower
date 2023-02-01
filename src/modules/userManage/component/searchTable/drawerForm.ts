/*
 * @Date: 2022-11-21 08:55:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-01 15:16:37
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
import { useModuleHook } from "@/store/modules/module";

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
  },
  apiList: string[] = []
): btnCellTemplate => {
  return {
    apiList,
    label,
    type,
    isShow: (data: stringAnyObj) => {
      if (!apiList) return true;
      const { nowLicense } = useModuleHook();
      console.log(
        nowLicense,
        "asd",
        apiList
          .map((x) => {
            return nowLicense.indexOf(x) == -1;
          })
          .filter(Boolean).length == 0
          ? options.isShow
            ? options.isShow(data)
            : true
          : false
      );
      return apiList
        .map((x) => {
          return nowLicense.indexOf(x) == -1;
        })
        .filter(Boolean).length == 0
        ? options.isShow
          ? options.isShow(data)
          : true
        : false;
    },
    isDisable: () => false,
    isLoading: false,
    ...options,
  } as btnCellTemplate;
};

/**
 * @name: dobuleCheckBtnMaker
 * @description: 二次确认按钮
 * @authors: CZH
 * @Date: 2022-12-14 14:56:27
 */
export const dobuleCheckBtnMaker = (
  label,
  options: {
    title: string;
    context: (that: stringAnyObj, data?: stringAnyObj) => void | string;
    function: (that: stringAnyObj, data?: stringAnyObj) => void;
  }
) => {};

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
