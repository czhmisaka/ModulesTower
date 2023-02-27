/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-27 22:36:59
 * @FilePath: /configforpagedemo/src/store/modules/module.ts
 */
import { defineStore } from "pinia";
import { store } from "@/store";
import { stringAnyObj } from "@/modules/userManage/types";
import { initRouter } from "@/router/utils";
import { useRouter } from "vue-router";

import {
  flatChildrenArr,
  getModuleFromView,
  modulesCellTemplate,
} from "@/router/util";
import { RouteConfigsTable, routerMeta } from "../../../types";
import { get } from "@/utils/api/requests";
import { useMultiTagsStoreHook } from "./multiTags";

let licenseMap = {};
let showAbleKeyMap = {};

interface pageCellTemplate extends stringAnyObj {
  name?: string;
  id?: string;
  meta?: routerMeta;
}

interface moduleTemplate {
  nowModule: pageCellTemplate;
  moduleList: pageCellTemplate[];
  nowPage: pageCellTemplate;
  pageList: pageCellTemplate[];
  routerBackup: RouteConfigsTable[];
  nowLicense: string[];
  nowShowAbleKey: string[];
  userInfo: {
    loginAdminFlag: boolean;
    [key: string]: any;
  };
  isLoading: boolean;
}

function getFatherNameList(list, id) {
  let nameList = [];
  let searchId = id;
  while (searchId > 0) {
    list.map((x) => {
      if (x.id == searchId) {
        nameList = [x.name].concat(nameList);
        searchId = x.parentId;
      }
    });
  }
  return nameList;
}

/**
 * @name: dealAsyncMenuList
 * @description: 处理异步路由
 * @authors: CZH
 * @Date: 2022-12-19 09:35:30
 */
function dealAsyncMenuList(cell, routerBackup, wholeCell) {
  // cell.type：1-模块，2-目录，3-菜单，4-按钮
  const wholeCellList = flatChildrenArr(wholeCell);
  // 排除按钮
  if (cell.type == 4) {
    const pageId = "page_" + cell.parentId;
    cell.urls.map((x) => {
      licenseMap[pageId]
        ? licenseMap[pageId].push(x)
        : (licenseMap[pageId] = [x]);
    });
    showAbleKeyMap[pageId]
      ? showAbleKeyMap[pageId].push(cell.key)
      : (showAbleKeyMap[pageId] = [cell.key]);

    return false;
  }

  // 判断是否需要处理子节点
  if (cell.children && cell.children.length > 0)
    cell.children = cell.children
      .map((x) => dealAsyncMenuList(x, routerBackup, wholeCell))
      .filter(Boolean)
      .sort((a, b) => a.orderNumber - b.orderNumber);

  // 检查目录下是否存在菜单,如果一个目录下没有菜单则移除
  if (cell.type == 2) {
    if (!cell.children || cell.children.length == 0) return false;
    const flatMenuArr = flatChildrenArr(cell.children).filter(
      (x) => x.type == 3
    );
    if (!flatMenuArr || flatMenuArr.length == 0) return false;
  }

  // 检查模块下是否存在拥有菜单的目录，如不存在则移除整个模块
  if (cell.type == 1) {
    if (!cell.children || cell.children.length == 0) return false;
    const flatIndexMenuArr = flatChildrenArr(cell.children).filter(
      (x) => x.type == 3
    );
    if (!flatIndexMenuArr || flatIndexMenuArr.length == 0) return false;
  }

  if (cell.type == 3) {
    if (cell.children && cell.children.length == 0) {
      delete cell.children;
    }
  }

  // 补充meta
  if (!cell.meta || typeof cell.meta != "object") {
    let meta = {
      title: cell.name,
      icon: cell.icon,
      menuId: cell.id,
    };
    cell.meta = meta;
  }

  // 补充path
  if (cell.urls && cell.urls.length > 0) {
    cell["path"] = cell.urls[0];
    if (cell.type == 3) {
      for (let i = 0; i < routerBackup.length; i++) {
        if (routerBackup[i].path == cell.path) {
          // 获取目标路由
          let backup = routerBackup[i];

          // 补充基本信息
          let nameList = getFatherNameList(wholeCellList, cell.parentId);
          cell.component = backup.component;
          cell.path = "/" + nameList.join("/") + "/" + cell.name;

          cell.meta = {
            ...backup.meta,
            ...cell.meta,
            PageName: cell.urls[0],
            showLink: cell.showLink,
          };
          break;
        }
      }
    }
  } else {
    cell["path"] = "/" + cell.name;
  }
  return cell;
}

