/*
 * @Date: 2022-11-21 08:55:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-08 19:10:46
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
import { isShallow } from "vue";
import { useUserStoreHook } from "@/store/modules/user";

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
  apiList: string[] = [],
  showAbleKey: string = ""
): btnCellTemplate => {
  return {
    apiList,
    label,
    type,
    showAbleKey,
    isDisable: () => false,
    isLoading: false,
    ...options,
    isShow: (data: stringAnyObj, btn: btnCellTemplate) => {
      const { apiList, showAbleKey } = btn;
      let back = false;
      if (!btn.apiList || btn.apiList.length == 0)
        return options.isShow ? options.isShow(data) : true;
      const { nowLicense, nowShowAbleKey, userInfo } = useModuleHook();
      if (nowLicense && nowLicense.length > 0)
        back =
          apiList
            .map((x) => {
              return nowLicense.indexOf(x) == -1;
            })
            .filter(Boolean).length == 0;
      if (nowShowAbleKey && nowShowAbleKey.length > 0)
        back = nowShowAbleKey.indexOf(showAbleKey) != -1;
      if (userInfo.adminFlag) back = true;
      return back && options.isShow ? options.isShow(data) : back;
    },
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
