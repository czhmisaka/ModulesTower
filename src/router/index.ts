/*
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-20 11:21:16
 * @FilePath: /ConfigForDesktopPage/src/router/index.ts
 */

import {
  Router,
  RouterHistory,
  createRouter,
  RouteRecordRaw,
  RouteComponent,
  createWebHistory,
  createWebHashHistory,
  RouteRecordNormalized,
} from "vue-router";

import { getAction } from "./util";
import { isMobile } from "../utils/Env";
import { getConfig } from "@/utils/config/appConfig";

import { toRouteType } from "./types";
import NProgress from "@/utils/progress";
import { findIndex } from "lodash-unified";
import { sessionKey, type DataInfo } from "@/utils/auth";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";

import {
  ascending,
  initRouter,
  isOneOfArray,
  getHistoryMode,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes,
} from "./utils";
import {
  buildHierarchyTree,
  openLink,
  isUrl,
  storageSession,
} from "@pureadmin/utils";

import homeRouter from "./modules/home";
import errorRouter from "./modules/error";
import remainingRouter from "./modules/remaining";
import { RouteConfigsTable } from "../../types/index";
import { useModuleHook } from "@/store/modules/module";
import { useTags } from "@/layout/hooks/useTag";

// let baseModuleRoutes = await getAction()["getAllPageRouter"]();

// homeRouter.children = homeRouter.children.concat(baseModuleRoutes);
// 路由存放
const routes = [homeRouter, errorRouter];

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(routes).concat(
  ...remainingRouter
);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map((v) => {
  return remainingRouter[v].path;
});

// 建立路由
export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes.concat(...(remainingRouter as any)),
});

/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name);
      router.options.routes = formatTwoStageRoutes(
        formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
      );
    }
  });
  usePermissionStoreHook().clearAllCachePage();
}

/** 路由白名单 */
const whiteList = [
  ...router
    .getRoutes()
    .filter((x) => x.meta["allPeopleCanSee"])
    .map((x) => x.path),
];

/** 登录页面 */
export const loginPage = router
  .getRoutes()
  .filter((x) => x.meta["loginPage"])
  .map((x) => x.path)[0];

router.beforeEach((to: toRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(newMatched);
    }
  }
  const userInfo = storageSession.getItem<DataInfo<number>>(sessionKey);
  NProgress.start();
  const externalLink = isUrl(to?.name as string);
  if (!externalLink) {
    to.matched.some((item) => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      if (Title) document.title = `${item.meta.title} | ${Title}`;
      else document.title = item.meta.title as string;
    });
  }
  if (userInfo) {
    // 无权限跳转403页面
    if (to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
      next({ path: "/error/403" });
    }
    if (_from?.name) {
      // name为超链接
      if (externalLink) {
        openLink(to?.name as string);
        NProgress.done();
      } else {
        next();
      }
    } else {
      // 刷新
      if (
        usePermissionStoreHook().wholeMenus.length === 0 &&
        to.path !== loginPage
      )
        initRouter().then((router: Router) => {
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const { path } = to;
            const index = findIndex(remainingRouter, (v) => {
              return v.path == path;
            });
            const routes: any =
              index === -1
                ? router.options.routes[0].children
                : router.options.routes;
            const route = findRouteByPath(path, routes);
            // query、params模式路由传参数的标签页不在此处处理
            if (route && route.meta?.title) {
              useMultiTagsStoreHook().handleTags("push", {
                path: route.path,
                name: route.name,
                meta: route.meta,
              });
            }
          }
          router.push(to.fullPath);
        });
      next();
    }
  } else {
    if (to.path !== loginPage) {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: loginPage });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

const module = useModuleHook();

// 路由守卫
// 控制默认到index界面执行匹配
router.beforeEach(async (to, from, next) => {
  console.log(to.matched, "匹配项目", to);
  let meta = {} as { [key: string]: any };
  if (to.matched && to.matched.length > 1) {
    meta = to.matched[1].meta;
    module.checkPage(to.matched[1].meta);
    next();
  } else if (to.matched.length == 0) {
    next("/welcome");
  }

  // // 特殊显示需求处理
  // if ("Fullscreen" in meta && meta.Fullscreen == true) {
  //   console.log(meta, "meta ");
  //   // const { onContentFullScreen } = useTags();
  //   // onContentFullScreen(true);
  // } else {
  //   // const { onContentFullScreen } = useTags();
  //   // onContentFullScreen(false);
  // }
  else next();
});

export default router;
