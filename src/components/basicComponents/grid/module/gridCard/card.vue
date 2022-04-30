<!--
 * @Date: 2022-04-29 15:02:20
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-29 15:02:21
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/card.vue
-->

<template>
  <component :is="componentId"></component>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "gridCardBox",
  props: {},
  setup() {},
});
</script>
