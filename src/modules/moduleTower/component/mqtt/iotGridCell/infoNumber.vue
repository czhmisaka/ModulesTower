<!--
 * @Date: 2024-02-25 01:02:40
 * @LastEditors: CZH
 * @LastEditTime: 2024-02-25 02:09:07
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/infoNumber.vue
-->
<template>
    <CardBg :cusStyle="{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }">
        <div :style="iotCardTitleStyle">
            {{ label }}
        </div>
        <div style="
            font-size:1.8em;
            font-weight:200;
            width:calc(100% - 12px);
            height:calc(100% - 30px);
            justify-content: space-between;
            margin:0px 6px;
            display:flex;
            flex-basis: fit-content;
            flex-wrap: wrap;">
            <div> {{ data }}</div>
            <div style="font-size: 0.6em;font-weight: 100;margin-top: 0.7em;">
                {{ suffix }}
            </div>
        </div>
    </CardBg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { iotCardTitleStyle } from './iotGridCell';
import { mqttService } from '../script/mqttService';

export default defineComponent({
    components: { CardBg },
    props: ['label', 'suffix', 'getKey'],
    data: () => {
        return {
            data: 0,
            iotCardTitleStyle,
            client: null
        }
    },
    async mounted() {
        const callBack = (topic, msg, pac) => {
            this.data = msg.split('.')[0] + (msg.split('.').length > 1 ? '.' + msg.split('.')[1][0] : '')
            this.$emit('ready')
        }
        this.client = await mqttService(this.getKey, callBack)
    },
})
</script>

<style scoped></style>