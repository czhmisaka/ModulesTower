/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-28 12:43:00
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/mqtt/mqttDeviceList.ts
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
  addGridCell,
  removeGridCell,
} from "@/components/basicComponents/grid/module/cardApi/index";
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
  closeDrawerFormEasy,
  openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { list } from "postcss";
import { gridEditList } from "@/modules/main/PageConfigData/main";
import {
  eventCenterCell,
  eventTriggerType,
} from "@/modules/userManage/component/eventCenter/eventCenter";

export const mqttDeviceListDesktop = async (): Promise<gridCellTemplate[]> => {
  const 设备字段存储库 = new SearchCellStorage([
    tableCellTemplateMaker("clientId", "clientId"),
    tableCellTemplateMaker("createTime", "createTime"),
    tableCellTemplateMaker("icon", "icon"),
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("name", "name"),
    tableCellTemplateMaker("status", "status"),
    tableCellTemplateMaker("uniqueId", "uniqueId"),
    tableCellTemplateMaker("updateTime", "updateTime"),
  ]);
  const 编辑设备 = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Edit",
    function: async (that, data) => {
      let drawerProps = {
        title: "编辑",
        queryItemTemplate: 设备字段存储库.getByKeyArr(["name", "uniqueId"]),
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  });
  const 操作栏 = tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell([编辑设备], {})
  );
  设备字段存储库.push(操作栏);
  return [
    gridCellMaker(
      "mqttDeviceList",
      "搜索结果列表",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          modeChange: true,
          // isCard:true,
          searchItemTemplate: [],
          showItemTemplate: 设备字段存储库.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/admin/iot/device/searchByName", {
              ...query,
            });
            return {
              ...res.data,
              ...res.data.pagination,
            };
          },
          btnList: [],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(11, 8),
  ];
};

export const openDrawerforMqttDeviceListDesktop = async (that) => {
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
            name: "icon",
          },
          {
            isSettingTool: true,
            props: {
              name:'Close',
              onClickFunc: async ({ context, props }) => {
                removeGridCell(th,['openMqttDeviceList'])
                closeDrawerFormEasy(th)
              },
            },
          }
        )
          .setSize(1, 1)
          .setPosition(11, 0);
      };
      openDrawerFormEasy(that, {
        gridDesktop: true,
        size: 100,
        fullscreenGridDesktop: true,
        bgColor: "rgba(0,0,0,0);box-shadow:none;",
        gridDesktopConfig: {
          name: "开放平台应用管理界面-应用信息和管理界面",
          desktopData: async () => {
            return [...(await mqttDeviceListDesktop()), closeBtn(that)];
          },
          gridColNum: 12,
          cusStyle: {
            wholeScreen: true,
            Fullscreen: true,
            maxRows: 8,
            margin: 12,
          },
        },
      });
    },'openMqttDeviceList'
  );
  addGridCell(that, init);
};
