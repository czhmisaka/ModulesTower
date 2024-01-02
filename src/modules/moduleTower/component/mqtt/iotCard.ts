/*
 * @Date: 2023-12-29 12:45:14
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-02 09:33:31
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotCard.ts
 */

import {
  gridCellMaker,
  cardComponentType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import { IotDeviceServiceType } from "./service/service";

export enum IotDeviceCellGridDesktopType {
  infoCard,
  infoNumberCard,
  chartCard,
  sliderCard,
  buttonCard,
  switchCard,
  radioCard,
}

export interface IotDeviceGridDesktopCellTemplate {
  type: IotDeviceCellGridDesktopType;
  data: stringAnyObj;
  sendKey?: string;
  preKey?: string;
  getKey?: string;
  gridInfo?: {
    width: string;
    height: string;
    x: string;
    y: string;
  };
}

export interface IotDeviceTemplate {
  nameEn: string;
  name?: string;
  description?: string;
  service?: IotDeviceServiceType[];
  gridCell?: IotDeviceGridDesktopCellTemplate[];
}

export enum IotDeviceType {}

export interface IotDeviceCellOptionsTemplate {
  deviceInfo?: IotDeviceTemplate;
  isLoading?: boolean;
  hoverInFunc?: (
    that: stringAnyObj,
    data: IotDeviceTemplate
  ) => void | Promise<void>;
  hoverOutFunc?: (
    that: stringAnyObj,
    data: IotDeviceTemplate
  ) => void | Promise<void>;
  clickFunc?: (
    that: stringAnyObj,
    data: IotDeviceTemplate
  ) => void | Promise<void>;
}

export const iotCardGridCellMaker = (
  key = "iotDeviceInfoCard",
  deviceInfo: IotDeviceTemplate,
  options?: IotDeviceCellOptionsTemplate
) => {
  return gridCellMaker(
    key,
    key,
    {},
    {
      type: cardComponentType.componentList,
      name: "iotCard",
    },
    {
      props: {
        deviceInfo,
        ...options,
      },
    }
  );
};
