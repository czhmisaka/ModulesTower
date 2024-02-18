<template>
    <CardBg :cusStyle="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }">
        <div :style="iotCardTitleStyle">
            {{ label }}
        </div>
        <div
            style="width:calc(100% - 12px);height:calc(100% - 30px);margin:0px 6px;display:flex;flex-basis: fit-content;flex-wrap: wrap;">
            <div class="box" v-for="item in Object.keys(PropsLabel)">
                <el-statistic :value="dataInfo.report[item]">
                    <template #title>
                        <div style="display: inline-flex; align-items: center">
                            {{ PropsLabel[item] }}
                        </div>
                    </template>
                </el-statistic>
            </div>
        </div>
    </CardBg>
</template>

<script setup lang="ts">
import CardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { mqttService } from '../script/mqttService';
import { cusStyle } from '../../../../userManage/types';
import { iotCardTitleStyle } from './iotGridCell';
import { IotDeviceTemplate } from '../iotCard';

const props = defineProps(['label', 'PropsLabel', 'sendKey', 'name', 'preKey', 'IotCardInfo', 'getKey'])
const IotCardInfo = props.IotCardInfo as IotDeviceTemplate

const emit = defineEmits(['update:modelValue', 'onChange', 'ready'])

const dataInfo = reactive({
    report: {}
})

const callBack = (topic, msg, pac) => {
    dataInfo.report = JSON.parse(msg)
}

let client = null as any
onMounted(async () => {
    client = await mqttService(props.getKey, callBack)
    emit('ready')
})

onBeforeUnmount(() => {
    client.end()
})

</script>

<style scoped>
.box {
    width: 50%;
    height: auto;
}
</style>