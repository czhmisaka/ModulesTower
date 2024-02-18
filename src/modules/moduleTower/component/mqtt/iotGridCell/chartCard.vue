<template>
    <cardBg :cus-style="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }">
        <div :style="iotCardTitleStyle">
            {{ label }}
        </div>
        <div>
            <!-- // todo -->
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
    props: ['label', 'chartOptions', 'mainTopic', 'getKey'],
    data: () => {
        return {
            iotCardTitleStyle
        }
    }
})
</script>

<style scoped></style>