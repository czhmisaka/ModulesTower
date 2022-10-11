<!--
 * @Date: 2022-10-11 09:39:46
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-11 09:40:27
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/markdown/markedPage/index.vue
-->
<template>
  <cardBg>
    <markedpage :markdown="markdown"></markedpage>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import markedpage from "vue3markedcomponent";
const readme = require("../../../../../../README");

export default defineComponent({
  name: "markedPage",
  props: ["getMarkDownFunc", "baseData", "sizeUnit"],
  components: {
    markedpage,
    cardBg,
  },
  data: () => {
    return {
      markdown: [] as any[],
    };
  },
});
</script>
