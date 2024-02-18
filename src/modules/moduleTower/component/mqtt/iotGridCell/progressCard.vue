<template>
    <cardBg :cus-style="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }">
        <div :style="iotCardTitleStyle">
            {{ label }}
        </div>
        <div class="content">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="dataValue" :color="colors">
                <span>{{ dataValue }}</span>
            </el-progress>
            <!-- <el-progress style="width: 100%;height:100%" type="dashboard" :percentage="dataValue" :color="colors" /> -->
        </div>
    </cardBg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { iotCardTitleStyle } from './iotGridCell';
import { IotDeviceTemplate } from '../iotCard';
import { mqttService } from '../script/mqttService';
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';


export default defineComponent({
    components: { cardBg },
    props: ['label', 'chartOptions', 'mainTopic', 'getKey', 'IotCardInfo'],
    async mounted() {
        this.client = await mqttService(this.getKey, this.callBack)
    },
    unmounted() {
        this.client?.end(true)
    },
    methods: {
        callBack(topic, msg, pac) {
            this.dataValue = msg
            if (!this.ready) {
                this.$emit('ready')
                this.ready = true
            }
        }
    },
    data: () => {
        return {
            client: null,
            ready: false,
            colors: [
                { color: '#f56c6c', percentage: 80 },
                { color: '#e6a23c', percentage: 60 },
                { color: '#5cb87a', percentage: 40 },
                { color: '#1989fa', percentage: 20 },
                { color: '#6f7ad3', percentage: 0 },
            ],
            iotCardTitleStyle,
            dataValue: '0'
        }
    }
})
</script>

<style scoped>
.content {
    width: calc(100% - 12px);
    margin: 6px;
    height: auto;
}
</style>