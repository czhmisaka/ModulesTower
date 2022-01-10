/*
 * @Date: 2022-01-08 13:47:04
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-08 15:18:01
 * @FilePath: /configforpagedemo/src/components/header/headerConfigtemplate.ts
 */

export enum headerCusButtonCell_buttonType {
    button,
}



/**
 * @name: headerCusButtonCellTemplate
 * @description: 网站头导航栏自定义按钮组件
 * @authors: CZH
 * @Date: 2022-01-08 13:48:33
 */
export interface headerCusButtonCellTemplate {
    label: string,
    type: headerCusButtonCell_buttonType,
    return: Function;
    cusStyle:Map<string,string>,
}