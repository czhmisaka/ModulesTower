/*
 * @Date: 2022-10-31 08:52:55
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-30 09:26:02
 * @FilePath: /configforpagedemo/components.d.ts
 */

declare module 'vue' {
  export interface GlobalComponents {
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
  }
}

export { }
