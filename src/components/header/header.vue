<!--
 * @Date: 2021-12-30 19:40:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-29 10:10:00
 * @FilePath: /configforpagedemo/src/components/header/header.vue
-->
<template>
  <div class="header">
    <div class="left siteTitle">
      <div :class="isOpen ? 'normal' : 'mini'">
        <!-- 这边放上自己的icon -->
      </div>
      <div class="title"></div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { headerCusButtonCellTemplate } from "./headerConfigtemplate";
export default defineComponent({
  name: "header",
  porps: {
    headerConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    customButtonList: {
      type: Array,
      default: () => {
        let back: Array<headerCusButtonCellTemplate> = [];
        return back;
      },
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
.header {
  width: 100vw;
  height: 50px;
  box-shadow: 0px 0px 10px #ccc;
}
</style>
