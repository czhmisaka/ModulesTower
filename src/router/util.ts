

/*
 * @Date: 2022-04-29 14:11:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-14 00:32:38
 * @FilePath: \ConfigForDesktopPage\src\router\util.ts
 */
import { menuInfoTemplate } from "./../components/menu/menuConfigTemplate";
import { CardComponentTemplate } from '../components/basicComponents/grid/module/dataTemplate'
const Layout = () => import("@/components/basicComponents/layout/index.vue");
import { RouteRecordRaw } from 'vue-router';

/**
 * @name: metaInfoTemplate
 * @description: 路由meta数据控制
 * @authors: CZH
 * @Date: 2022-04-29 14:45:01
 */
export interface metaInfoTemplate {
    menuInfo: {
        asideMenu: boolean | Array<menuInfoTemplate>,
        headerMenu: boolean | Array<menuInfoTemplate>,
    },
    options: {
        [key: string]: any
    }
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
    options: { meta?: { [key: string]: any }, router?: { [key: string]: any } } = {},
    children: RouteRecordRaw[] = []
): RouteRecordRaw => {
    let routerCell: RouteRecordRaw = {
        path,
        name,
        component,
        children,
        meta: {
            title: name,
            extraIcon: {
                name: 'bxs:package'
            },
            ...options['meta'],
        },
        ...options['router']
    }
    return routerCell;
}



/**
 * @name: modulesCellTemplate
 * @description: 模块生成模板
 * @authors: CZH
 * @Date: 2022-11-07 16:05:19
 */
export interface modulesCellTemplate {
    name: string,
    path: string,
    routers: RouteRecordRaw[],
    components: CardComponentTemplate[],
    output?: { [key: string]: any },
    children?: { [key: string]: any }[],
    baseInfo?: {
        info: string,
        output?: boolean,
        authorize?: string
        fitScreenSize?: string
        [key: string]: any
    },
}

let moduleList = [] as modulesCellTemplate[]





/**
 * @name: getModuleFromView
 * @description: 从@/modules文件夹中遍历并生成模块文件列表,基于模块单体页面构建，不参与主体页面构建流程，自带动画效果
 * @authors: CZH
 * @Date: 2022-10-23 21:51:34
 * @param {*} basePath
 */
export const getModuleFromView = (init = false, basePath = '') => {
    if (!init) {
        return moduleList;
    }

    moduleList = [] as modulesCellTemplate[];
    const requireModule = require.context(
        '@/modules/',
        true,
        /.\.ts|\.vue/g
    )
    const requireList = requireModule.keys() as string[];

    // 文档路径
    const pageConfigData = 'PageConfigData/index.ts'
    const component = 'component/index.ts'
    const mainPage = "Index.vue"
    const output = "output.ts"
    const router = "router/index.ts"

    /**
     * @name: getModuleName
     * @description: 获取模组名(文件夹名)
     * @authors: CZH
     * @Date: 2022-11-07 14:42:27‘
     * @param {string} fileName
     */
    function getModuleName(fileName: string): string {
        return fileName.split('./')[1].split('/')[0]
    }

    /**
     * @name: getDealName
     * @description: 获取当前所需处理的对象名
     * @authors: CZH
     * @Date: 2022-11-07 14:53:40
     * @param {string} fileName
     */
    function getDealName(fileName: string, len = 3): string {
        return fileName.split('/').length < len ? '' : fileName.split('/').filter((x: any, i: number) => i >= len - 1).join('/')
    }

    /**
     * @name: getFileNameLength
     * @description: 获取当前处理对象长度
     * @authors: CZH
     * @Date: 2022-11-07 14:54:12
     * @param {string} fileName
     */
    function getFileNameLength(fileName: string): number {
        return fileName.split('/').length
    }
    /**
     * @name: dealRequireList
     * @description: 处理函数
     * @authors: CZH
     * @Date: 2022-11-07 14:54:37
     * @param {function} checkFunc
     * @param {function} dealFunc
     */
    function dealRequireList(checkFunc: (dealName: string, len: number) => boolean, dealFunc: (fileName: string) => void) {
        requireList.map((fileName: string) => {
            if (checkFunc(getDealName(fileName), getFileNameLength(fileName))) {
                dealFunc(fileName)
            }
        })
    }

    // 处理获取到模块，构建基础的模块列表
    dealRequireList((dealName, len) => dealName == mainPage && len == 3, (fileName: string) => {
        const moduleName = getModuleName(fileName)
        moduleList.push({
            name: moduleName,
            path: `@/modules/${moduleName}/`,
            routers: [
                routerCellMaker(`/${basePath}/${moduleName}/:PageName`, moduleName, () => import('../modules/' + moduleName + '/Index.vue'))
            ],
            baseInfo: { info: '' },
            output: {},
            children: [],
            components: [] as CardComponentTemplate[],
        })
    })

    // 处理outPut文件
    dealRequireList((dealName, len) => dealName == output && len == 3, (fileName: string) => {
        const moduleName = getModuleName(fileName)
        moduleList.map((module: modulesCellTemplate) => {
            if (module.name == moduleName) {
                const output = requireModule(fileName)
                module.output = output
                if (output['moduleInfo']) {
                    module.baseInfo = {
                        ...module.baseInfo,
                        ...output['moduleInfo']
                    }
                }
            }
            return module
        })
    })

    // 处理组件列表
    dealRequireList((dealName, len) => dealName == component, (fileName: string) => {
        const moduleName = getModuleName(fileName)
        moduleList.map((module: modulesCellTemplate) => {
            if (module.name == moduleName) {
                module.components = requireModule(fileName).default
            }
            return module
        })
    })

    // 处理路由列表
    dealRequireList((dealName, len) => dealName == router, (fileName: string) => {
        const moduleName = getModuleName(fileName)
        moduleList.map((module: modulesCellTemplate) => {
            if (module.name == moduleName) {
                module.routers = [
                    ...module.routers,
                    ...requireModule(fileName).default
                ]
            }
            return module
        })
    })

    // 添加默认路由方案 (output配置中可以关闭)    
    dealRequireList((dealName, len) => dealName == pageConfigData, (fileName: string) => {
        const moduleName = getModuleName(fileName)
        moduleList.map((module: modulesCellTemplate) => {
            if (module.name == moduleName) {
                const pageMap = requireModule(fileName)['PageConfig']
                Object.keys(pageMap).map((pageName: string) => {
                    
                })
            }
            return module
        })
    })

    console.log(moduleList, 'asd')
    return moduleList
}



export const baseModuleRouter: RouteRecordRaw = {
    path: "/desktop",
    name: "modules",
    component: Layout,
    redirect: "/desktop/",
    meta: {
        icon: "bxs:package",
        title: "模块",
        rank: 0
    },
    children: []
};

