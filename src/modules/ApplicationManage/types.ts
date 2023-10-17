/*
 * @Date: 2022-12-02 11:00:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-10 15:34:55
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/types.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";

export interface stringAnyObj {
  [key: string]: any;
}

export enum applicationType {
  "自建" = 1,
  "集成" = 2,
}

export enum applicationStatus {
  "未发布" = 1,
  "已发布" = 2,
}

/**
 * @name: ApplicationInfoTemplate
 * @description: 应用信息模板
 * @authors: CZH
 * @Date: 2023-10-10 14:08:09
 */
export interface ApplicationInfoTemplate extends stringAnyObj {
  appKey?: string;
  appSecret?: string;
  belongUnitId?: string;
  createTime?: Date;
  createUnitId?: string;
  createUserId?: string;
  deleted?: boolean;
  description?: string;
  group?: string;
  id?: string;
  name?: string;
  orderNumber?: number | string;
  published?: applicationStatus;
  top?: boolean;
  type?: applicationType;
  updateTime?: Date;
  updateUserId?: string;
  appGroupList?: [];
}

export default {};
