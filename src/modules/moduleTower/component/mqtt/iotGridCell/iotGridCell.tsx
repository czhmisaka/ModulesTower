/*
 * @Date: 2024-01-12 15:14:00
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-13 10:43:49
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/iotGridCell.tsx
 */

import CardBgVue from "@/components/basicComponents/cell/card/cardBg.vue";
import { gridCellMaker, cardComponentType } from "@/components/basicComponents/grid/module/dataTemplate";
import { post } from "@/utils/api/requests";
import { ElDivider, ElSwitch } from "element-plus";
import { defineComponent, ref } from "vue";
import { IotDeviceGridDesktopCellTemplate } from "../iotCard";

export enum IotDeviceCellGridDesktopType {
    // 文本展示
    infoCard = "infoCard",
    // 数字展示
    infoNumberCard = "infoNumberCard",
    // 图表展示工具
    chartCard = "chartCard",
    // 滑动控制器
    sliderCard = "sliderCard",
    // 按钮控制器
    buttonCard = "buttonCard",
    // 开关控制器
    switchCard = "switchCard",
    // 文本输入
    inputCard = "inputCard",
    // 多选一
    radioCard = "radioCard",
}

const pushData = async (topic, data) => {
    await post('/admin/iot/mqtt/publish', {
        uniqueId: topic,
        data
    })
}


// 获取各种iot设备控制面板
export function getIotDeviceCellGridDesktopCardComponent(
    gridCell: IotDeviceGridDesktopCellTemplate
) {
    let name = gridCell.preKey + gridCell.sendKey + gridCell.type
    switch (gridCell.type) {
        case IotDeviceCellGridDesktopType.switchCard:
            return gridCellMaker(
                name,
                name,
                {},
                {
                    type: cardComponentType.cusComponent,
                    data: defineComponent({
                        props: ['label'],
                        setup(props, context) {
                            context.emit("ready");
                            const value1 = ref(true)
                            function handleClick(e) {
                                let preKey = gridCell.preKey ? gridCell.preKey + '_' : ''
                                if (e) pushData(gridCell.sendKey, preKey + 'on')
                                else pushData(gridCell.sendKey, preKey + 'off')
                            }
                            return () => [<CardBgVue cusStyle={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-arround',
                            }}>
                                {props.label ? <ElDivider contentPosition='left' style={{
                                    fontWeight: 600
                                }}>
                                    {props.label}
                                </ElDivider> : null}
                                <ElSwitch
                                    vModel={value1.value}
                                    size='large'
                                    onChange={handleClick}
                                    style={{
                                        margin: 'auto'
                                    }}></ElSwitch>
                            </CardBgVue>]
                        },
                    }),
                },
                gridCell.data
            ).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);

        case IotDeviceCellGridDesktopType.buttonCard:
            return gridCellMaker('', '', {}, {
                type: cardComponentType.cusComponent,
                data: defineComponent({
                    setup(props, context) {
                        return () => [

                        ]
                    },
                })
            }, gridCell.data)
    }
}
