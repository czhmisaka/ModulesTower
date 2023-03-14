/*
 * @Date: 2023-03-12 23:10:24
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-14 10:26:48
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

// 图片信息操作列表
import { InfoCardBtnList } from "./InfoCardBtnList";
import { setData } from "../../../components/basicComponents/grid/module/cardApi/index";
import { dobuleCheckBtnMaker } from "../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";
import { SearchCellStorage } from "../../userManage/component/searchTable/searchTable";
import { collapseItemProps } from "element-plus";

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
  len_x = 0;
  len_y = 0;
  randomTryTime = 500;

  constructor(x: number, y: number) {
    for (let i = 0; i < x; i++) {
      this.map.push([]);
      for (let c = 0; c < y; c++) {
        this.map[i].push(false);
      }
    }
    this.len_x = x;
    this.len_y = y;
  }

  async initByGridList(gridList: gridCellTemplate[]) {
    if (!gridList) return false;
    for (let i = 0; i < gridList.length; i++) {
      const gridCell = gridList[i];
      const { x, y } = gridCell.gridInfo.default.position;
      const { width: w, height: h } = gridCell.gridInfo.default.size;
      this.set(x, y, w, h);
    }
  }

  check(x, y, w = 1, h = 1) {
    if (x < 0 || y < 0 || w < 1 || h < 1) return false;
    if (this.map.length < x + w - 1) return false;
    if (this.map[0].length < y + h - 1) return false;
    let canSet = true;
    for (let x1 = x; x1 < x + w; x1++) {
      for (let y1 = y; y1 < y + h; y1++) {
        if (this.get({ x: x1, y: y1 })) {
          canSet = false;
          break;
        }
      }
    }
    return canSet;
  }

  async set(x, y, w = 1, h = 1) {
    if (!this.check(x, y, w, h)) return false;
    for (let x1 = x; x1 < x + w; x1++) {
      for (let y1 = y; y1 < y + h; y1++) {
        this.map[x1][y1] = true;
      }
    }
  }

  get({ x, y }) {
    return this.map[x][y];
  }

  getRandomXy(width = 1, height = 1) {
    return {
      x: Math.floor(Math.random() * (this.len_x - width + 1)),
      y: Math.floor(Math.random() * (this.len_y - height + 1)),
    };
  }

  async randomSet(
    list: { w: number; h: number; data: stringAnyObj }[],
    callBack: (x, y, data) => void
  ) {
    for (let i = 0; i < list.length; i++) {
      const { w, h } = list[i];
      let scaleRate = Math.floor(Math.random() * 5);
      let width = (w > h ? Math.round(w / h) : 1) * scaleRate,
        height = (h > w ? Math.round(h / w) : 1) * scaleRate;
      // try random x first
      for (let time = 0; time < this.randomTryTime; time++) {
        let randomXy = this.getRandomXy(width, height);
        if (this.check(randomXy.x, randomXy.y, width, height)) {
          this.set(randomXy.x, randomXy.y, width, height);
          callBack(
            {
              w: width,
              h: height,
            },
            { x: randomXy.x, y: randomXy.y },
            list[i].data
          );
          break;
        }
      }
    }
  }
}

export const chosSearch = async () => {
  const chosSearchFunc = async (that, query) => {
    let { result } = await piwigoMethod({
      method: "pwg.images.search",
      query: query,
      per_page: 30,
    });
    let list = result.images.map((x) => {
      return {
        ...x,
        ...x.derivatives,
        derivatives: null,
      };
    });

    let desktop = new Desktop(24, 16);
    desktop.initByGridList(that.gridList);
    desktop.randomSet(
      list.map((x) => {
        return { w: x.width, h: x.height, data: x };
      }),
      (wh, xy, data) => {
        addGridCell(
          that,
          elementKey(
            {
              isBlack: false,
              title: "",
              content: "",
              img: data.element_url,
            },
            wh,
            xy
          )
        );
      }
    );
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
          searchFunc: (that, data) => {
            let time = 0;
            setTimeout(() => chosSearchFunc(that, data), 0);
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
            setTimeout(() => chosSearchFunc(that, data), (time += 1000));
          },
        },
      }
    )
      .setPosition(8, 4)
      .setSize(8, 1),
  ];
};

export const chosSearchForMobile = async () => {
  const chosSearchFunc = async (that, query) => {
    let { result } = await piwigoMethod({
      method: "pwg.images.search",
      query: query,
      per_page: 30,
    });
    let list = result.images.map((x) => {
      return {
        ...x,
        ...x.derivatives,
        derivatives: null,
      };
    });

    let desktop = new Desktop(4, 10);
    desktop.initByGridList(that.gridList);
    console.log(list);
    desktop.randomSet(
      list.map((x) => {
        return { w: x.width, h: x.height, data: x };
      }),
      (wh, xy, data) => {
        addGridCell(
          that,
          elementKey(
            {
              isBlack: false,
              title: "",
              content: "",
              img: data.element_url,
            },
            wh,
            xy
          )
        );
      }
    );
    console.log(desktop);
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
      .setPosition(0, 4)
      .setSize(4, 1),
  ];
};
