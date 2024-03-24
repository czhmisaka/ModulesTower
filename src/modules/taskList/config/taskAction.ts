/*
 * @Author: czh
 * @Date: 2021-04-22 19:20:11
 */

import { taskStatusTemplateMap } from "./taskDetail";

export const actionToIcon = {
  ADD: "el-icon-plus",
  RM: "el-icon-delete",
  DOWN: "el-icon-download",
  UP: "el-icon-upload2",
  AS: "el-icon-paperclip",
  FUCK: "el-icon-finished", // 任务完成
  EXPORT: "el-icon-upload",
};

function buttonActionMaker(
  name,
  nameEn,
  needDoubleCheck = false,
  type = "primary"
) {
  return {
    name,
    action: nameEn,
    icon: actionToIcon[nameEn],
    isDisable: false,
    type,
    needDoubleCheck,
  };
}

export const buttonActionlist = [
  buttonActionMaker("添加", "ADD"),
  buttonActionMaker("删除", "RM", true, "danger"),
  buttonActionMaker("向下移动", "DOWN"),
  buttonActionMaker("向上移动", "UP"),
  buttonActionMaker("添加状态", "AS"),
  buttonActionMaker("导出", "EXPORT"),
  buttonActionMaker("分析", "WDA", false, "success"),
  buttonActionMaker("分析", "ANALYSIS", false, "success"),
  buttonActionMaker("导入", "IMPORT", false, "info"),
];

export const commandList = {
  OPEN: {
    value: [" -- 打开指令 -- "].concat(
      Object.keys(actionToIcon).map((x) => {
        return " " + x;
      })
    ),
  },
  AS: {
    value: [" -- 改变状态 -- "].concat(
      Object.keys(taskStatusTemplateMap).map((x) => {
        return " [number] " + x + ` -- ${taskStatusTemplateMap[x].name} -- `;
      })
    ),
  },
  RM: {
    value: [" -- 删除任务 -- ", " [number] "],
  },
};

