/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-23 10:31:21
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  addGridCell,
  removeGridCell,
  changeCardPosition,
  highLightComponent,
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
  windowResizeChecker,
} from "@/modules/userManage/component/eventCenter/eventCenter";
import { post } from "@/utils/api/requests";
import { gridCellTemplate } from "../../../components/basicComponents/grid/module/dataTemplate";
import router from "@/modules/userManage/router";
import path from "path";
import { appDevConfig, 终端映射 } from "./applicationSettingPage/appDevConfig";
import { appMenuManage } from "./applicationSettingPage/appMenuManage";
import { appRoleManage } from "./applicationSettingPage/appRoleManage";
import { appAdminManageTemplate } from "./applicationSettingPage/appAdminManage";
import { appDepartmentAndMemberManage } from "./applicationSettingPage/appDepartmentAndMemberManage";
import { timeConsole } from "@/main";
import {
  changeCardProperties,
  changeCardSize,
} from "../../../components/basicComponents/grid/module/cardApi/index";

export const wholeScreen = {
  size: {
    width: 192,
    height: 108,
  },
};

export const mainBoardSizeAndPosition = () => {
  return {
    size: {
      width: wholeScreen.size.width - getXpx(220),
      height: wholeScreen.size.height - getYpx(60),
    },
    position: {
      // x: 30,
      x: getXpx(220),
      // y: 8,
      y: getYpx(60),
    },
  };
};

function menuMaker(
  name,
  icon: iconType = "Document",
  options: menuCellOptions = {},
  type: menuCellActionTemplate = menuCellActionTemplate.RouterPush
) {
  return sideMenuCellMaker(name, name, icon, options, type);
}

const menuCellList_集成 = [
  menuMaker("应用信息", "Document"),
  sideMenuCellListMaker("应用开发", "EditPen", [
    menuMaker("开发配置"),
    menuMaker("部门与成员"),
    menuMaker("角色管理"),
    menuMaker("菜单管理"),
  ]),
  // menuMaker("页面管理", "Monitor"),
  menuMaker("管理员权限", "UserFilled"),
];
const menuCellList_低代码 = [
  menuMaker("应用信息", "Document"),
  sideMenuCellListMaker("应用开发", "EditPen", [
    menuMaker("开发配置"),
    menuMaker("部门与成员"),
    menuMaker("角色管理"),
    menuMaker("菜单管理"),
  ]),
  menuMaker("页面管理", "Monitor"),
  menuMaker("管理员权限", "UserFilled"),
];

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

export const clearQuery = () => {
  window.history.replaceState({}, "", location.href.split("?")[0]);
};

