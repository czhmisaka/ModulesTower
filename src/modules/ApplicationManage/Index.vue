<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-18 00:02:10
 * @FilePath: /ConfigForDesktopPage/src/modules/ApplicationManage/Index.vue
-->

<template>
  <div :style="{
    width: `calc(100% - ${desktopData.cusStyle.margin})`,
    height: 'calc(100%)',
    background: 'rgba(0,0,0,0)',
    overflow: 'hidden',
  }">
    <gridDesktop :grid-col-num="desktopData.gridColNum" :desktopData="desktopDataList" :component-lists="component"
      :cus-style="desktopData?.cusStyle" :noAnimate="true" />
  </div>
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "./PageConfigData/index";
import { timeConsole } from "@/main";

console.log(PageConfig, "PageConfig");
export default defineComponent({
  components: {
    gridDesktop,
  },

  computed: {
    component() {
      return this.$modules.getAllComponents();
    },
  },

  methods: {
    async init() {
      timeConsole.checkTime("index页面");
      if (this.$route) {
        let PageName = "";
        if (this.$route.meta && this.$route.meta.PageName) {
          PageName = this.$route.meta.PageName.split("/")[
            this.$route.meta.PageName.split("/").length - 1
          ];
          PageName = PageName.toUpperCase();
        } else {
          PageName = String(
            this.$route.path.split("/")[this.$route.path.split("/").length - 1]
          ).toUpperCase();
        }
        if (Object.keys(PageConfig).indexOf(PageName) > -1) {
          let res = PageConfig[PageName];
          this.desktopData = res;
          this.desktopDataList = await this.desktopData.desktopData();
        }
      }
      timeConsole.checkTime("index页面");
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
