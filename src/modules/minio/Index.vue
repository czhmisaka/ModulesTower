<!--
 * @Date: 2021-12-30 17:48:16
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-03 10:37:09
 * @FilePath: /configforpagedemo/src/modules/minio/Index.vue
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
import component from "./component/index";
import { GetAllUser } from "@/utils/api/user/user";

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
      desktopData: PageConfig["main"],
      Env: {},
      component,
    };
  },
  async mounted() {
    this.init();
    let res = await GetAllUser();
    console.log(res);
  },
});
</script>
