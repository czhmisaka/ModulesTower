/*
 * @Date: 2022-04-29 14:11:20
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-04 09:22:58
 * @FilePath: /configforpagedemo/src/router/util.ts
 */
import { menuInfoTemplate } from "./../components/menu/menuConfigTemplate";
import { CardComponentTemplate } from "../components/basicComponents/grid/module/dataTemplate";
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");
import { transformSync } from "@babel/core";
import { useUserStoreHook } from "@/store/modules/user";
const user = useUserStoreHook();

// 函数执行时间计算
const timeChecker = class {
  name: string;
  startTime: number;
  constructor(name) {
    this.name = name;
    this.startTime = new Date().getTime();
  }
  getTime = (word: string | number = " ") => {
    console.log(this.name, word, new Date().getTime() - this.startTime + "ms");
  };
};

function transform(scriptText: string) {
  const transformed = transformSync(scriptText, {
    presets: ["@babel/preset-env"],
  });
  return transformed.code;
}

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
  console.log(user.getOptions(), "用户信息");
  let routerCell: RouteConfigsTable = {
    path,
    name,
    component,
    children,
    meta: {
      title: name,
      icon: "bxs:package",
      ...options["meta"],
      // 这里的false可能需要根据用户的登录身份修改
      showLink: true,
    },
    ...options["router"],
  };
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
  routers: RouteConfigsTable[];
  components: CardComponentTemplate[];
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

/**
 * @name: getModuleFromView
 * @description: 从@/modules文件夹中遍历并生成模块文件列表,基于模块单体页面构建，不参与主体页面构建流程，自带动画效果
 * @authors: CZH
 * @Date: 2022-10-23 21:51:34
 * @param {*} basePath
 */
export const getModuleFromView = (init = false) => {
  const timec = new timeChecker("getModuleFromView");
  if (!init) {
    timec.getTime(1);
    return moduleList;
  }

  // 如果你找到了这里的 require.context 搜索出了问题，先看一下是不是出现了空文件夹，如有则删除。  -- czh 20221109
  moduleList = [] as modulesCellTemplate[];
  const requireModule = require.context("@/modules/", true, /.\.ts|\.vue/g);
  const requireList = requireModule.keys() as string[];

  // 文档路径
  const pageConfigData = "PageConfigData/index.ts";
  const pageConfigEnv = "PageConfigData";
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
    return fileName.split("./")[1].split("/")[0];
  }

  /**
   * @name: getDealName
   * @description: 获取当前所需处理的对象名
   * @authors: CZH
   * @Date: 2022-11-07 14:53:40
   * @param {string} fileName
   */
  function getDealName(fileName: string, len: number = 3): string {
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
    dealFunc: (fileName: string) => void
  ) {
    requireList.map((fileName: string) => {
      if (checkFunc(getDealName(fileName), getFileNameLength(fileName))) {
        dealFunc(fileName);
      }
    });
  }

  // 处理获取到模块，构建基础的模块列表
  dealRequireList(
    (dealName, len) => dealName == mainPage && len == 3,
    (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.push({
        name: moduleName,
        path: `@/modules/${moduleName}/`,
        routers: [
          routerCellMaker(
            `/${moduleName}`,
            moduleName,
            () => import(`../modules/${moduleName}/Index.vue`),
            {},
            []
          ),
        ],
        baseInfo: { info: "" },
        output: {},
        children: [],
        components: [] as CardComponentTemplate[],
      });
    }
  );

  // 整理模块包的引入关系
  dealRequireList(
    (dealName, len) =>
      dealName.indexOf(pageConfigEnv) > -1 &&
      len == 4 &&
      dealName != pageConfigData,
    (fileName: string) => {
      // console.log(fileName, requireModule(fileName), "zxc");
    }
  );

  // 处理outPut文件
  dealRequireList(
    (dealName, len) => dealName == output && len == 3,
    (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map((module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          const output = requireModule(fileName);
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

  // 处理组件列表
  dealRequireList(
    (dealName, len) => dealName == component,
    (fileName: string) => {
      const moduleName = getModuleName(fileName);
      moduleList.map((module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          module.components = requireModule(fileName).default;
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
      moduleList.map((module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          const pageMap = requireModule(fileName)["PageConfig"];
          Object.keys(pageMap).map((pageName: string) => {
            module.routers[0].children.push(
              routerCellMaker(
                `/${moduleName}/${pageName}`,
                pageMap[pageName]["name"]
                  ? moduleName + "_" + pageMap[pageName]["name"]
                  : moduleName + "_" + pageName,
                () => import(`../modules/${moduleName}/Index.vue`),
                {
                  meta: {
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
      moduleList.map((module: modulesCellTemplate) => {
        if (module.name == moduleName) {
          module.routers = [
            ...module.routers,
            ...requireModule(fileName).default,
          ];
        }
        return module;
      });
    }
  );

  // 获取所有的模块构建出来的路由记录
  moduleList["getAllPageRouter"] = async () => {
    let routes = [];
    moduleList.map((x) => {
      x.routers.map((cell) => {
        if (cell.children && cell.children.length > 0) {
          cell.children.map((route) => {
            routes.push(route);
          });
        } else {
          routes.push(cell);
        }
      });
    });
    return routes;
  };

  // 获取所有模块包的组件
  moduleList["getAllComponents"] = () => {
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
  moduleList["getAllPluginComponent"] = () => {
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
  moduleList["getModuleApi"] = () => {
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
  timec.getTime(2);
  return moduleList;
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
