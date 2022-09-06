<!--
 * @Date: 2022-07-24 15:31:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-09-05 10:18:24
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/componentsIconCard.vue
-->
<template>
  <el-card shadow="hover">
    <template #header>
      <cardBg></cardBg>
    </template>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

export default defineComponent({
  props: ["cardComponents", "sizeUnit"],
  components: { cardBg },
});
</script>
