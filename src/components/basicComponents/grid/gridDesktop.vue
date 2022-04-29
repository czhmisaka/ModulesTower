<!--
 * @Date: 2022-04-28 21:57:48
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-28 23:17:13
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/gridDesktop.vue
-->

<template>
  <div class="baseGrid" :style="cusStyle"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { gridCell, gridCellMaker } from "./module/dataTemplate";
export default defineComponent({
  name: "gridDesktop",
  props: {
    cusStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      gridList: [] as Array<gridCell>,
    };
  },
  setup() {},
});
</script>

<style lang="scss" scoped>
.baseGrid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-template-rows: repeat(auto-fill, 100px);
}
</style>
