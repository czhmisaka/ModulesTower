/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-28 12:36:41
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
  highLightComponent
} from "@/components/basicComponents/grid/module/cardApi/index";
import {
  setSize,
  setPosition,
} from "../../../components/basicComponents/grid/module/util";
import {
  btnActionTemplate,
  drawerProps,
  stringAnyObj,
  tableCellTemplate,
} from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import {
  SearchCellStorage,
  actionCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnMaker,
  openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { list } from "postcss";
import { gridEditList } from "@/modules/main/PageConfigData/main";
import { mqttDeviceListDesktop, openDrawerforMqttDeviceListDesktop } from "./mqtt/mqttDeviceList";

export const mainDesktop = async (): Promise<gridCellTemplate[]> => {
  
  // 加载mqtt设备列表
  const mqttDeviceListGridCard = (await mqttDeviceListDesktop());
  mqttDeviceListGridCard.map((x)=>{
    x.options.showInGridDesktop = false
  })


  return [
    gridCellMaker(
      "openMqttDeviceList",
      "打开mqtt列表",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_button",
      },
      {
        isSettingTool: true,
        props: {
          type: "primary",
          label: "设备列表",
          icon: "",
          onClickFunc: async ({ context, props }) => {
            openDrawerforMqttDeviceListDesktop(context)
          },
        },
      }
    )
      .setSize(2, 1)
      .setPosition(0, 2),
    // ...gridEditList,
  ];
};
