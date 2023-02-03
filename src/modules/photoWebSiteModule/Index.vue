<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-21 20:45:52
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/Index.vue
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
      :desktopData="desktopDataList"
      :component-lists="component"
      :cus-style="desktopData?.cusStyle"
    />
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "./PageConfigData/index";
import component from "@/modules/photoWebSiteModule/component";
import { getAction } from "@/router/util";
export default defineComponent({
  components: {
    gridDesktop,
  },

  computed: {
    component() {
      return getAction()["getAllComponents"]();
    },
  },
  methods: {
    async init() {
      if (this.$route) {
        let PageName = String(
          this.$route.path.split("/")[this.$route.path.split("/").length - 1]
        );
        if (Object.keys(PageConfig).indexOf(PageName) > -1) {
          let res = PageConfig[PageName];
          this.desktopData = res;
          this.desktopDataList = [];
          this.desktopDataList = await this.desktopData.desktopData();
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
      desktopDataList: [],
      desktopData: PageConfig[Object.keys(PageConfig)[0]],
      Env: {},
      dataText: "",
    };
  },
  async mounted() {
    this.init();
  },
});
</script>
