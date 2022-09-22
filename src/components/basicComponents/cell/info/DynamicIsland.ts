/*
 * @Date: 2022-09-22 23:02:49
 * @LastEditors: CZH
 * @LastEditTime: 2022-09-23 00:44:59
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/DynamicIsland.ts
 */

// 信息状态
export enum infoType {
    message = "message",
    element = "element",
    icon = "icon",
    image = "image",
    sleep = "sleep",
}

export enum infoTypeActionListLengthLimit{
    messgae = "3",
    element = "1",
    icon = "2",
    imaeg = "1"
}

// 完整信息
export interface infoTemplate {
    type: infoType;
    message?: string;
    el?: Function | any;
    icon?: string | Function;
    time?: number;
    image?: string;
    options?: { [key: string]: any };
}