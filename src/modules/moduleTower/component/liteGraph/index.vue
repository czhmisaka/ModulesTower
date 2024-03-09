<!--
 * @Date: 2024-02-28 21:35:42
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-01 14:14:29
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/liteGraph/index.vue
-->
<template>
    <div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import litegraph from 'litegraph.js'
import { componentInfo, gridSizeMaker } from '../../../../components/basicComponents/grid/module/dataTemplate';
console.log('LGraph', litegraph)
export default defineComponent({
    name: "liteGraph",
    componentInfo: {
        label: 'liteGraph',
        labelNameCN: '蓝图设计器',
        description: '用于编辑和展示蓝图',
        gridInfo: {
            middle: gridSizeMaker(6, 4)
        },
    } as componentInfo,

    data() {
        return {

        }
    }
})
</script>

<style scoped></style>