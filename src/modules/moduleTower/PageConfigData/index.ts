/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-22 13:09:26
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/index.ts
 */
import { isValidKey } from "@/utils/index";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { MqttPageConfig } from "./main";
import { iotInfoList } from "./mqtt/admin/iotInfoList";


export const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 6,
    allPeopleCanSee: true,
  },
};
let pageConfig = {
  ...MqttPageConfig,
  IotInfoList:{
    ...base,
    name:'设备列表',
    desktopData: iotInfoList
  },
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
