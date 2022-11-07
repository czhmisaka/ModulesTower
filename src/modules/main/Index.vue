
<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-07 23:21:58
 * @FilePath: /configforpagedemo/src/modules/main/Index.vue
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
      :grid-col-num="desktopData.gridColNum"
      :desktopData="desktopData.desktopData"
    />
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "./PageConfigData/index";
import { isValidKey } from "../../utils/index";

let localName = "";
export default defineComponent({
  components: {
    gridDesktop,
  },
  methods: {
    onChange() {},
    async init() {
      if (window.location.origin.split(".czht.top").length > 1) {
        localName = window.location.origin.split(".czht.top")[0].split("://")[1];
        if (isValidKey(localName, PageConfig)) {
          this.desktopData = PageConfig[localName];
        }
      } else if (this.$route.params) {
        let { PageName } = this.$route.params;
        PageName = PageName.toUpperCase();
        if (isValidKey(PageName, PageConfig)) {
          this.desktopData = PageConfig[PageName];
        } else {
          this.$router.push("/");
        }
      }
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
  data: () => {
    return {
      desktopData: PageConfig["MAIN"],
      Env: {},
    };
  },
  mounted() {
    this.init();
  },
});
</script>
