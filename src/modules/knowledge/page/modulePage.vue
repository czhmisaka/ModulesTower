<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-06 15:48:21
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/Index.vue
-->

<template>
     <div
        :style="{
        width: `calc(100%)`,
        height: `calc(100%)`,
        background: 'rgb(255, 255, 255)',
        overflow: 'hidden',
        margin: desktopData.cusStyle.margin,
        }"
    >
        <gridDesktop
        :grid-col-num="desktopData.gridColNum"
        :desktopData="desktopDataList"
        :component-lists="component"
        :cus-style="desktopData?.cusStyle"
        :noAnimate="true"
        />
    </div>
 
</template>

<script lang="ts">
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { defineComponent } from "vue";
import { PageConfig } from "../PageConfigData/template/index";
import { isValidKey } from "@/utils/index";
import { GetAllUser } from "@/utils/api/user/user";
import { timeConsole } from "@/main";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
export default defineComponent({
  components: {
    gridDesktop,
    cardBg
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
        let PageName = Object.keys(PageConfig)[0];
        // if (Object.keys(PageConfig).indexOf(PageName) > -1) {
          let res = PageConfig[PageName];
          this.desktopData = res;
          this.desktopDataList = await this.desktopData.desktopData();
        // }
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
