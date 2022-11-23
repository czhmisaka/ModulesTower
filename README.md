<!--
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-23 14:10:08
 * @FilePath: /vue3MarkedComponent/example/assets/ConfigForDesktopPage.md
-->

# configForDesktopPage

项目地址：[体验地址](http://42.192.134.238/workbench/#/)
项目仓库：[configForDesktopPage](https://github.com/czhmisaka/ConfigForDesktopPage)
这是一款针对web团队协作开发用的组件，可以有效的复用代码，开发的同时产出组件的使用说明和文档。
通过引入GridDesktop组件，输入组件配置列表，即可使用组件构建出一个简单的界面。
同时在桌面页面中也配置了一些基础配置动画和配置工具，方便开发调试。

## 关键节点介绍

### 路由【router】
页面访问路径类，配置后可注册到全局路由，更具路由配置决定页面加载方案
### 权限【permission】	
具体分为两块权限，基于 路由的访问权限 && 基于接口配置的数据操作权限 && 组件显示权限 ，权限应为 用户所属的角色计算后得出权限范围
### 页面配置【pageDataConfig】
记录组件配置组合 & 页面配置参数（操作权限，本地存储数据等）的数据对象，可以存放到云上提供远程加载能力
### 组件包【modules】
一个功能模块的集合，内含 工具函数，工具类，组件，基础页面配置
### 角色【role】
多条权限基于身份的集合
### 用户【user】
用户
### 组件【component】
基础组件，需要提供*componentInfo*,*propsDetail*,*baseProps*等属性，作为组件注册的凭据

## 桌面

桌面本身也是一个组件，可以在项目中按需引用。
具体路径：
*@/components/basicComponents/grid/gridDesktop.vue*
使用参考配置

```html
<template>
    <gridDesktop @onChange="onChange" :grid-col-num="12" :desktopData="testData" :cusStyle="cusStyle"/>
</template>
```

具体组件载入数据的配置详情可参考

```Typescript
const props = {
    // 自定样式
    cusStyle: {
      type: Object,
      default: () => {
        return {} as {
          // 全屏幕展示
          wholeScreen?: boolean;
          maxRows?: number;
          [key: string]: any;
        };
      },
    },

    // 可编辑状态 // 目前尚未实装功能
    editable: {
      type: Boolean,
      default: false,
    },

    // 渲染间隔
    gridColNum: {
      type: Number,
      default: 12,
    },

    // 可以使用的组件列表
    desktopData: {
      type: Array,
      default: () => {
        return testData as Array<gridCellTemplate>;
      },
    },
  },
```

### CardApi

通过封装对于onChange事件的操作，gridDesktop组件将会拥有更加广泛易用的组件操作能力

#### setData

功能描述：一个用于交互桌面组件BaseData数据的函数，本质是分装了gridDesktop的onChange操作，关于GridDesktop能响应的组件操作，可以参考 *组件-基座*

```Typescript
/**
 * @name: setData
 * @description: 简易组件数据推送到桌面baseData的工具
 * @authors: CZH
 * @Date: 2022-07-29 16:25:14
 */
export const setData = (content: {
    [key: string]: any
}, value: { [key: string]: any }): void => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        content[func]('onChange', deepClone(value), {
            type: [
                cardOnChangeType.onChange
            ]
        })
    } catch (err) {
        console.error('setData_数据上报错误:', err, content, value);
    }
}
```


#### changeVisible

功能描述：一个用于设置组件显影状态的函数，可以触发组件的fade in out 动画

```TypeScript
/**
 * @name: changeVisible
 * @description: 组件可视状态修改
 * @authors: CZH
 * @Date: 2022-08-17 20:07:07
 * @param {object} content
 * @param {object} value
 */
export const changeVisible = (content: { [key: string]: any }, value: { [key: string]: Boolean }) => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        let data = {} as gridCellOptions;
        Object.keys(value).map((name: string) => {
            data[name] = {
                options: { showInGridDesktop: value[name] }
            }
        })
        content[func]('onChange', data, {
            type: [
                cardOnChangeType.cardConfigChange
            ]
        })
    } catch (err) {
        console.error('changeVisible 错误:', err, content, value);
    }
}
```

#### changeCardPosition
功能描述：一个用于设置组件位置状态的函数，可以触发组件的位移动画

```Typescript
/**
 * @name: changeCardPosition
 * @description: 使用组件名称修改组件位置
 * @authors: CZH
 * @Date: 2022-08-17 21:01:15
 * @param {object} content
 * @param {object} value
 */
export const changeCardPosition = (content: { [key: string]: any }, value: { [key: string]: gridPositionCell }) => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        let data = {} as gridCellOptions;
        Object.keys(value).map((name: string) => {
            data[name] = {
                gridInfo: {
                    default: {
                        position: value[name]
                    }
                }
            }
        })
        content[func]('onChange', data, {
            type: [
                cardOnChangeType.cardConfigChange
            ]
        })
    } catch (err) {
        console.error('changeVisible 错误:', err, content, value);
    }
}
```


#### changeCardSize
功能描述：一个用于设置组件大小的函数，可以触发组件的变形动画


```Typescript
/**
 * @name: changeCardSize
 * @description: 使用组件名称修改组件Size
 * @authors: CZH
 * @Date: 2022-08-17 21:01:15
 * @param {object} content
 * @param {object} value
 */
export const changeCardSize = (content: { [key: string]: any }, value: { [key: string]: gridSizeCell }) => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        let data = {} as gridCellOptions;
        Object.keys(value).map((name: string) => {
            data[name] = {
                gridInfo: {
                    default: {
                        size: value[name]
                    }
                }
            }
        })
        content[func]('onChange', data, {
            type: [
                cardOnChangeType.cardConfigChange
            ]
        })
    } catch (err) {
        console.error('changeVisible 错误:', err, content, value);
    }
}


```


#### changeCardProperties
功能描述：用于修改组件props参数的函数，

```Typescript
/**
 * @name: changeCardProperties
 * @description: 修改组件配置参数
 * @authors: CZH
 * @Date: 2022-09-08 10:06:40
 * @param {object} content
 * @param {*} value
 */
export const changeCardProperties = (content: { [key: string]: any }, value: { [key: string]: any }) => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        let data = {} as gridCellOptions;
        Object.keys(value).map((name: string) => {
            data[name] = {
                options: {
                    props: { ...value[name] }
                },
            }
        })
        content[func]('onChange', data, {
            type: [
                cardOnChangeType.cardConfigChange
            ]
        })
    } catch (err) {
        console.error('changeVisible 错误:', err, content, value);
    }
}
```

## 组件

### 组件-基座

组件底座
*@/components/basicComponents/grid/module/gridCard/card.vue*

组件底座将会基于组件本身属性提供以下功能

1. 属性配置界面，可以实时配置属性
2. 提供emit事件可以单独配置组件加载状态
3. 提供组件布局（需要组件本身支持响应式布局）
4. 依照组件配置项可以快速生成组件文档

桌面组件将会响应以下onChange事件类型

```Typescript
export enum cardOnChangeType {
    upOnChange = 'upOnChange',
    onChange = 'onChange',
    forceRefresh = 'forceRefresh',
    forceRefreshToOrgin = 'forceRefreshToOrgin',
    gridCardListonChange = 'gridCardListonChange',
    cardConfigChange = 'cardConfigChange',
    cardEdit = 'cardEdit',
    cardDelete = 'cardDelete',
    openComponentsList = 'openComponentsList',
}
```

### 组件-通用功能

通用功能基于emit事件实现

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

### 组件-加载方案-SSRComponent

功能开发中，尽情期待

远程组件功能接入，基与 http://doc.ssr-fc.com/ 提供ssr组件整合方案，支持不同框架组件的插入使用







# 组件包

## 简述
打包存放 组件，能力插入组件，功能函数，moduleApi调用等功能


# 操作逻辑阐述

## 新增一条访问权限
```mermaid
graph LR;
    开始-->创建访问权限-->已有路由能否满足{已有路由能否满足}
    已有路由能否满足-- 存在所需路由 ---> 绑定路由到访问权限中
    已有路由能否满足-- 不存在所需路由 ---> 新增路由 --> 已有页面配置是否满足需求{已有页面配置是否满足需求}
    已有页面配置是否满足需求 -- 满足 ---> 绑定页面配置到路由 --> 绑定路由到访问权限中
    已有页面配置是否满足需求 -- 不满足 ---> 新增页面配置 --> 拖拽组件调整页面配置 --> 保存页面配置 --> 绑定页面配置到路由
    绑定路由到访问权限中 --> 完成
```




# 组件包开发实践

## 什么情况下应该使用组件包形式开发

1. 可以抽象功能模块，产生技术积累的项目
2. 项目设计中明确了产生多个页面复用同一个组件的情况
3. 需要保持风格一致的ui设计语言
4. 需要项目后期可以保持维护的能力
5. 需要前端组件文档产出

## 组件包开发流程

### 发布一个新的组件包
```mermaid
graph LR;
    需求评估 -- 评估是否具有整合为页面的基础&&是否需要单独开发组件 ---> 决定开发计划 -- 组件开发 ---> 组件能力编辑 --> 开发完成
    决定开发计划 -- 页面整合开发 ---> 页面配置数据开发 --> 页面配置能开发 --> 开发完成
    决定开发计划 -- 但组件页面开发 ---> 配置单组件页面配置 --> 开发单页面组件 --> 根据output模板填写组件包能力介绍文档 --> 开发完成
    开发完成 --> 决定技术储备方式 -- 作为公开包发布 --->发布到gitlab公开项目
    决定技术储备方式 -- 作为私有包发布 ---> 组内代码存储
```



## 一个新模块的项目结构

1. 模块内的的组件可以单独放一个文件夹，使用index.ts透出一份组件列表，同时需要在compontList.ts中引入
2. data中用于存放当前模块中的API，图片，配置数据等资源
3. 单独存放一个Router编写当前组件的路由
4. index.vue中可以通过加载不同的桌面配置文件来切换当前页面的功能

<img src='./markDownImage/file.png'>

**图片仅作为示范，并非本项目内容**

## 一些开发过程中需要注意的地方

### 避免需要重构的结构性风险

1. 避免对Props对象引用赋值,掌握组件数据流向
2. 避免循环调用setData
3. 组件数据保持独立性，避免使用vuex和localStorage

### 保证对于数据接口的极简依赖

1. 本质上是数据和渲染的分离，props中的数据接口参数和配置组件渲染方式的参数不应该有耦合

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
