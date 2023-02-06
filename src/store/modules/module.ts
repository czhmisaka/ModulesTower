/*
 * @Date: 2022-11-03 22:30:18
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-06 20:27:19
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

let licenseMap = {};

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
}

/**
 * @name: dealAsyncMenuList
 * @description: 处理异步路由
 * @authors: CZH
 * @Date: 2022-12-19 09:35:30
 */
function dealAsyncMenuList(cell, routerBackup) {
  // cell.type：1-模块，2-目录，3-菜单，4-按钮

  // 排除按钮
  if (cell.type == 4) {
    cell.urls.map((x) => {
      const pageId = "page_" + cell.parentId;
      licenseMap[pageId]
        ? licenseMap[pageId].push(x)
        : (licenseMap[pageId] = [x]);
    });
    return false;
  }

  // 判断是否需要处理子节点
  if (cell.children && cell.children.length > 0)
    cell.children = cell.children
      .map((x) => dealAsyncMenuList(x, routerBackup))
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
          let backup = routerBackup[i];
          // 补充基本组件信息
          cell.component = backup.component;
          cell.meta = {
            ...backup.meta,
            ...cell.meta,
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
  }),
  actions: {
    init(resData) {
      let moduleList = [];

      // 注入各个模块的展示界面
      this.initRouterBackup();

      // 预处理
      resData.map((x) => {
        moduleList.push(dealAsyncMenuList(x, this.routerBackup));
      });

      this.moduleList = moduleList
        .filter(Boolean)
        .sort((a, b) => a.orderNumber - b.orderNumber);

      this.nowModule = this.moduleList[0];
      // this.nowModule = this.routerBackup;
    },

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
    checkModule(number: number = 0) {
      if (number > this.moduleList.length - 1)
        number = this.moduleList.length - 1;
      this.nowModule = this.moduleList[number];
      initRouter(true).then(() => {
        const router = useRouter();
        router.push("/");
        // router.push(this.nowModule[0]);
      });
      return this.nowModule;
    },

    // 切换路由需要记录
    checkPage(pageMeta: routerMeta) {
      this.nowPage.meta = pageMeta;
      this.nowLicense = licenseMap["page_" + pageMeta.menuId];
      localStorage.setItem("menuId", pageMeta.menuId);
    },
  },
});

export function useModuleHook() {
  return moduleStore(store);
}
