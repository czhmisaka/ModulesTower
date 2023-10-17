/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-16 21:11:16
 * @FilePath: /ConfigForDesktopPage/src/modules/ApplicationManage/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
  addGridCell,
  removeGridCell,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { menuCellMaker } from "@/components/menu/menuConfigTemplate";
import {
  sideMenuCellListMaker,
  sideMenuCellMaker,
} from "../component/sideMenu/menuCell";
import { iconType } from "@/modules/userManage/types";
import { ApplicationInfoTemplate, stringAnyObj } from "../types";
import {
  menuCellActionTemplate,
  menuCellOptions,
  menuCellTemplate,
} from "../component/sideMenu/menuCell/types";
import { useRoute, useRouter } from "vue-router";
import { appInfo } from "./applicationSettingPage/appInfo";
import {
  eventCenterCell,
  eventTriggerType,
} from "@/modules/userManage/component/eventCenter/eventCenter";
import { post } from "@/utils/api/requests";
import { gridCellTemplate } from "../../../components/basicComponents/grid/module/dataTemplate";
import router from "@/modules/userManage/router";
import path from "path";
import { appDevConfig } from "./applicationSettingPage/appDevConfig";

export const mainBoardSizeAndPosition = {
  size: {
    width: 192 - 32,
    height: 108 - 8,
  },
  position: {
    x: 31,
    y: 7,
  },
};

function menuMaker(
  name,
  icon: iconType = "Document",
  options: menuCellOptions = {},
  type: menuCellActionTemplate = menuCellActionTemplate.RouterPush
) {
  return sideMenuCellMaker(name, name, icon, options, type);
}

// 切换页面时间不需要隐藏的组件
// 用于cardApi 控制
export const alwaysInGridCellComponent = {
  sideMenu: true,
  headerBar: true,
  applicationHeaderBar: true,
};
export const showMenu = (that) => {
  changeVisible(that, alwaysInGridCellComponent);
};

export const getQuery = (): { [key: string]: any } => {
  const query = {};
  new URL(window.location.href).hash
    .split("?")[1]
    .split("&")
    .map((x) => {
      const list = x.split("=");
      if (list.length === 2) {
        query[list[0]] = list[1];
      }
    });
  return {
    ...query,
  };
};

export const checkToMenu = (path) => {
  const href = `${new URL(window.location.href).hash.split("?")[0]}?${new URL(
    window.location.href
  ).hash
    .split("?")[1]
    .split("&")
    .map((x) => {
      if (x.split("=")[0] == "menu") {
        return "menu=" + path;
      } else return x;
    })
    .join("&")}${getQuery()["menu"] ? "" : `&menu=${path}`}`;
  window.history.replaceState({}, "", href);
};

/**
 * @name: getMainBoard
 * @description: 获取当前页面应该载入的组件
 * @authors: CZH
 * @Date: 2023-10-11 14:22:15
 * @param {stringAnyObj} query
 */
export const getMainBoard = async (
  app: ApplicationInfoTemplate = {},
  query: { [key: string]: any } = getQuery()
): Promise<gridCellTemplate[]> => {
  let gridCellList = [] as gridCellTemplate[];
  switch (decodeURI(query.menu)) {
    case "应用信息":
      gridCellList = await appInfo(app);
      break;
    case "开发配置":
      gridCellList = await appDevConfig(app);
      break;
    case "菜单管理":
      break;
  }
  return gridCellList;
};

const init = eventCenterCell(
  eventTriggerType.onMounted,
  async (that, baseData) => {
    let res = await post("/web/app/select", { id: getQuery().appId });
    let data = res.data as ApplicationInfoTemplate;
    const mainBoard = await getMainBoard(data);
    mainBoard.map((x: gridCellTemplate) => {
      addGridCell(that, x);
    });
  },
  "init"
);

export const mainDesktop = async () => {
  return [
    gridCellMaker(
      "sideMenu",
      "侧边菜单",
      {},
      {
        type: cardComponentType.componentList,
        name: "ApplicationManage_sideMenu",
      },
      {
        isSettingTool: false,
        props: {
          clickFunc: async (that, menu: menuCellTemplate) => {
            removeGridCell(that, ["init", "mainBoard"]);
            checkToMenu(menu.key);
            setTimeout(() => {
              addGridCell(that, init);
            }, 500);
          },
          menuCellList: [
            menuMaker("应用信息", "Document"),
            menuMaker(
              "应用权限",
              "User",
              {
                function: async (that, data) => {
                  console.log(that, data);
                },
              },
              menuCellActionTemplate.Function
            ),
            sideMenuCellListMaker("应用开发", "EditPen", [
              menuMaker("开发配置"),
              menuMaker("部门与成员"),
              menuMaker("角色管理"),
              menuMaker("菜单管理"),
              // menuMaker("字典管理"),
            ]),
            menuMaker("页面管理", "Monitor"),
            menuMaker("管理员权限", "UserFilled"),
          ],
        },
      }
    )
      .setPosition(0, 0)
      .setSize(30, 108),
    // gridCellMaker(
    //   "headerBar",
    //   "头部导航",
    //   {},
    //   {
    //     type: cardComponentType.componentList,
    //     name: "ApplicationManage_headerBar",
    //   },
    //   {
    //     props: {},
    //   }
    // )
    //   .setPosition(0, 0)
    //   .setSize(192, 5),
    gridCellMaker(
      "applicationHeaderBar",
      "应用信息展示条",
      {},
      {
        type: cardComponentType.componentList,
        name: "ApplicationManage_applicationHeaderBar",
      },
      {
        props: {},
      }
    )
      .setPosition(30, 0)
      .setSize(162, 6),
    init,
  ] as gridCellTemplate[];
};
