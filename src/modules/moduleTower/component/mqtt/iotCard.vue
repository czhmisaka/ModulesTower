<!--
 * @Date: 2022-07-24 15:31:57
 * @LastEditors: CZH
 * @LastEditTime: 2024-02-04 13:39:11
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotCard.vue
-->
<template>
    <cardBg v-if="Object.keys(deviceInfoLocal).length > 0" @click="onClick" @mouseenter="hoverIn" @mouseleave="hoverOut"
        style="cursor: pointer;">
        <el-divider content-position="left">
            <div class="flex">
                <div class="text top">{{ deviceInfoLocal.name }}</div>
                <div class="text bottom">
                    {{ deviceInfoLocal.nameEn }}
                </div>
            </div>
        </el-divider>
        <div class="word">
            <div class="title">
                功能：
            </div>
            <div class="text">
                {{ `【${deviceInfoLocal.service.join('】【')}】` || "暂无" }}
            </div>
        </div>
        <div class="word">
            <div class="text">
                {{ deviceInfoLocal.description }}
            </div>
        </div>
    </cardBg>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { componentInfo, gridSizeMaker, propInfo, inputType } from '../../../../components/basicComponents/grid/module/dataTemplate';
import { IotDeviceTemplate } from './iotCard';
import { changeCardProperties } from '../../../../components/basicComponents/grid/module/cardApi/index';
import  mqttDefault  from './script/mqtt';
const mqtt = mqttDefault.default
console.log(mqtt, 'mqtt')

const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: 'emqx_test',
}
const client  = mqtt.connect('mqtt://127.0.0.1:8083')
client.on('connect', function () {
  console.log('Connected')
  client.subscribe('test', function (err) {
    if (!err) {
      client.publish('test', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})

export default defineComponent({
    name: 'iotCard',
    componentInfo: {
        label: 'iotCard',
        labelNameCN: 'iot卡片',
        description: '用于展示iot设备的标准信息',
        gridInfo: {
            middle: gridSizeMaker(2, 3)
        },
    } as componentInfo,
    propsDetail: {
        deviceInfo: {
            label: "设备信息",
            type: inputType.obj
        },
        isLoading: {
            label: "加载状态",
            description: "true为正在加载",
            type: inputType.boolean
        },
    } as propInfo,
    props: ["deviceInfo", "sizeUnit", 'baseData', 'detail', 'hoverInFunc', 'hoverOutFunc', 'clickFunc'],
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

        async onClick() {
            if (!this.clickFunc) return false
            await this.clickFunc(this, this.deviceInfoLocal)
        },

        async hoverIn() {
            if (!this.hoverInFunc && !this.isHover) return false
            const that = this
            setTimeout(() => {
                that.isHover = true
            }, 500)
            await this.hoverInFunc(this, this.deviceInfoLocal)
        },

        async hoverOut() {
            if (!this.hoverOutFunc && this.isHover) return false
            this.isHover = false
            await this.hoverOutFunc(this, this.deviceInfoLocal)
        }
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