<!--
 * @Date: 2022-07-24 15:31:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-03 16:45:10
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/service/service.vue
-->
<template>
    <cardBg v-if="Object.keys(deviceInfoLocal).length > 0" style="cursor: pointer;">
        <el-divider content-position="left">
            <div class="flex">
                <div class="text top">Iot能力</div>
                <div class="text bottom">
                    {{ deviceInfoLocal.nameEn }}
                </div>
            </div>
        </el-divider>
        <div class="word" v-for="item in deviceInfoLocal.service">
            <div class="title">
                {{ serviceName(item.type) }}
            </div>
            <div class="btn">
            </div>
        </div>
    </cardBg>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { componentInfo, gridSizeMaker, propInfo, inputType } from '@/components/basicComponents/grid/module/dataTemplate';
import { IotDeviceTemplate } from '../iotCard';
import { serviceName } from './service';
import { ElButton } from 'element-plus';

export default defineComponent({
    name: 'iotServiceCard',
    componentInfo: {
        label: 'iotServiceCard',
        labelNameCN: 'iot功能列表卡片',
        description: '用于展示iot设备所拥有的功能的卡片',
        gridInfo: {
            middle: gridSizeMaker(2, 3)
        },
    } as componentInfo,
    propsDetail: {
    } as propInfo,
    props: ["sizeUnit", 'baseData', 'detail', 'deviceInfo'],
    components: { cardBg },
    watch: {
        deviceInfo: {
            handler(newVal) {
                this.deviceInfoLocal = newVal;
            },
            deep: true
        }
    },
    data() {
        return {
            deviceInfoLocal: {} as IotDeviceTemplate,
            isHover: false
        }
    },
    mounted() {
        this.$emit('ready')
        this.deviceInfoLocal = this.deviceInfo;
    },
    methods: {
        serviceName,
    }
});
</script>
  
  
<style lang="scss" scoped>
.flex {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
    flex-direction: column;

    .text {
        text-align: left;
        font-size: 14px;
        font-weight: 600;
        padding: 0px;
    }

    .bottom {
        font-size: 8px;
        font-weight: 100;
    }
}

.word {
    display: flex;
    justify-content: flex-start;
    padding: 0px 12px;

    .title {
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        width: 60px;
    }


    .text {
        text-align: left;
        font-weight: 100;
        font-size: 12px;
    }
}
</style>