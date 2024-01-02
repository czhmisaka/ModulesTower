/*
 * @Date: 2023-12-29 12:45:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-29 15:35:32
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotServiceDesktop.ts
 */

import {
  removeGridCell,
  addGridCell,
  changeCardSize,
  changeCardPosition,
} from "@/components/basicComponents/grid/module/cardApi";
import {
  gridCellMaker,
  cardComponentType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/ApplicationManage/types";
import {
  closeDrawerFormEasy,
  openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  eventCenterCell,
  eventTriggerType,
  windowResizeChecker,
} from "@/modules/userManage/component/eventCenter/eventCenter";
import { IotDeviceTemplate, iotCardGridCellMaker } from "./iotCard";
import { iotServiceCardGridCellMaker } from "./service/service";

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
    iotInfo: {
      width: getXpx(200),
      height: getYpx(200),
    },
    iotServiceCard: {
      width: getXpx(300),
      height: wholeScreen.size.height,
    },
    closeDesktop: {
      width: getXpx(60),
      height: getYpx(60),
    },
  };
};
const positionGetter = () => {
  return {
    iotInfo: {
      x: 0,
      y: 0,
    },
    iotServiceCard: {
      x: getXpx(200),
      y: 0,
    },
    closeDesktop: {
      x: wholeScreen.size.width - getXpx(60),
      y: 0,
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

export const iotCardServiceDesktop = async () => {
  return [] as gridCellTemplate[];
};

// Iot设备弹窗
export const openDrawerForIotCardServiceDesktop = async (
  that,
  IotCardInfo: IotDeviceTemplate
) => {
  // 构建IotCard
  const infoCardSize = sizeGetter().iotInfo;
  const infoCardPosition = positionGetter().iotInfo;
  const iotInfoCardGridCell = iotCardGridCellMaker("iotInfo", IotCardInfo)
    .setSize(infoCardSize.width, infoCardSize.height)
    .setPosition(infoCardPosition.x, infoCardPosition.y);

  // 构建IotServiceCard
  const iotServiceCardSize = sizeGetter().iotServiceCard;
  const iotServiceCardPosition = positionGetter().iotServiceCard;
  const iotServiceCardGridCell = iotServiceCardGridCellMaker(
    "iotServiceCard",
    IotCardInfo
  )
    .setSize(iotServiceCardSize.width, iotServiceCardSize.height)
    .setPosition(iotServiceCardPosition.x, iotServiceCardPosition.y);

  const init = eventCenterCell(
    eventTriggerType.onMounted,
    async (that, data) => {
      const closeBtn = (th) => {
        return gridCellMaker(
          "closeDesktop",
          "打开mqtt列表",
          {},
          {
            type: cardComponentType.componentList,
            name: "userManage_button",
          },
          {
            isSettingTool: true,
            props: {
              icon: "Close",
              onClickFunc: async ({ context, props }) => {
                removeGridCell(th, ["openMqttDeviceList"]);
                closeDrawerFormEasy(th);
              },
            },
          }
        )
          .setSize(
            sizeGetter().closeDesktop.width,
            sizeGetter().closeDesktop.height
          )
          .setPosition(
            positionGetter().closeDesktop.x,
            positionGetter().closeDesktop.y
          );
      };
      openDrawerFormEasy(that, {
        gridDesktop: true,
        size: 100,
        fullscreenGridDesktop: true,
        bgColor: "rgba(0,0,0,0);box-shadow:none;",
        gridDesktopConfig: {
          name: "开放平台应用管理界面-应用信息和管理界面",
          desktopData: async () => {
            return [
              iotInfoCardGridCell,
              iotServiceCardGridCell,
              ...(await iotCardServiceDesktop()),
              closeBtn(that),
              windowResize,
            ];
          },
          gridColNum: wholeScreen.size.width,
          cusStyle: {
            wholeScreen: true,
            Fullscreen: true,
            maxRows: wholeScreen.size.height,
            margin: 0,
          },
        },
      });
    },
    "openMqttDeviceList"
  );
  addGridCell(that, init);
};
