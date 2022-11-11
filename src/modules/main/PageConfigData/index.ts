
/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-11 10:44:35
 * @FilePath: /configforpagedemo/src/modules/main/PageConfigData/index.ts
 */
import { mainDesktop } from './main';
import { mobileDesktop } from './mobile';
import { ChenYi } from './ChenYi'
import { gridCellTemplate } from '@/components/basicComponents/grid/module/dataTemplate';
import { isValidKey } from '@/utils/index';

export interface desktopDataTemplate { desktopData?: gridCellTemplate[], gridColNum?: number }

let pageConfig = {
    MAIN: { desktopData: mainDesktop, gridColNum: 12 },
    MAIN2: { desktopData: mainDesktop, gridColNum: 14 },
    MOBILE: { desktopData: mobileDesktop, gridColNum: 4 },
    CHENYI: { desktopData: ChenYi, gridColNum: 4 }
} as { [key: string]: desktopDataTemplate }

let Page = {} as {
    [key: string]: desktopDataTemplate
}

Object.keys(pageConfig).map((key: string) => {
    if (isValidKey(key, pageConfig))
        Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate
})

export const PageConfig = { ...Page }