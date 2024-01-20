<!--
 * @Date: 2024-01-17 19:51:31
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-18 12:59:54
 * @FilePath: /ConfigForDesktopPage/src/modules/main/component/nameCard.vue
-->
<template>
    <cardBg :cusStyle="{
        backgroundColor: isBlack ? bgColor || 'red' : '#fff',
        color: isBlack ? '#fff' : '#000',
        transition: 'all 0.2s',
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        fontFamily: 'mFont1',
        fontSize: detail?.gridInfo?.default?.size?.width * sizeUnit.blockSize / 8 + 'px'
    }" @click="click">
        {{ title }}
    </cardBg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import {
    componentInfo,
    inputType,
    propInfo,
    gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";

export default defineComponent({
    components: { cardBg },
    props: ['isBlack', 'title', 'detail', 'sizeUnit', 'clickFunc', 'bgColor'],
    mounted() {
        this.$emit('ready')
        console.log(this.detail, this.sizeUnit)
    },
    methods: {
        click() {
            if (this.clickFunc) {
                this.clickFunc(this)
            }
        }
    },
    componentInfo: {
        labelNameCN: "名字卡片",
        key: "nameCard",
        description:
            "搜索列表组件，可以监听baseData内的参数作为搜索传参数，支持对接不同风格的表单搜索组件",
        gridInfo: {
            middle: gridSizeMaker(9, 8),
        },
    } as componentInfo,
})
</script>

<style scoped></style>