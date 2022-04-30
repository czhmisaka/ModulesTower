/*
 * @Date: 2022-04-30 14:30:48
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-30 14:30:48
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/util.ts
 */


/**
    * @name: gridPositionByXY
    * @description: 计算并返回grid布局参数
    * @authors: CZH
    * @Date: 2022-04-29 16:11:19
    * @param {*} x
    * @param {*} y
    * @param {*} xSize
    * @param {*} ySize
    */
export function gridPositionByXY(
    x: number,
    y: number,
    xSize: number,
    ySize: number,
    options: { [key: string]: any } = {}
) {
    return {
        gridArea: `${x} / ${y} / ${x + xSize} / ${y + ySize}`,
        ...options,
    };
}