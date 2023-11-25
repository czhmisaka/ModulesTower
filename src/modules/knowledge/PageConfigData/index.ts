/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-20 14:22:18
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/PageConfigData/index.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";

import { desktopDataTemplate } from "@/modules/userManage/types";
// import { sjxx_事件信息_tabllCell } from "./eventList/SearchCell";
import { knowledgeHome } from "./home";
import { knowledgeConfig } from "./knowledgeConfig";
import { knowledgeList } from "./knowledgeList";
import { knowledgeLabel } from "./knowledgeLabel";
import { intelligentWriteHome } from "./intelligentWriteHome";
import { questionAnswer } from "./questionAnswer";
import { writeList } from "./writeList";
import { knowledgeNavigation } from "./knowledgeNavigation";
import { PageConfig as templatePage } from "./template";
import { roleBtnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
let pageConfig = {} as { [key: string]: desktopDataTemplate };
const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows:8,
    margin: 0.01,
  },
};
let Page = {
  ...templatePage,
  // 全部事件: {
  //   name: "全部事件",
  //   desktopData: eventList,
  //   ...base,
  // },
  知识模块首页: {
    name: "知识模块首页",
    desktopData: knowledgeHome,
    btnList: [],
    ...base,
  },
  知识模块列表: {
    name: "知识模块列表",
    desktopData: knowledgeList,
    btnList: [roleBtnMaker(["asdasd"], "编辑")],
    ...base,
  },
  知识专辑管理: {
    name: "知识专辑管理",
    desktopData: knowledgeConfig,
    ...base,
  },
  知识标签管理: {
    name: "知识标签管理",
    desktopData: knowledgeLabel,
    ...base,
  },
  智能写作首页: {
    name: "智能写作首页",
    desktopData: intelligentWriteHome,
    ...base,
  },
  智能问答: {
    name: "智能问答",
    desktopData: questionAnswer,
    ...base,
  },
  智能写作文档: {
    name: "智能写作文档",
    desktopData: writeList,
    ...base,
  },
  知识导航: {
    name: "知识导航",
    desktopData: knowledgeNavigation,
    gridColNum: 12,
    cusStyle: {
      wholeScreen: true,
      maxRows: 8,
      margin: 0.01,
      Fullscreen: true,
    },
  },
} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