export const getQuery = (): { [key: string]: any } => {
  const hash =
    new URL(window.location.href).hash.split("?").length > 1
      ? new URL(window.location.href).hash
      : new URL(window.location.href).hash + "?";
  const query = {};
  hash
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
  const hash =
    new URL(window.location.href).hash.split("?").length > 1
      ? new URL(window.location.href).hash
      : new URL(window.location.href).hash + "?";
  const href = `${new URL(window.location.href).hash.split("?")[0]}?${hash
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
      gridCellList = await appMenuManage(app);
      break;
    case "角色管理":
      gridCellList = await appRoleManage(app);
      break;
    case "管理员权限":
      gridCellList = await appAdminManageTemplate(app);
      break;
    case "部门与成员":
      gridCellList = await appDepartmentAndMemberManage(app);
      break;
  }
  return gridCellList;
};

function clearMainBoard(that, noNext = false) {
  const { gridList } = that;
  let needHidden = {};
  let needRemove = [];
  gridList.map((x) => {
    if (x.label.indexOf("mainBoard") > -1) {
      needHidden[x.label] = false;
      needRemove.push(x.label);
    }
  });
  if (needRemove.length > 0) changeVisible(that, needHidden);
  timeConsole.checkTime("测试1");
  setTimeout(() => {
    if (needRemove.length > 0) {
      removeGridCell(that, needRemove);
    }
    timeConsole.checkTime("测试1");
    setTimeout(() => {
      if (!noNext) addGridCell(that, init);
    }, 50);
  }, 10);
}

export function getXpx(vw) {
  return vw / (document.body.clientWidth / wholeScreen.size.width);
}
export function getYpx(vh) {
  return vh / (document.body.clientHeight / wholeScreen.size.height);
}

const init = eventCenterCell(
  eventTriggerType.onMounted,
  async (that, baseData) => {
    clearMainBoard(that, true);
    let res = await post("/web/app/select", { id: getQuery().appId });
    let data = res.data as ApplicationInfoTemplate;
    const linkObjArr = data.link ? (JSON.parse(data.link) as []) : [];
    data.linkType = linkObjArr.map((x) => x["linkType"]);
    linkObjArr.map((x) => {
      data[终端映射[x.linkType] + "_link"] = x.link;
    });
    data.groups = data.appGroupList.map((x) => x.id);
    changeCardProperties(that, {
      sideMenu: {
        menuCellList:
          data["type"] == 1 ? menuCellList_低代码 : menuCellList_集成,
      },
      applicationHeaderBar: {
        applicationInfo: data,
      },
    });
    const mainBoard = await getMainBoard(data);
    let needShow = {};
    mainBoard.map((x: gridCellTemplate) => {
      addGridCell(that, {
        ...x,
        options: { ...x.options, showInGridDesktop: false },
      });
      needShow[x.label] = true;
      setTimeout(() => {
        changeVisible(that, needShow);
      }, 20);
    });
  },
  "init"
);

let timeOut = null as any;
const windowResize = windowResizeChecker(async (that, baseData) => {
  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    changeCardSize(that, {
      sideMenu: {
        width: mainBoardSizeAndPosition().position.x,
        height: wholeScreen.size.height - mainBoardSizeAndPosition().position.y,
      },
      headerBar: {
        width: wholeScreen.size.width,
        height: mainBoardSizeAndPosition().position.y,
      },
      applicationHeaderBar: {
        width: mainBoardSizeAndPosition().position.x - getXpx(6) * 2,
        height: mainBoardSizeAndPosition().position.y - getYpx(6) * 2,
      },
    });
  }, 50);
  changeCardPosition(that, {
    applicationHeaderBar: {
      x: getXpx(6),
      y: getYpx(6),
    },
    sideMenu: {
      x: 0,
      y: mainBoardSizeAndPosition().position.y,
    },
  });
}, "windowResize");

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
        noAnimate: true,
        props: {
          color: "rgba(0,0,0,0.1)",
          clickFunc: async (that, menu: menuCellTemplate) => {
            removeGridCell(that, ["init"]);
            clearMainBoard(that);
            checkToMenu(menu.key);
          },
          menuCellList: menuCellList_集成,
        },
      }
    )
      .setPosition(0, mainBoardSizeAndPosition().position.y)
      .setSize(
        mainBoardSizeAndPosition().position.x,
        wholeScreen.size.height - mainBoardSizeAndPosition().position.y
      ),
    gridCellMaker(
      "headerBar",
      "导航栏",
      {},
      {
        type: cardComponentType.componentList,
        name: "ApplicationManage_headerBar",
      },
      {
        noAnimate: true,
        props: {},
      }
    )
      .setPosition(0, 0)
      .setSize(wholeScreen.size.width, mainBoardSizeAndPosition().position.y),

    gridCellMaker(
      "applicationHeaderBar",
      "应用信息展示条",
      {},
      {
        type: cardComponentType.componentList,
        name: "ApplicationManage_applicationHeaderBar",
      },
      {
        // noAnimate: false,
        props: {
          showType: "headerBar",
          // mouseenter: (that) => {
          //   highLightComponent(that, ["applicationHeaderBar"]);
          //   changeCardSize(that, {
          //     applicationHeaderBar: {
          //       width: getXpx(300),
          //       height: getYpx(200),
          //     },
          //   });
          //   setTimeout(() => {
          //     changeCardProperties(that, {
          //       applicationHeaderBar: {
          //         showType: "card",
          //       },
          //     });
          //   }, 0);
          // },
          // mouseleave: (that) => {
          //   highLightComponent(that, []);
          //   changeCardProperties(that, {
          //     applicationHeaderBar: {
          //       showType: "headerBar",
          //     },
          //   });
          //   changeCardSize(that, {
          //     applicationHeaderBar: {
          //       width: mainBoardSizeAndPosition().position.x - getXpx(6) * 2,
          //       height: mainBoardSizeAndPosition().position.y - getYpx(6) * 2,
          //     },
          //   });
          // },
        },
      }
    )
      .setPosition(getXpx(6), getYpx(6))
      .setSize(
        mainBoardSizeAndPosition().position.x - getXpx(6) * 2,
        mainBoardSizeAndPosition().position.y - getYpx(6) * 2
      ),
    windowResize,
    init,
  ] as gridCellTemplate[];
};
