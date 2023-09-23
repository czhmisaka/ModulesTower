/*
 * @Date: 2022-04-29 14:11:20
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-24 03:50:31
 * @FilePath: /ConfigForDesktopPage/src/router/util.ts
 */
import { menuInfoTemplate } from "./../components/menu/menuConfigTemplate";
import { CardComponentTemplate } from "../components/basicComponents/grid/module/dataTemplate";
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");
import { transformSync } from "@babel/core";
import { desktopDataTemplate, stringAnyObj } from "@/modules/userManage/types";
import { timeConsole } from "@/main";

// 函数执行时间计算
export const timeChecker = class {
  name: string;
  startTime: number;
  checkTimeMap: stringAnyObj;
  checkNumMap: stringAnyObj;
  showConsole: boolean;
  constructor(name, showConsole: boolean = true) {
    this.name = name;
    this.startTime = new Date().getTime();
    this.checkTimeMap = {};
    this.checkNumMap = {};
    this.showConsole = showConsole;
  }
  getTime = (word: string | number = " ") => {
    if (!this.showConsole) return;
    console.log(this.name, word, new Date().getTime() - this.startTime + "ms");
  };

  checkTime = (word: string, extraWord: string = "") => {
    if (!this.showConsole) return;
    if (!this.checkTimeMap[word]) {
      this.checkTimeMap[word] = new Date().getTime();
      console.log(
        this.name,
        word + extraWord,
        "start",
        new Date().getTime() - this.startTime + "ms"
      );
    } else {
      console.log(
        this.name,
        word + extraWord,
        "end",
        new Date().getTime() - this.checkTimeMap[word] + "ms",
        "节点时间",
        new Date().getTime() - this.startTime + "ms"
      );
      this.checkTimeMap[word] = "";
    }
  };

  checkNum = (word: string) => {
    if (!this.showConsole) return;
    if (this.checkNumMap[word]) {
      console.log(
        this.name,
        word,
        this.checkNumMap[word]++,
        "节点时间",
        new Date().getTime() - this.startTime + "ms"
      );
    } else {
      this.checkNumMap[word] = -1;
      console.log(
        this.name,
        word,
        this.checkNumMap[word]++,
        "节点时间",
        new Date().getTime() - this.startTime + "ms"
      );
    }
  };
};
/**
 * @name: metaInfoTemplate
 * @description: 路由meta数据控制
 * @authors: CZH
 * @Date: 2022-04-29 14:45:01
 */
export interface metaInfoTemplate {
  menuInfo: {
    asideMenu: boolean | Array<menuInfoTemplate>;
    headerMenu: boolean | Array<menuInfoTemplate>;
  };
  options: {
    [key: string]: any;
  };
}

/**
 * @name: routerCellMaker
 * @description: 路由单元构建函数
 * @authors: CZH
 * @Date: 2022-04-29 14:49:39
 */
export const routerCellMaker = (
  path: string,
  name: string,
  component: any,
  options: {
    meta?: { [key: string]: any };
    router?: { [key: string]: any };
  } = {},
  children?: RouteConfigsTable[]
): RouteConfigsTable => {
  let routerCell: RouteConfigsTable = {
    path,
    name,
    component,
    children,
    meta: {
      title: name,
      icon: "bxs:package",
      showLink: true,
      ...options["meta"],
      // 这里的false可能需要根据用户的登录身份修改

      // 这个属性用于标注这个路由的来源 ，只有超级管理员能保持一直可见
      moduleBackUpRouter: true,
    },
    ...options["router"],
  };
  console.log(routerCell, "asd");
  return routerCell;
};

/**
 * @name: modulesCellTemplate
 * @description: 模块生成模板
 * @authors: CZH
 * @Date: 2022-11-07 16:05:19
 */
export interface modulesCellTemplate {
  name: string;
  path: string;
  routers: any[];
  isReady: boolean;
  pageMap: stringAnyObj;
  components: {
    [key: string]: CardComponentTemplate;
  };
  output?: { [key: string]: any };
  children?: { [key: string]: any }[];
  baseInfo?: {
    info: string;
    output?: boolean;
    authorize?: string;
    fitScreenSize?: string;
    [key: string]: any;
  };
}

let moduleList = [] as modulesCellTemplate[];
let action = {} as stringAnyObj;

/**
 * @name: getModuleFromView
 * @description: 从@/modules文件夹中遍历并生成模块文件列表,基于模块单体页面构建，不参与主体页面构建流程，自带动画效果
 * @authors: CZH
 * @Date: 2022-10-23 21:51:34
 * @param {*} basePath
 */
