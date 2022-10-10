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
      overflow: 'hidden',
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
import { isValidKey } from "./../utils/index";

let localName = "";
export default defineComponent({
  components: {
    gridDesktop,
  },
  methods: {
    async init() {},
  },
  watch: {
    $route: {
      handler(): void {
        this.init();
      },
      deep: true,
    },
  },
  data: () => {
    return {
      desktopData: PageConfig[isMobile() ? "mobile" : "main"],
      Env: {},
      isMobile,
    };
  },
  mounted() {
    this.init();
    if (window.location.origin.split(".czht.top").length > 0) {
      localName = window.location.origin.split(".czht.top")[0].split("://")[1];
      if (isValidKey(localName, PageConfig)) {
        console.log("localName", localName, PageConfig[localName]);
        this.desktopData = PageConfig[localName];
      }
    }
  },
});
</script>
