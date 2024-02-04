
/*
 * @Date: 2024-01-25 13:30:19
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-30 20:57:53
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/gridCellComponent.tsx
 */
import { gridCellMaker } from "@/components/basicComponents/grid/module/dataTemplate";
import { IotDeviceGridDesktopCellTemplate, IotDeviceTemplate } from "../iotCard";
import { cardComponentType } from '../../../../../components/basicComponents/grid/module/dataTemplate';
import CardBgVue from "@/components/basicComponents/cell/card/cardBg.vue";
import { ElDivider, ElInput, ElButton, ElSlider } from 'element-plus';
import { defineComponent, ref } from "vue";
import { pushData } from "./iotGridCell";


export const sliderComponent = (gridCell: IotDeviceGridDesktopCellTemplate, IotCardInfo: IotDeviceTemplate) => {
    let sendKey = gridCell.sendKey || IotCardInfo.mainTopic
    let name = gridCell.preKey + sendKey + gridCell.type
    let preKey = gridCell.preKey ? gridCell.preKey + '_' : ''
    return gridCellMaker(name, name + gridCell.type, {}, {
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
                    <ElSlider vModel={word.value}></ElSlider>
                    {/* <ElInput vModel={word.value}></ElInput> */}
                </CardBgVue>]
            },
        })
    }, {}).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
}



export const gridLightControlComponent = (gridCell: IotDeviceGridDesktopCellTemplate, IotCardInfo: IotDeviceTemplate) => {
    let sendKey = gridCell.sendKey || IotCardInfo.mainTopic
    let name = gridCell.preKey + sendKey + gridCell.type
    let preKey = gridCell.preKey ? gridCell.preKey + '_' : ''
    return gridCellMaker(name, name + gridCell.type, {}, {
        type:cardComponentType.componentList,
        name:'moduleTower_gridLightControl'
    }, {
        props: {
            sendKey,
            preKey,
            ...gridCell.data
        }
    }).setSize(gridCell.gridInfo.width, gridCell.gridInfo.height).setPosition(gridCell.gridInfo.x, gridCell.gridInfo.y);
}