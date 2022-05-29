/*
 * @Date: 2022-05-22 18:51:27
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-29 14:35:41
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/baseCardComponentMixins.ts
 */
export const baseComponents = {
    props: [
        "sizeUnit", "detail", "baseData", "gridList"
    ],
    emits: ["onChange","ready","openComponentsList"],
}