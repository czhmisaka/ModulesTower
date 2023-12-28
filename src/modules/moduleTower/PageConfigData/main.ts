/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-28 14:08:44
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { gridEditList } from "@/modules/main/PageConfigData/main";
import {
  mqttDeviceListDesktop,
  openDrawerforMqttDeviceListDesktop,
} from "./mqtt/mqttDeviceList";
import {
  changeCardSize,
  changeCardPosition,
} from "@/components/basicComponents/grid/module/cardApi";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";

const wholeScreen = {
  size: {
    width: 12,
    height: 8,
  },
};
export function getXpx(vw) {
  return vw / (document.body.clientWidth / wholeScreen.size.width);
}
export function getYpx(vh) {
  return vh / (document.body.clientHeight / wholeScreen.size.height);
}

const sizeGetter = () => {
  return {
    openMqttDeviceListBtn: {
      width: getXpx(120),
      height: getYpx(60),
    },
  };
};
const positionGetter = () => {
  return {
    openMqttDeviceListBtn: {
      x: 0.5 * wholeScreen.size.width - 0.5 * getXpx(120),
      y: getYpx(100),
    },
  };
};

let timeOut = null as any;
const windowResize = windowResizeChecker(async (that, baseData) => {
  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    changeCardSize(that, sizeGetter());
    changeCardPosition(that, positionGetter());
  }, 50);
}, "windowResize");

export const mainDesktop = async (): Promise<gridCellTemplate[]> => {
  // 加载mqtt设备列表
  const mqttDeviceListGridCard = await mqttDeviceListDesktop();
  mqttDeviceListGridCard.map((x) => {
    x.options.showInGridDesktop = false;
  });
  return [
    gridCellMaker(
      "openMqttDeviceListBtn",
      "打开mqtt列表",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_button",
      },
      {
        isSettingTool: true,
        props: {
          type: "default",
          label: "设备列表",
          icon: "Grid",
          onClickFunc: async ({ context, props }) => {
            openDrawerforMqttDeviceListDesktop(context);
          },
        },
      }
    )
      .setSize(sizeGetter().openMqttDeviceListBtn.width,sizeGetter().openMqttDeviceListBtn.height)
      .setPosition(positionGetter().openMqttDeviceListBtn.x,positionGetter().openMqttDeviceListBtn.y),
    // ...gridEditList,
  ];
};

export const MqttPageConfig = {
  MAIN: {
    name: "MQTT设备列表",
    desktopData: mainDesktop,
    gridColNum: wholeScreen.size.width,
    cusStyle: {
      margin: 6,
      wholeScreen: true,
      maxRows: wholeScreen.size.height,
      Fullscreen: true,
    },
    menuId: "12",
  },
};
