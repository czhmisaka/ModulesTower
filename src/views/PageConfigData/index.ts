
/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-10 20:47:00
 * @FilePath: /configforpagedemo/src/views/PageConfigData/index.ts
 */
import { mainDesktop } from './main';
import { mobileDesktop } from './mobile';
import { ChenYi } from './ChenYi'

export const PageConfig = {
    main: { desktopData: mainDesktop, gridColNum: 12 },
    mobile: { desktopData: mobileDesktop, gridColNum: 4 },
    chenyi: { desktopData: ChenYi, gridColNum: 4 }
}