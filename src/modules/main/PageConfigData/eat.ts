/*
 * @Date: 2023-06-17 11:42:47
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-17 12:32:36
 * @FilePath: /ConfigForDesktopPage/src/modules/main/PageConfigData/eat.ts
 */
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

import {
  btnMaker,
  closeBtn,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
  addGridCell,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { get, piwigoMethod, post } from "@/utils/api/requests";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
import { xor } from "lodash";
import { openDrawerFormEasy } from "../../userManage/component/searchTable/drawerForm";
import { openDrawerForm } from "../../userManage/component/searchTable/drawerForm";
import { btnActionTemplate, drawerProps } from "@/modules/userManage/types";
import { tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { stringAnyObj } from "../../userManage/types";

function maker(name, num) {
  return gridCellMaker(
    "elcard" + num,
    "卡片",
    {},
    {
      name: "elcard",
      type: cardComponentType.componentList,
    },
    {
      props: {
        isBlack: false,
        title: name,
      },
    }
  )
    .setPosition(0, num)
    .setSize(7, 1);
}

export const eat = async () => {
  let mainList = [];
  return [
    gridCellMaker(
      "searchInfo",
      "输入框",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_searchInfoChosSearch",
      },
      {
        props: {
          btnName: "添加",
          searchFunc: (that, data) => {
            addGridCell(that, maker(data, mainList.length));
            mainList.push(data);
            data = "";
          },
        },
      }
    )
      .setPosition(0, 11)
      .setSize(6, 1),
    gridCellMaker(
      "随机",
      "打开组件菜单",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        isSettingTool: true,
        props: {
          name: "Search",
          onClickFunc: (content: any) => {
            console.log(content);
            function big(that, num, f = false) {
              let key = "elcard" + num;
              let data = {};
              data[key] = {
                width: 7,
                height: 1,
              };
              let data2 = {};
              data2[key] = {
                width: 8,
                height: 1,
              };
              changeCardSize(that, data2);
              if (!f)
                setTimeout(() => {
                  changeCardSize(that, data);
                }, 100);
            }
            let a = Math.random() * 40 + 20;
            let num = 0;
            let index = 100;
            let inter = setInterval(() => {
              num++;
              index += num * 10;
              if (num > a) {
                big(content.context, num % mainList.length, true);
                clearInterval(inter);
              } else {
                big(content.context, num % mainList.length);
              }
            }, index);
          },
        },
      }
    )
      .setPosition(6, 11)
      .setSize(2, 1),
  ] as gridCellTemplate[];
};
