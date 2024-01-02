/*
 * @Date: 2023-10-11 16:19:26
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-30 21:29:21
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/eventCenter/eventCenter.ts
 */

import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "../../types";
import { setPosition } from "../../../../components/basicComponents/grid/module/util";

export enum eventTriggerType {
  "onMounted" = "onMounted",
  "onBaseDataChange" = "onBaseDataChange",
  "DataEvent" = "DataEvent",
  "windowResize" = "windowResize",
}

export const eventCenterCell = (
  type: eventTriggerType,
  event: (that: any, baseData: stringAnyObj) => Promise<any> | any,
  key: string = "eventCenter",
  options: stringAnyObj = {}
): gridCellTemplate => {
  return gridCellMaker(
    key,
    "事件中心",
    {},
    {
      type: cardComponentType.componentList,
      name: "userManage_eventCenter",
    },
    {
      props: {
        triggerType: type,
        event: event,
        ...options,
      },
    }
  )
    .setSize(0, 0)
    .setPosition(0, 0);
};

/**
 * @name: windowResizeChecker
 * @description: 输出
 * @authors: CZH
 * @Date: 2023-10-30 17:36:55
 */
export const windowResizeChecker = (
  event: any,
  key: string = "eventCenter",
  options: stringAnyObj = {}
): gridCellTemplate => {
  return gridCellMaker(
    key,
    "事件中心",
    {},
    {
      type: cardComponentType.componentList,
      name: "userManage_eventCenter",
    },
    {
      props: {
        triggerType: eventTriggerType.windowResize,
        event: event,
        ...options,
      },
    }
  )
    .setSize(0, 0)
    .setPosition(0, 0);
};
