/*
 * @Date: 2024-01-12 15:14:00
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-25 13:58:58
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/iotGridCell.tsx
 */

import CardBgVue from "@/components/basicComponents/cell/card/cardBg.vue";
import { gridCellMaker, cardComponentType } from "@/components/basicComponents/grid/module/dataTemplate";
import { post } from "@/utils/api/requests";
import { ElButton, ElDivider, ElInput, ElSwitch } from "element-plus";
import { defineComponent, ref } from "vue";
import { IotDeviceCellOptionsTemplate, IotDeviceGridDesktopCellTemplate, IotDeviceTemplate } from "../iotCard";

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
    // 格栅状态展示
    gridStatus = 'gridStatus',
}

export const pushData = async (topic, data) => {
    await post('/admin/iot/mqtt/publish', {
        uniqueId: topic,
        data
    })
}


// 获取各种iot设备控制面板
export function getIotDeviceCellGridDesktopCardComponent(
    gridCell: IotDeviceGridDesktopCellTemplate,
    IotCardInfo: IotDeviceTemplate
) {
    let sendKey = gridCell.sendKey || IotCardInfo.mainTopic
    let name = gridCell.preKey + sendKey + gridCell.type
    let preKey = gridCell.preKey ? gridCell.preKey + '_' : ''

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
                                if (e) pushData(sendKey, preKey + 'on')
                                else pushData(sendKey, preKey + 'off')
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
        case IotDeviceCellGridDesktopType.inputCard:
            return gridCellMaker(name, name, {}, {
                type: cardComponentType.cusComponent,
                data: defineComponent({
                    props: ['label'],
                    setup(props, context) {
                        context.emit("ready");
                        const word = ref('')
                        const click = () => {
                            pushData(sendKey, preKey + word.value)
                        }
                        return () => [<CardBgVue cusStyle={{
                            display: 'flex',
                            padding: '12px',
                            flexDirection: 'row',
                            justifyContent: 'space-arround',
                        }}>
                            {props.label ? <ElDivider contentPosition='left' style={{
                                fontWeight: 600
                            }}>
                                {props.label}
                            </ElDivider> : null}
                            <ElInput vModel={word.value}></ElInput><ElButton onClick={click} size='small'>发送</ElButton>
                        </CardBgVue>]
                    },
                })
            }, gridCell.data).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
    
        case IotDeviceCellGridDesktopType.sliderCard:

        }
}
