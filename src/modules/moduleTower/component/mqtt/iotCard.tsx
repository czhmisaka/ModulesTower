/*
 * @Date: 2023-12-29 12:45:14
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-12 15:14:08
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotCard.tsx
 */

import {
  gridCellMaker,
  cardComponentType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import { IotDeviceServiceType } from "./service/service";
import { defineAsyncComponent, defineComponent, h, ref } from "vue";
import CardBgVue from "@/components/basicComponents/cell/card/cardBg.vue";
import { ElSwitch } from 'element-plus';
import { cusStyle } from '../../../userManage/types';
import { post } from "@/utils/api/requests";
import { IotDeviceCellGridDesktopType } from "./iotGridCell/iotGridCell";


export interface IotDeviceGridDesktopCellTemplate {
  type: IotDeviceCellGridDesktopType;
  data?: stringAnyObj;
  sendKey?: string;
  preKey?: string;
  getKey?: string;
  gridInfo?: {
    width: string | number;
    height: string | number;
    x: string | number;
    y: string | number;
  };
}



export interface IotDeviceTemplate {
  nameEn: string;
  name?: string;
  description?: string;
  service?: IotDeviceServiceType[];
  gridCell?: IotDeviceGridDesktopCellTemplate[];
}

export enum IotDeviceType { }

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
