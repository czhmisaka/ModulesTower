/*
 * @Date: 2023-12-29 14:20:13
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-07 22:24:05
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/service/service.ts
 */

import {
  gridCellMaker,
  cardComponentType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { IotDeviceTemplate } from "../iotCard";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import { markRaw } from "vue";
export enum IotDeviceServiceType {
  sendMsg = "sendMsg",
  getStreamData = "getStreamData",
}

export interface IotDeviceServiceCell {
  type: IotDeviceServiceType;
  data?: stringAnyObj;
  sendKey: string;
}

// 获取服务名称
export const serviceName = (type: IotDeviceServiceType) => {
  if (type === IotDeviceServiceType.sendMsg) return "发送信息";
  if (type === IotDeviceServiceType.getStreamData) return "获取流数据";
};

export const iotServiceCardGridCellMaker = (
  key = "iotServiceCard",
  deviceInfo: IotDeviceTemplate,
  isShow: boolean = true,
  options: stringAnyObj = {}
) => {
  return markRaw(
    gridCellMaker(
      key,
      key,
      {},
      {
        type: cardComponentType.componentList,
        name: "iotServiceCard",
      },
      {
        props: {
          deviceInfo,
          ...options,
        },
        showInGridDesktop: isShow,
      }
    )
  );  
};
