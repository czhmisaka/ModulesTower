/*
 * @Date: 2023-12-29 14:20:13
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-29 15:53:06
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/service/service.ts
 */

import {
  gridCellMaker,
  cardComponentType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { IotDeviceTemplate } from "../iotCard";
import { stringAnyObj } from "@/modules/ApplicationManage/types";

export enum IotDeviceServiceType {
  sendMsg = "sendMsg",
  getStreamData = "getStreamData",
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
  return gridCellMaker(
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
  );
};
