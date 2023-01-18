<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-18 00:23:05
 * @FilePath: /configforpagedemo/src/modules/main/Index.vue
-->

<template>
  <div
    :style="{
      width: 'calc(100% )',
      height: 'calc(100% )',
      background: 'rgba(0,0,0,0)',
      overflow: 'hidden',
    }"
  >
    <gridDesktop
      :grid-col-num="desktopData.gridColNum"
      :desktopData="desktopData.desktopData"
      :cus-style="desktopData?.cusStyle"
    />
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "./PageConfigData/index";
export default defineComponent({
  components: {
    gridDesktop,
  },
  computed: {},
  methods: {
    async init() {
      if (this.$route) {
        let PageName = String(
          this.$route.path.split("/")[this.$route.path.split("/").length - 1]
        );
        if (Object.keys(PageConfig).indexOf(PageName) > -1) {
          this.desktopData = PageConfig[PageName];
        } else {
          this.$message("没找到对应的页面呢,已前往模块首页");
          this.$router.push({
            ...this.route,
            params: {
              PageName: Object.keys(PageConfig)[0],
            },
          });
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
      desktopData: PageConfig[Object.keys(PageConfig)[0]],
    };
  },
  async mounted() {
    this.init();
  },
});
</script>
