/*
 * @Date: 2022-11-21 08:55:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-28 19:46:42
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
  iconType,
} from "@/modules/userManage/types";
import { useModuleHook } from "@/store/modules/module";
import { isShallow } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";

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
    icon?: iconType;
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
  title: string,
  message: string,
  options: stringAnyObj = {}
) => {
  return new Promise((res, rej) => {
    ElMessageBox({
      title,
      message,
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      showCancelButton: true,
      callback: async (action) => {
        if (action == "confirm") {
          res(true);
        } else {
          rej(false);
        }
      },
      ...options,
    });
  });
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

/**
 * @name: repBackMessageShow
 * @description: 请求回调简易弹窗
 * @authors: CZH
 * @Date: 2023-02-09 10:46:52
 * @param {*} that
 * @param {*} res
 */
export const repBackMessageShow = (that, res) => {
  if (res["message"] == "成功") {
    that.$message.success(res["message"]);
    setTimeout(() => {
      that.close ? that.close() : refreshDesktop(that);
    }, 500);
  } else {
    that.$message.danger(res["message"]);
  }
};

/**
 * @name: openDrawerFormEasy
 * @description: 快速弹窗调用
 * @authors: CZH
 * @Date: 2023-02-09 10:54:24
 * @param {stringAnyObj} that
 * @param {drawerProps} drawerProps
 */
export const openDrawerFormEasy = (
  that: stringAnyObj,
  drawerProps: drawerProps
) => {
  that.$modules.getModuleApi()["userManage_openDrawerForm"](that, drawerProps);
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