export const getModuleFromView = async (init = false) => {
  timeConsole.checkTime("模块加载");
  if (!init) {
    await new Promise((res) => {
      let interval = setInterval(() => {
        if (
          moduleList &&
          moduleList.length > 0 &&
          moduleList.filter((x) => x.isReady).length ==
            moduleList.filter((x) => x.components).length
        ) {
          clearInterval(interval);
          timeConsole.checkTime("模块加载", "fake");
          res(true);
        }
      }, 30);
    });
    return moduleList;
  }

  // 如果你找到了这里的 require.context 搜索出了问题，先看一下是不是出现了空文件夹，如有则删除。  -- czh 20221109
  // 感谢自己，表现形式可能为 undifined files -- czh 20230116
  // again ，可能需要做一个更好的提示信息 -- czh 20230209
  // fuck 迁移这种规模的代码都有点困难 -- czh 20230618
  // 好消息，现在我们改成了import(试图) -- czh 20230706
  moduleList = [] as modulesCellTemplate[];
  const importModule = import.meta.glob("@/modules/**", {});
  const requireList = Object.keys(importModule) as string[];
  const requireModule = async (fileName: string): Promise<any> => {
    return await importModule[fileName]();
  };
  // 文档路径
  const pageConfigData = "PageConfigData/index.ts";

  const component = "component/index.ts";
  const mainPage = "Index.vue";
  const output = "output.ts";
  const router = "router/index.ts";

  /**
   * @name: getModuleName
   * @description: 获取模组名(文件夹名)
   * @authors: CZH
   * @Date: 2022-11-07 14:42:27‘
   * @param {string} fileName
   */
  function getModuleName(fileName: string): string {
    return fileName.split("/src/modules/")[1].split("/")[0];
  }

  /**
   * @name: getDealName
   * @description: 获取当前所需处理的对象名
   * @authors: CZH
   * @Date: 2022-11-07 14:53:40
   * @param {string} fileName
   */
  function getDealName(fileName: string, len: number = 5): string {
    return fileName.split("/").length < len
      ? ""
      : fileName
          .split("/")
          .filter((x: any, i: number) => i >= len - 1)
          .join("/");
  }

  /**
   * @name: getFileNameLength
   * @description: 获取当前处理对象长度
   * @authors: CZH
   * @Date: 2022-11-07 14:54:12
   * @param {string} fileName
   */
  function getFileNameLength(fileName: string): number {
    return fileName.split("/").length;
  }
  /**
   * @name: dealRequireList
   * @description: 处理函数
   * @authors: CZH
   * @Date: 2022-11-07 14:54:37
   * @param {function} checkFunc
   * @param {function} dealFunc
   */
  function dealRequireList(
    checkFunc: (dealName: string, len: number) => boolean,
    dealFunc: (fileName: string, isLast: boolean) => void,
    afterFunc: () => void = () => {}
  ) {
    const dealList = requireList.filter((fileName: string) => {
      return checkFunc(getDealName(fileName), getFileNameLength(fileName));
    });
    dealList.map(async (fileName: string, i: number) => {
      if (checkFunc(getDealName(fileName), getFileNameLength(fileName))) {
        await dealFunc(fileName, dealList.length - 1 == i);
      }
      if (dealList.length - 1 == i) {
        afterFunc && afterFunc();
      }
    });
  }

  // 处理获取到模块，构建基础的模块列表
  dealRequireList(
    (dealName, len) => {
      return dealName == mainPage && len == 5;
    },
    (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.push({
        name: moduleName,
        path: `@/modules/${moduleName}/`,
        isReady: false,
        routers: [
          routerCellMaker(
            `/${moduleName}`,
            moduleName,
            () => import(`@/modules/${moduleName}/Index.vue`),
            {},
            []
          ),
        ],
        pageMap: {},
        baseInfo: { info: "" },
        output: {},
        children: [],
        components: {},
      });
    }
  );

  // 处理组件列表
  dealRequireList(
    (dealName, len) => dealName == component,
    async (fileName: string, isLast: boolean) => {
      const moduleName = getModuleName(fileName);
      moduleList.map(async (module: modulesCellTemplate, i) => {
        if (module.name == moduleName) {
          module.components = await (await requireModule(fileName)).default();
        }
        if (i == moduleList.length - 1 && isLast) {
          moduleList.map((x) => {
            x.isReady = true;
          });
        }
        return module;
      });
    }
  );

  // 处理outPut文件
  dealRequireList(
    (dealName, len) => dealName == output && len == 5,
    (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map(async (module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          const output = (await importModule[fileName]()) as stringAnyObj;
          if (output["output"]) module.output = output["output"];
          if (output["moduleInfo"]) {
            const moduleInfo = output["moduleInfo"];
            module.baseInfo = {
              ...module.baseInfo,
              ...moduleInfo,
            };
            module.routers[0].meta = {
              ...module.routers[0].meta,
              ...moduleInfo,
            };
          }
        }
        return module;
      });
    }
  );

  // 添加默认路由方案 (output配置中可以关闭)
  dealRequireList(
    (dealName, len) => dealName == pageConfigData,
    (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map(async (module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          const pageMap = (await requireModule(fileName))["PageConfig"];
          for (let x in pageMap) {
            module.pageMap[x] = pageMap[x];
          }
          Object.keys(pageMap).map((pageName: string) => {
            module.routers[0].children.push(
              routerCellMaker(
                `/${moduleName}/${pageName}`,
                pageMap[pageName]["name"]
                  ? moduleName + "_" + pageMap[pageName]["name"]
                  : moduleName + "_" + pageName,
                () => import(`@/modules/${moduleName}/Index.vue`),
                {
                  meta: {
                    originData: {
                      ...pageMap[pageName],
                      desktopData: null,
                    },
                    ...pageMap[pageName]["cusStyle"],
                    title:
                      pageMap[pageName]["name"] || moduleName + "_" + pageName,
                  },
                }
              )
            );
          });
        }
        return module;
      });
    }
  );

  // 处理路由列表
  dealRequireList(
    (dealName, len) => dealName == router,
    (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map(async (module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          module.routers = [
            ...module.routers,
            ...(await requireModule(fileName)).default,
          ];
        }
        return module;
      });
    }
  );

  await new Promise((res) => {
    let interval = setInterval(() => {
      if (
        moduleList &&
        moduleList.length > 0 &&
        moduleList.filter((x) => x.isReady).length ==
          moduleList.filter((x) => x.components).length
      ) {
        clearInterval(interval);
        timeConsole.checkTime("模块加载");
        res(true);
      }
    }, 30);
  });
  return moduleList;
};

