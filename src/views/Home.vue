<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-22 21:14:15
 * @FilePath: /configforpagedemo/src/views/Home.vue
-->

<template>
  <div
    :style="{
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.02)',
    }"
  >
    <gridDesktop @onChange="onChange" :grid-col-num="4"/>
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    gridDesktop,
  },
  methods: {
    onChange: (): void => {},
  },
  data: () => {
    return {};
  },
});
</script>
