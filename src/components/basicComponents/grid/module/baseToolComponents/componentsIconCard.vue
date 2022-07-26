<!--
 * @Date: 2022-07-24 15:31:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-07-24 15:33:20
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/componentsIconCard.vue
-->
<template>
  <cardBg> </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

export default defineComponent({
  props: ["cardComponents"],
  components: { cardBg },
});
</script>
