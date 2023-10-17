/*
 * @Date: 2023-10-11 16:19:26
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-12 16:31:11
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/eventCenter/eventCenter.ts
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
}

export const eventCenterCell = (
  type: eventTriggerType,
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
        triggerType: type,
        event: event,
        ...options,
      },
    }
  )
    .setSize(0, 0)
    .setPosition(0, 0);
};
