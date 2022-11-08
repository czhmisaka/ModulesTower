<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2022-09-03 20:00:22
 * @FilePath: /configforpagedemo/src/views/Home.vue
-->

<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.02)',
      overflow: 'hidden',
    }"
  >
    <gridDesktop
      :grid-col-num="desktopData.gridColNum"
      :desktopData="desktopData.desktopData"
    />
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "./PageConfigData/index";
import { isValidKey } from "@/utils/index";

let localName = "";
export default defineComponent({
  components: {
    gridDesktop,
  },
  methods: {
    async init() {
      if (this.$route.params) {
        let { PageName } = this.$route.params;
        if (isValidKey(PageName, PageConfig)) {
          this.desktopData = PageConfig[PageName];
        } else {
          this.$message("没找到对应的页面呢");
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
      desktopData: PageConfig["main"],
      Env: {},
    };
  },
  mounted() {
    this.init();
  },
});
</script>
