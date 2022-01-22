/*
 * @Date: 2022-01-07 18:03:35
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-22 18:27:33
 * @FilePath: /configforpagedemo/src/config/siteConfig/menu/index.ts
 */




/**
 * @name: menuCellType
 * @description: 支持的菜单栏类型
 * @authors: CZH
 * @Date: 2022-01-07 18:26:34
 */
enum menuCellType {
    leaf,
    group,
    main,
}

/**
 * @name: menuCellTemplate
 * @description: menu单元格模板
 * @authors: CZH
 * @Date: 2022-01-07 18:18:40
 */
export interface menuCellTemplate {
    label: string & number,
    path: string,
    type: menuCellType,
    style: object & string,
}

export const addMenuCell = () => { }


// 菜单栏配置
const menuConfig: Array<menuCellTemplate> = [

]




export default menuConfig;

