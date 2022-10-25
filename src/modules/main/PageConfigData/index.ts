
/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-25 17:57:50
 * @FilePath: /configforpagedemo/src/modules/main/PageConfigData/index.ts
 */
import { mainDesktop } from './main';
import { mobileDesktop } from './mobile';
import { ChenYi } from './ChenYi'
import { gridCellTemplate } from '../../../components/basicComponents/grid/module/dataTemplate';
import { isValidKey } from '../../../utils/index';

let pageConfig = {
    MAIN: { desktopData: mainDesktop, gridColNum: 12 },
    MOBILE: { desktopData: mobileDesktop, gridColNum: 4 },
    CHENYI: { desktopData: ChenYi, gridColNum: 4 }
}

let Page = {} as {
    [key: string]: { desktop: gridCellTemplate[], gridColNum: number }
}
Object.keys(pageConfig).map((key: string) => {
    if (isValidKey(key, pageConfig))
        Page[String(key).toUpperCase()] = pageConfig[key]
})

export const PageConfig = { ...Page }