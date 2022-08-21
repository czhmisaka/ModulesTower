<!--
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-21 13:57:53
 * @FilePath: /configforpagedemo/README.md
-->

# configForDesktopPage

这是一款针对web小团队协作开发用的组件，可以有效的复用代码，开发的同时产出组件的使用说明和文档。
通过引入GridDesktop组件，输入组件配置列表，即可使用组件构建出一个简单的界面。
同时在桌面页面中也配置了一些基础配置动画和配置工具，方便开发调试。

## 组件

### 组件-如何渲染

参考 *@/components/basicComponents/grid/module/gridCard/card.vue*

### 组件-注册方式

一般项目内部使用的组件都可以依照原先的组件编写方式进行编写，使用函数cardComponentMaker注册到componentLists中。

```TypeScript

/**
 * @name: cardComponentMaker
 * @description: 可用组件生成器
 * @authors: CZH
 * @Date: 2022-05-19 14:06:02
 */
export const cardComponentMaker = (
    component: any,
    props: {
        [key: string]: {
            label: string,
            type: inputType,
            localData?: {
                [key: string]: any,
            }
        }
    },
    baseProps: { [key: string]: any },
    compontentInfo: {
        description?: string,
        label?: string,
        group?: string,
        context?: Array<any>,
        gridInfo?: { [key: string]: gridSizeCell },
        [key: string]: any
    } = {},
): CardComponentTemplate => {
    let cardComponent = {
        name: compontentInfo.label,
        settngDetail: {
            props,
            baseProps,
        },
        compontentInfo,
        component,
    } as CardComponentTemplate;
    return cardComponent;
}

```


### 组件-加载方案

这里会按照不同的加载方式执行对应的组件加载
**一般在内部项目开发时间，推荐使用componentList加载方式**

```Typescript
/**
 * @name: cardComponentType
 * @description: 组件加载方式
 * @authors: CZH
 * @Date: 2022-05-16 18:43:10
 */
export enum cardComponentType {
    componentList = 'componentList',
    fromData = 'fromData', // 不推荐使用data保存组件
    cusComponent = 'cusComponent', // 使用自定义组件
}
```

### 组件-加载方案-componentList

通过组件name加载对应的组件，组件存储在 componentList对象中
当前项目的地址为 *@/components/basicComponents/grid/module/gridCard/module/componentLists.ts*

### 组件-加载方案-fromData

功能开发中
通过组件name加载对应的组件，组件数据将会保存在注册桌面组件对象时的data中，在运行时会通过data构建独立的组件

```Typescript
/**
 * @name: cardComponent
 * @description: 组件对象
 * @authors: CZH
 * @Date: 2022-05-19 16:00:11
 */
export interface cardComponent {
    name: string,
    type: cardComponentType,
    data?: string,
    getFunc?: (data: any) => any,
}
```

### 组件-加载方案-cusComponent

功能开发中，尽情期待
提供一个执行函数，需要后端服务器配合完成挂在现有的基于vue3构建的项目

# 实践

## 一些开发过程中需要注意的地方

1. 避免对Props对象引用赋值
2. 避免循环调用setData

### 避免需要重构的结构性风险

1. 掌握组件数据流

### 保证对于数据接口的极简依赖

## 近期开发的任务列表

## 项目启动和调试

### Project setup

```shell
npm install
```

#### Compiles and hot-reloads for development

```shell
npm run dev
```

#### Compiles and minifies for production

```shell
npm run build
```



--------------------------------

