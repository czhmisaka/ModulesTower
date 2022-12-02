<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-02 17:24:23
 * @FilePath: /configforpagedemo/src/modules/userManage/Index.vue
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
import { isValidKey } from "@/utils/index";
import { GetAllUser } from "@/utils/api/user/user";

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
      if (this.$route) {
        let PageName = String(
          this.$route.path.split("/")[this.$route.path.split("/").length - 1]
        );
        if (Object.keys(PageConfig).indexOf(PageName) > -1) {
          let res = PageConfig[PageName];
          this.desktopData = res;
          // this.desktopData = JSON.parse(
          //   JSON.stringify(res, function (key, val) {
          //     if (typeof val === "function") {
          //       return val + "";
          //     }
          //     return val;
          //   }),
          //   function (key, val) {
          //     if (val.indexOf && val.indexOf("function") > -1) {
          //       return eval("(function(){return " + val + " })()");
          //     }
          //     return val;
          //   }
          // );
          // console.log(
          //   res,
          //   JSON.parse(
          //     JSON.stringify(res, function (key, val) {
          //       if (typeof val === "function") {
          //         console.log(val, "asd1");
          //         return val + "";
          //       }
          //       return val;
          //     }),
          //     function (key, val) {
          //       if (val.indexOf && val.indexOf("function") > -1) {
          //         console.log(val, "asd2");
          //         return eval("(function(){return " + val + " })()");
          //       }
          //       return val;
          //     }
          //   ),
          //   "asd"
          // );
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
    };
  },
  async mounted() {
    this.init();
    let res = await GetAllUser();
    console.log(res);
  },
});
</script>
