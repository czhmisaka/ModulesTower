/*
 * @Date: 2022-05-22 18:51:27
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-24 21:35:01
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/baseCardComponentMixins.ts
 */
export const baseComponents = {
    props: [
        "sizeUnit", "detail", "baseData", "gridList"
    ],
    emits: ["onChange","ready"],
}