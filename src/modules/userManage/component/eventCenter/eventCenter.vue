<!--
 * @Date: 2023-10-11 16:02:44
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-30 17:34:58
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/eventCenter/eventCenter.vue
-->

<template></template>
<script lang="ts">
import { defineComponent, watch } from "vue";
import {
    componentInfo,
    propInfo,
    gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { eventTriggerType } from './eventCenter';
import { removeGridCell } from '../../../../components/basicComponents/grid/module/cardApi/index';


export default defineComponent({
    componentInfo: {
        labelNameCn: "事件触发器",
        key: "eventCenters",
        description: "一个用于触发事件的工具",
        gridInfo: {
            middle: gridSizeMaker(0, 0),
        },
    } as componentInfo,

    propsDetail: {} as propInfo,
    props: ['baseData', 'gridList', 'event', 'triggerType', 'stop'],
    watch: {
        baseData: {
            handler(val) {
                if (this.triggerType == eventTriggerType.onBaseDataChange) {

                }
            }
        },

    },
    data: () => {
        return {
        }
    },
    async mounted() {
        const that = this
        if (that.triggerType === eventTriggerType.onMounted && that.event && !this.stop) {
            await that.event(that, that.baseData)
        }
        if (that.triggerType === eventTriggerType.windowResize) {
            window.addEventListener('resize', async (e) => {
                await that.event(that, that.baseData)
            })
        }
        this.$emit('ready')
    },
    async unmounted() {
        const that = this
        if (that.triggerType === eventTriggerType.windowResize) {
            window.addEventListener('resize', async (e) => {
                await that.event(that, that.baseData)
            })
        }
    },
})
</script>

<style scoped></style>