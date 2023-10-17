<!--
 * @Date: 2023-10-11 16:02:44
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-12 16:35:44
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/eventCenter/eventCenter.vue
-->

<template></template>
<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";
import {
    componentInfo,
    inputType,
    propInfo,
    gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";

import {
    propertiesMaker,
    uiSchemaMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import VueForm from "@lljj/vue3-form-element";
import { btnList } from "@/modules/knowledge/PageConfigData/template/templateDetail";
import { showType, tableCellTemplate, btnCellTemplate, btnActionTemplate } from "@/modules/userManage/types";
import { eventTriggerType } from './eventCenter';


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
    props: ['baseData', 'gridList', 'event', 'triggerType'],
    created() {
        if (this.triggerType === eventTriggerType.onMounted && this.event) {
            this.event(this, this.baseData)
        }
    },
})
</script>

<style scoped></style>