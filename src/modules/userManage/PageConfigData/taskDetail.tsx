/*
 * @Author: LJH
 * @Date: 2023-05-15 09:22:39
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-07 10:01:31
 */
import {
    gridCellMaker,
    gridSizeMaker,
    cardComponentType,
    cardOnChangeType,
    gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
export const taskDetail = async () => {
    return [
        gridCellMaker(
            "taskDetail",
            "任务详情页面",
            {},
            {
                name: "userManage_taskDetail",
                type: cardComponentType.componentList,
            },
            {
                props: {
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[]
}