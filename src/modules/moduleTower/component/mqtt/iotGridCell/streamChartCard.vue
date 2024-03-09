<!--
 * @Date: 2024-02-25 01:02:40
 * @LastEditors: CZH
 * @LastEditTime: 2024-02-29 09:19:00
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotGridCell/streamChartCard.vue
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
        <div :id="chartId" class="chart">

        </div>
    </CardBg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { iotCardTitleStyle } from './iotGridCell';
import * as echarts from 'echarts';

import { mqttService } from '../script/mqttService';
let ChartId_num = 0
export default defineComponent({
    components: { CardBg },
    props: ['label', 'getKey'],
    data: () => {
        return {
            data: [],
            chartId: `iotChart${ChartId_num++}`,
            iotCardTitleStyle,
            client: null,
            option: {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        params = params[0];
                        var date = new Date(params.name);
                        return (
                            date.toLocaleString() + ' - ' +
                            params.value[1]
                        );
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        type: 'line',
                        showSymbol: false,
                        data: []
                    }
                ]
            }
        }
    },
    async mounted() {
        let chartDom = document.getElementById(this.chartId);
        let myChart = echarts.init(chartDom);
        const callBack = (topic, msg, pac) => {
            this.data.push({
                name: new Date().toLocaleString(),
                value: [
                    new Date().toLocaleString(),
                    msg.split('.')[0] + (msg.split('.').length > 1 ? '.' + msg.split('.')[1][0] : '')
                ]
            })
            if (this.data.length > 2000) this.data.shift()
            myChart.setOption({
                series: [{ data: this.data }]
            });
            myChart.resize();
        }

        this.client = await mqttService(this.getKey, callBack)
        this.option && myChart.setOption(this.option);
        this.$emit('ready')
    },
})
</script>

<style scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>