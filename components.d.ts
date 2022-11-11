/*
 * @Date: 2022-10-31 08:52:55
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-11 10:35:12
 * @FilePath: /configforpagedemo/components.d.ts
 */

declare module 'vue' {
  export interface GlobalComponents {
    Card: typeof import('./src/components/basicComponents/grid/module/gridCard/card.vue')['default']
    CardApiControler: typeof import('./src/components/basicComponents/cell/action/cardApiControler.vue')['default']
    CardBg: typeof import('./src/components/basicComponents/cell/card/cardBg.vue')['default']
    CardBox: typeof import('./src/components/basicComponents/grid/module/gridCard/module/cardBox.vue')['default']
    CardCell: typeof import('./src/components/basicComponents/cell/card/cardCell.vue')['default']
    CardEditModal: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/cardEditModal.vue')['default']
    ComponentsIconCard: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/componentsIconCard.vue')['default']
    ComponentsListModal: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/componentsListModal.vue')['default']
    CustomDragElement: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/gridComponent/components/CustomDragElement.vue')['default']
    DynamicIsland: typeof import('./src/components/basicComponents/cell/info/DynamicIsland.vue')['default']
    Editable: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/editable.vue')['default']
    ElAside: typeof import('element-plus/es')['ElAside']
    ElButton: typeof import('element-plus/es')['ElButton']
    ElCard: typeof import('element-plus/es')['ElCard']
    ElContainer: typeof import('element-plus/es')['ElContainer']
    ElForm: typeof import('element-plus/es')['ElForm']
    ElFormItem: typeof import('element-plus/es')['ElFormItem']
    ElHeader: typeof import('element-plus/es')['ElHeader']
    ElIcon: typeof import('element-plus/es')['ElIcon']
    ElInput: typeof import('element-plus/es')['ElInput']
    ElMain: typeof import('element-plus/es')['ElMain']
    ElMenu: typeof import('element-plus/es')['ElMenu']
    ElMenuItemGroup: typeof import('element-plus/es')['ElMenuItemGroup']
    ElOption: typeof import('element-plus/es')['ElOption']
    ElRadioButton: typeof import('element-plus/es')['ElRadioButton']
    ElRadioGroup: typeof import('element-plus/es')['ElRadioGroup']
    ElSelect: typeof import('element-plus/es')['ElSelect']
    ElSlider: typeof import('element-plus/es')['ElSlider']
    ElTooltip: typeof import('element-plus/es')['ElTooltip']
    FuncComponentLoader: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/funcComponentLoader.vue')['default']
    GridDesktop: typeof import('./src/components/basicComponents/grid/gridDesktop.vue')['default']
    GridItem: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/gridComponent/components/GridItem.vue')['default']
    GridLayout: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/gridComponent/components/GridLayout.vue')['default']
    Header: typeof import('./src/components/header/header.vue')['default']
    Icon: typeof import('./src/components/basicComponents/cell/icon/icon.vue')['default']
    IconCell: typeof import('./src/components/basicComponents/cell/icon/iconCell.vue')['default']
    Iframe: typeof import('./src/components/basicComponents/cell/info/iframe.vue')['default']
    InfoCard: typeof import('./src/components/basicComponents/cell/info/infoCard.vue')['default']
    InfoCell: typeof import('./src/components/basicComponents/cell/info/infoCell.vue')['default']
    InfoFile: typeof import('./src/components/basicComponents/cell/info/infoFile/infoFile.vue')['default']
    InfoList: typeof import('./src/components/basicComponents/list/info/infoList.vue')['default']
    InputList: typeof import('./src/components/basicComponents/list/input/inputList.vue')['default']
    LessIcon: typeof import('./src/components/basicComponents/cell/icon/lessIcon.vue')['default']
    LineSlideExchange: typeof import('./src/components/animate/lineSlideExchange.vue')['default']
    Login: typeof import('./src/components/userInfo/login.vue')['default']
    MarkedPage: typeof import('./src/components/basicComponents/cell/markdown/markedPage/index.vue')['default']
    Menu: typeof import('./src/components/menu/menu.vue')['default']
    PropInputDeal: typeof import('./src/components/basicComponents/grid/module/baseToolComponents/propInputDeal.vue')['default']
    TableCell: typeof import('./src/components/basicComponents/cell/table/tableCell.vue')['default']
    TableList: typeof import('./src/components/basicComponents/list/table/tableList.vue')['default']
  }
}

export { }
