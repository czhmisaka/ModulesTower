
/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-08 15:31:08
 * @FilePath: /configforpagedemo/src/modules/customPersonalPreview/PageConfigData/index.ts
 */
import { mainDesktop } from './main';
import { gridCellTemplate } from '@/components/basicComponents/grid/module/dataTemplate';
import { isValidKey } from '@/utils/index';

export interface desktopDataTemplate { desktopData?: gridCellTemplate[], gridColNum?: number }


const pageConfig = {
    main: { desktopData: mainDesktop, gridColNum: 12 },
} as {[key:string]:desktopDataTemplate}



let Page = {} as {
    [key: string]: desktopDataTemplate
}

Object.keys(pageConfig).map((key: string) => {
    if (isValidKey(key, pageConfig))
        Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate
})

export const PageConfig = { ...Page }