export const getAction = () => {
  if (Object.keys(action).length == 0) getModuleFromView(true);
  // 获取所有的模块构建出来的路由记录
  action["getAllPageRouter"] = async () => {
    let routes = [];
    moduleList.map((x) => {
      x.routers.map((cell) => {
        if (cell.children && cell.children.length > 0) {
          cell.children.map((route) => {
            delete route.children;
            routes.push(route);
          });
        } else {
          routes.push(cell);
        }
      });
    });
    console.log(routes, "asd");
    return routes;
  };

  // 获取所有模块包的组件
  action["getAllComponents"] = () => {
    let back = {};
    moduleList.map((module: modulesCellTemplate) => {
      back = {
        ...back,
        ...module.components,
      };
    });
    return back;
  };

  // 获取所有模块包的 插入式能力组件
  action["getAllPluginComponent"] = () => {
    let back = {};
    moduleList.map((module) => {
      if (module.output.CardApiInjectComponent) {
        for (let componentName in module.output.CardApiInjectComponent) {
          back[`${module.name}_${componentName}`] =
            module.output.CardApiInjectComponent[componentName];
        }
      }
    });
    return back;
  };

  // 获取所有模块包的 插入式 onChange能力
  action["getModuleApi"] = () => {
    let back = {};
    moduleList.map((module) => {
      if (module.output.moduleApi) {
        for (let apiName in module.output.moduleApi) {
          back[`${module.name}_${apiName}`] = module.output.moduleApi[apiName];
        }
      }
    });
    return back;
  };

  return action;
};

// 可以被展开的数组
interface needFlatChildrenArrCell {
  children?: needFlatChildrenArrCell[];
  [key: string]: any;
}

// 数组展开
export const flatChildrenArr = (arr: needFlatChildrenArrCell[]) => {
  let back = [...arr];
  for (let i = 0; i < back.length; i++) {
    let cell = back[i];
    if (cell.children && cell.children.length > 0) {
      cell.children.map((x) => {
        back.push(x);
      });
    }
  }
  return back;
};

export const baseModuleRouter: RouteConfigsTable = {
  path: "/desktop",
  name: "modules",
  component: Layout,
  redirect: "/desktop/",
  meta: {
    icon: "bxs:package",
    title: "模块",
    rank: 0,
  },
  children: [],
};
