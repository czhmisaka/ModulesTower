<!--
 * @Date: 2022-07-24 15:31:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-28 13:58:30
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/mqtt/iotCard.vue
-->
<template>
    <cardBg>
        <!-- {{ cardComponents.componentInfo.labelNameCN }} -->
        <el-divider content-position="left">
            <div class="flex">
                <div class="text top">{{ deviceInfo?.componentInfo?.labelNameCN || deviceInfo.name }}</div>
                <div class="text bottom">
                    {{ deviceInfo.name }}
                </div>
            </div>
        </el-divider>
        <div class="word">
            <div class="title">
                组件包：
            </div>
            <div class="text">
                {{ deviceInfo?.componentInfo?.label?.split('_')[0] || '系统组件' }}
            </div>
        </div>
        <div class="word">
            <div class="text">
                {{ deviceInfo?.componentInfo?.description }}
            </div>
        </div>
    </cardBg>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

export default defineComponent({
    props: ["deviceInfo", "sizeUnit", 'baseData', 'detail'],
    components: { cardBg },
    mounted() {},
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
        cursor: copy;
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