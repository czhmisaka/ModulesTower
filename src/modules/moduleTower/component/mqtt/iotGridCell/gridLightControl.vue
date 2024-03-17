<!--
 * @Date: 2024-01-27 21:13:58
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-14 23:03:58
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/gridLightControl.vue
-->
<template>
    <cardBg :cus-style="{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-arround',
    }">
        <div class="mainBoard">
            <div class="colorGrid" v-for="(item, i ) in ControlArr" :style="{
                width: `${100 / Math.floor(Math.sqrt(ControlArr.length))}%`,
                height: `${100 / Math.floor(Math.sqrt(ControlArr.length))}%`,
                backgroundColor: `rgb(${item[0]},${item[1]},${item[2]})`,
                color: `rgb(${255 - item[0]},${255 - item[1]},${255 - item[2]})`,
            }" @click="setColor(color, i)">
            </div>
        </div>
        <cardBg class="toolBar">
            <div class="btn">
                <ElUpload>
                    <el-button>
                        上传图片
                    </el-button>
                </ElUpload>
            </div>
        </cardBg>
        <cardBg class="colorBoard">
            <el-button v-for="c in isUseColors" :color="c" size="small" style="margin-top: 6px" @click="color = c"
                class="colorBox">
            </el-button>
            <el-color-picker v-model="color" color-format="rgb" />
        </cardBg>
    </cardBg>
</template>

<script lang="ts">
import { gridSizeMaker, componentInfo } from '@/components/basicComponents/grid/module/dataTemplate';
import { defineComponent } from 'vue'
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { ElDivider, ElUpload, ElButton } from 'element-plus';
import { pushData } from './iotGridCell';
import { Toolbar } from '@wangeditor/editor-for-vue';

export default defineComponent({
    componentInfo: {
        labelNameCN: "ws2812灯板控制组件",
        key: "gridLightControl",
        description:
            "ws2812控制用灯板，有回显功能",
        gridInfo: {
            middle: gridSizeMaker(3, 3),
        },
    } as componentInfo,
    components: { cardBg, ElDivider, ElUpload },
    props: [
        'label',
        'sendKey',
        'preKey',
        'size'
    ],
    data: () => {
        return {
            ControlArr: [],
            isReady: false,
            color: 'rgb(255, 69, 0)',
            isUseColors: [],
        }
    },
    watch: {
        ControlArr: {
            handler(val) {
                if (this.isReady) {
                    pushData(this.sendKey, this.preKey + JSON.stringify(val))
                }
            },
            deep: true
        }
    },
    methods: {
        init(size = 8 * 8) {
            let num = 0
            this.isReady = false
            const interval = setInterval(() => {
                this.ControlArr.push([0, 0, 0])
                num++
                if (num == size) {
                    clearInterval(interval)
                    this.isReady = true
                }
            }, 10)
        },


        setColor(color, i) {
            this.ControlArr[i] = color.replace('rgb(', '').replace(')', '').split(',')
        }
    },
    mounted() {
        this.$emit('ready')
        console.log(this.size, 'fuck ')
        if (this.size)
            this.init(this.size)
        else this.init()
    },
})
</script>

<style lang="scss" scoped>
.toolBar {
    position: absolute;
    top: 0px;
    left: 0px;
    margin: 3px;
    width: calc(20% - 6px) !important;
    height: calc(100% - 6px) !important;
}

.mainBoard {
    position: absolute;
    top: 0%;
    left: 20%;
    width: calc(80% - 24px) !important;
    height: calc(80% - 24px) !important;
    margin: 12px;
    border-radius: 6px;
    overflow: hidden;

    .colorGrid {
        position: relative;
        float: left;
        width: calc(12.5%);
        height: calc(12.5%);
    }
}

.colorBoard {
    position: absolute;
    top: 80%;
    left: 20%;
    margin: 3px;
    width: calc(80% - 6px) !important;
    height: calc(20% - 6px) !important;
}
</style>