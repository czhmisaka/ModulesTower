<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-15 23:53:24
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
    <gridDesktop @onChange="onChange" :grid-col-num="12" :desktopData="testData" />
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { testData } from "@/components/basicComponents/grid/module/testData";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    gridDesktop,
  },
  methods: {
    async init() {},
  },
  watch: {
    $route: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  data: () => {
    return {
      testData,

      Env: {},
    };
  },
});
</script>
