<!--
 * @Date: 2022-07-24 15:31:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-27 20:48:16
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/module/baseToolComponents/componentsIconCard.vue
-->
<template>
  <cardBg>
    <!-- {{ cardComponents.componentInfo.labelNameCN }} -->
    <el-divider content-position="left">
      <div class="flex">
        <div class="text top">{{ cardComponents?.componentInfo?.labelNameCN || cardComponents.name }}</div>
        <div class="text bottom">
          {{ cardComponents.name }}
        </div>
      </div>
    </el-divider>
    <div class="word">
      <div class="title">
        组件包：
      </div>
      <div class="text">
        {{ cardComponents?.componentInfo?.label?.split('_')[0] || '系统组件' }}
      </div>
    </div>
    <div class="word">
      <div class="text">
        {{ cardComponents?.componentInfo?.description }}
      </div>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { componentInfo } from '../dataTemplate';

export default defineComponent({
  props: ["cardComponents", "sizeUnit"],
  components: { cardBg },
  mounted() {
    // console.log(this.cardComponents);
  },
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