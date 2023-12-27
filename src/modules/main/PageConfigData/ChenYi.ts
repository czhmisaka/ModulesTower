/*
 * @Date: 2022-10-06 23:41:41
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-27 21:13:16
 * @FilePath: /configforpagedemo/src/modules/main/PageConfigData/ChenYi.ts
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
} from "@/components/basicComponents/grid/module/cardApi/index";
import {
  setPosition,
  setSize,
} from "../../../components/basicComponents/grid/module/util";

import {
  infoTemplate,
  infoType,
} from "@/components/basicComponents/cell/info/DynamicIsland";

let fucker = false;
let fuckerMoon = false;
export const ChenYi = () =>
  [
    gridCellMaker(
      "elcard1",
      "卡片",
      {},
      {
        name: "elcard",
        type: cardComponentType.componentList,
      },
      {
        props: {
          isBlack: false,
          // content: '-- 来自浙江石浦',
          img: "/img/dada.jpeg",
        },
      }
    )
      .setPosition(0, 0.5)
      .setSize(4, 6.5),
  ] as gridCellTemplate[];