export const moduleStore = defineStore({
  id: "module-info",
  state: (): moduleTemplate => ({
    moduleList: [],
    pageList: [],
    routerBackup: [],

    nowModule: {},
    nowPage: {},
    nowLicense: [],
    nowShowAbleKey: [],
    userInfo: {
      loginAdminFlag: false,
    },
    isLoading: false,
  }),
  actions: {
    init(resData) {
      this.isLoading = false;
      let moduleList = [];
      get("/web/usc/user/select/loginUser", {}).then((res) => {
        this.userInfo = res.data;
      });

      // 注入各个模块的展示界面
      this.initRouterBackup();

      // 预处理
      resData.map((x) => {
        moduleList.push(dealAsyncMenuList(x, this.routerBackup, resData));
      });

      this.moduleList = moduleList
        .filter(Boolean)
        .sort((a, b) => a.orderNumber - b.orderNumber);

      // 默认加载第一个模块
      if (this.moduleList.length > 0) {
        this.nowModule = this.moduleList[0];
      }
      this.isLoading = true;
    },

    checkWhichIsNowModule() {},

    initRouterBackup() {
      // 注入各个模块的展示界面
      const moduleList = getModuleFromView(true);
      let baseModuleRouterList = [] as RouteConfigsTable[];
      moduleList.map((module: modulesCellTemplate, index: number) => {
        module.routers.map((route: RouteConfigsTable, i: number) => {
          route.children
            ? route.children.map((cell: RouteConfigsTable) => {
                baseModuleRouterList.push(cell);
              })
            : baseModuleRouterList.push(route);
        });
      });
      this.routerBackup = baseModuleRouterList;
    },

    // 切换moduleList
    async checkModule(number: number = 0, path = "/") {
      if (number > this.moduleList.length - 1)
        number = this.moduleList.length - 1;
      this.nowModule = this.moduleList[number];
      const { multiTags } = useMultiTagsStoreHook();
      if (multiTags && multiTags["length"] > 0) {
        setTimeout(() => {
          useMultiTagsStoreHook().handleTags("splice", "", {
            startIndex: 1,
            length: multiTags["length"],
          });
        }, 100);
      }
      console.log(path, "qweqwe");
      initRouter(true).then(async (router) => {
        if (router && path != "/") {
          if (
            router
              .getRoutes()
              .map((x) => x.path)
              .indexOf(path)
          ) {
            router.replace(
              router.getRoutes()[
                router
                  .getRoutes()
                  .map((x) => x.path)
                  .indexOf(path)
              ]
            );
          }
        } else {
          router.replace(this.nowModule.children[0].children[0]);
        }
      });
      return this.nowModule;
    },

    async searchToPage(pagePath: string) {
      let targetModuleIndex = -1;
      for (let i = 0; i < this.moduleList.length; i++) {
        const pageList = flatChildrenArr(this.moduleList[i].children);
        pageList.map((x) => {
          if (x.path == pagePath) {
            targetModuleIndex = i;
          }
        });
      }
      if (targetModuleIndex != -1)
        await this.checkModule(targetModuleIndex, pagePath);
      return;
    },

    // 切换路由需要记录
    checkPage(pageMeta: routerMeta) {
      this.nowPage.meta = pageMeta;
      this.nowLicense = licenseMap["page_" + pageMeta.menuId];
      this.nowShowAbleKey = showAbleKeyMap["page_" + pageMeta.menuId];
      localStorage.setItem("menuId", pageMeta.menuId);
    },
  },
});

export function useModuleHook() {
  return moduleStore(store);
}
