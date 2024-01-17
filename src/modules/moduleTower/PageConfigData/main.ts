/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-13 10:46:15
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
  highLightComponent,
  changeCardProperties,
  changeVisible,
} from "@/components/basicComponents/grid/module/cardApi";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";
import {
  IotDeviceTemplate,
  iotCardGridCellMaker,
} from "../component/mqtt/iotCard";
import { openDrawerForIotCardServiceDesktop } from "../component/mqtt/iotServiceDesktop";
import {
  IotDeviceServiceType,
  iotServiceCardGridCellMaker,
} from "../component/mqtt/service/service";
import { IotDeviceCellGridDesktopType } from "../component/mqtt/iotGridCell/iotGridCell";

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
    iotDeviceInfoCard: {
      width: getXpx(200),
      height: getYpx(200),
    },
    iotDeviceInfoCard2: {
      width: getXpx(200),
      height: getYpx(200),
    },
    openMqttDeviceListBtn: {
      width: getXpx(120),
      height: getYpx(60),
    },
  };
};
const positionGetter = () => {
  const size = sizeGetter();
  return {
    iotDeviceInfoCard: {
      x:
        0.5 * wholeScreen.size.width -
        0.5 * size.openMqttDeviceListBtn.width -
        size.iotDeviceInfoCard.width,
      y: getYpx(100),
    },
    iotDeviceInfoCard2: {
      x:
        0.5 * wholeScreen.size.width -
        0.5 * size.openMqttDeviceListBtn.width -
        size.iotDeviceInfoCard.width * 2,
      y: getYpx(100),
    },
    openMqttDeviceListBtn: {
      x: 0.5 * wholeScreen.size.width - 0.5 * size.openMqttDeviceListBtn.width,
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
  const hoverFunc = {
    hoverInFunc: async (that, data) => {
      const { position, size } = JSON.parse(
        JSON.stringify(that.detail.gridInfo.default)
      );
      position.x =
        position.x + size.width + size.width > wholeScreen.size.width
          ? position.x - size.width
          : position.x + size.width;
      changeCardPosition(that, {
        iotServiceCard: {
          x: position.x,
          y: position.y,
        },
      });
      changeCardSize(that, {
        iotServiceCard: {
          width: size.width,
          height: size.height * 2,
        },
      });
      changeCardProperties(that, {
        iotServiceCard: {
          deviceInfo: data,
        },
      });
      highLightComponent(that, [that.detail.label, "iotServiceCard"]);
      changeVisible(that, {
        iotServiceCard: true,
      });
    },
    hoverOutFunc: async (that, data) => {
      highLightComponent(that, []);
      changeVisible(that, {
        iotServiceCard: false,
      });
    },
  };
  const iotDeviceInfoCard = iotCardGridCellMaker(
    "iotDeviceInfoCard",
    {
      nameEn: "Esp32c3",
      name: "测试用esp32",
      service: [
        IotDeviceServiceType.sendMsg,
        IotDeviceServiceType.getStreamData,
      ],
      description: "一张用于基础测试的esp32",
      gridCell: [
        {
          data: {
            props: {
              label: "LED",
            },
          },
          type: IotDeviceCellGridDesktopType.switchCard,
          sendKey: "testid1",
          gridInfo: {
            width: 1,
            height: 1,
            x: 4,
            y: 3,
          },
        },
      ],
    },
    {
      clickFunc: async (that, data) => {
        openDrawerForIotCardServiceDesktop(that, data);
      },
      ...hoverFunc,
    }
  )
    .setSize(
      sizeGetter().iotDeviceInfoCard.width,
      sizeGetter().iotDeviceInfoCard.height
    )
    .setPosition(
      positionGetter().iotDeviceInfoCard.x,
      positionGetter().iotDeviceInfoCard.y
    );

  // const iotDeviceInfoCard2 = iotCardGridCellMaker(
  //   "iotDeviceInfoCard2",
  //   {
  //     nameEn: "Esp32s3",
  //     name: "高性能Esp32-s3",
  //     service: [
  //       IotDeviceServiceType.sendMsg,
  //       IotDeviceServiceType.getStreamData,
  //     ],
  //     description: "一张用于高性能测试的Esp32-s3",
  //   },
  //   {
  //     ...hoverFunc,
  //   }
  // )
  //   .setSize(
  //     sizeGetter().iotDeviceInfoCard.width,
  //     sizeGetter().iotDeviceInfoCard.height
  //   )
  //   .setPosition(
  //     positionGetter().iotDeviceInfoCard2.x,
  //     positionGetter().iotDeviceInfoCard2.y
  //   );

  const iotServiceCardGridCell = iotServiceCardGridCellMaker(
    "iotServiceCard",
    {
      nameEn: "Esp32c3",
      name: "测试用esp32",
      service: [
        IotDeviceServiceType.sendMsg,
        IotDeviceServiceType.getStreamData,
      ],
      description: "一张用于基础测试的esp32",
    },
    false
  );

  return [
    gridCellMaker(
      "openMqttDeviceListBtn",
      "打开设备列表按钮",
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
      .setSize(
        sizeGetter().openMqttDeviceListBtn.width,
        sizeGetter().openMqttDeviceListBtn.height
      )
      .setPosition(
        positionGetter().openMqttDeviceListBtn.x,
        positionGetter().openMqttDeviceListBtn.y
      ),
    // iotDeviceInfoCard2,
    iotDeviceInfoCard,
    windowResize,
    iotServiceCardGridCell,
    ...gridEditList,
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
