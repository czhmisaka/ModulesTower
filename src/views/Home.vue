<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2022-09-03 20:00:22
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
    <gridDesktop
      @onChange="onChange"
      :grid-col-num="isMobile() ? 4 : 12"
      :desktopData="desktopData"
    />
  </div>
</template>

<script lang="ts">
import { isMobile } from "@/api/requests";
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "./PageConfigData/index";

export default defineComponent({
  components: {
    gridDesktop,
  },
  methods: {
    async init() {
      let route = this.$route;
      console.log(route, isMobile());
    },
  },
  watch: {
    $route: {
      handler(): void {
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
      desktopData: PageConfig[isMobile() ? "mobile" : "main"],
      Env: {},
      isMobile,
    };
  },
});
</script>
