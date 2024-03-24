/*
 * @Date: 2022-10-26 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-23 20:45:49
 * @FilePath: /ConfigForDesktopPage/src/modules/taskList/output.ts
 */
export const moduleInfo = {
  name: "TaskList",
  title: "任务管理",
  icon: "EL_ElemeFilled",
  info: "一个任务管理模块",
  author: "czh",
};

import commandToolVue from "./component/commandTool/index.vue";

export const output = async () => {
  return {
    CardApiInjectComponent: {
      commandToolVue,
    },
  };
};

// 模组打包配置
export const modulePackConfig = {};
