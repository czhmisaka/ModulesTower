/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-08 12:13:08
 * @FilePath: /ConfigForDesktopPage/src/modules/dailyTask/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { setSize } from "../../../components/basicComponents/grid/module/util";

const dailtList = [];

enum taskStatus {
  "等待开发" = "等待开发",
  "进行中" = "进行中",
  "挂起" = "挂起",
  "开发完成待验证" = "开发完成待验证",
  "完成" = "完成",
}

interface TaskTemplate {
  title: string;
  content: string;
  createTime: Date;
  statusList: {
    type: taskStatus;
    time: Date;
    user: string;
  }[];
}

export const taskMaker = (): TaskTemplate => {
  return {
    title: "一个随机的任务" + (Math.random() * 100).toFixed(0),
    content: "这是一个随机的任务描述",
    createTime: new Date(Math.random() * 1 * new Date().getTime()),
    statusList: [],
  };
};

export const dailyList = () => [];
