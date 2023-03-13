/*
 * @Date: 2023-03-12 23:10:24
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-13 16:58:55
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/chosSearch.ts
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

// 图片信息操作列表
import { InfoCardBtnList } from "./InfoCardBtnList";
import { setData } from "../../../components/basicComponents/grid/module/cardApi/index";
import { dobuleCheckBtnMaker } from "../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";
import { SearchCellStorage } from "../../userManage/component/searchTable/searchTable";

const gridDesktop = {
  width: 24,
};

const elementKey = (
  props: { isBlack?: boolean; title: string; content?: string; img: string },
  size: { w: number; h: number },
  position: { x: number; y: number }
) => {
  return gridCellMaker(
    "image",
    "图片",
    {},
    {
      name: "elcard",
      type: cardComponentType.componentList,
    },
    {
      props: {
        isBlack: true,
        title: "壁纸",
        content: "--来自鬼刀大佬",
        img: "https://pic1.zhimg.com/80/v2-b8e48ee4c2efb2813c42c3778743a2c4_1440w.jpg",
        ...props,
      },
    }
  )
    .setSize(size.w, size.h)
    .setPosition(position.x, position.y);
};

// 计算桌面碰撞
export class Desktop {
  map = [] as boolean[][];
  constructor(x: number, y: number) {
    for (let i = 0; i < x; i++) {
      this.map.push([]);
      for (let c = 0; c < y; c++) {
        this.map[i].push(false);
      }
    }
  }

  async initByGridList(gridList: gridCellTemplate[]) {
    if (!gridList) return false;
    for (let i = 0; i < gridList.length; i++) {
      const gridCell = gridList[i];
      const { x, y } = gridCell.gridInfo.default.position;
      const { width: w, height: h } = gridCell.gridInfo.default.size;
      this.set(x, y, w, h);
    }
    console.log(this.map, "asd");
  }

  async check(x, y, w, h) {
    if (x < 0 || y < 0 || w < 1 || h < 1) return false;
    if (this.map.length < x + w) return false;
    if (this.map[0].length < y + h) return false;
    let canSet = true;
    for (x; x < x + w; x++) {
      for (y; y < y + h; y++) {
        if (this.get(x, y)) {
          canSet = false;
          break;
        }
      }
    }
    return canSet;
  }

  async set(x, y, w = 1, h = 1) {
    if (!this.check(x, y, w, h)) return false;
    for (x; x < x + w; x++) {
      for (y; y < y + h; y++) {
        this.map[x][y] = true;
      }
    }
  }

  async get(x, y) {
    return this.map[x][y];
  }

  async randomSet(list: { w: number; h: number; item: stringAnyObj }[]) {
    for (let i = 0; i < list.length; i++) {
      const { w, h, item } = list[i];
      let x = 0,
        y = 0;
      let rate = Math.floor(w / h);
    }
  }
}

export const chosSearch = async () => {
  const chosSearchFunc = async (that, query) => {
    let { result } = await piwigoMethod({
      method: "pwg.images.search",
      query: query,
      per_page: 50,
    });
    let list = result.images.map((x) => {
      return {
        ...x,
        ...x.derivatives,
        derivatives: null,
      };
    });

    let desktop = new Desktop(24, 16);
    console.log(desktop, that.gridList, that.gridList.length);
    // desktop.initByGridList(that.gridList);

    let interval = setInterval(() => {}, 100);
  };

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
          searchFunc: chosSearchFunc,
        },
      }
    )
      .setPosition(8, 2)
      .setSize(8, 1),
  ];
};
