<!--
 * @Date: 2022-04-28 21:57:48
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-29 15:39:24
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/gridDesktop.vue
-->

<template>
  <div
    class="baseGrid"
    :style="{
      gridTemplateColumns: 'repeat(auto-fill, calc(100vw / ' + gridColNum + ')',
      gridTemplateRows: 'repeat(auto-fill, calc(100vw / ' + gridColNum + ')',
    }"
  >
    <div
      class="bgGridCell"
      v-for="index in gridColNum * gridRowNum"
      :key="`${index}_${index / gridColNum}_gridPosition`"
      :style="
        gridPositionByXY(Math.floor(index / gridColNum) + 1, index % gridColNum, 1, 1, {
          zIndex: 1,
        })
      "
      @hover="hoverGridCell(index)"
    ></div>
    <div class="gridCard"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { testData } from "./module/testData";
import { gridPositionByXY } from "./module/util";
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
  computed: {
    gridRowNum() {
      /**
       * 计算行数
       */
      let screen = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      return Math.floor(screen.height / (screen.width / this.gridColNum));
    },
  },
  data() {
    return {
      gridColNum: 24,
      gridList: testData,
    };
  },
  methods: {
    gridPositionByXY,
  },
});
</script>

<style lang="scss" scoped>
.baseGrid {
  width: 100vw;
  height: 100vh;
  display: grid;
}

@keyframes hoverFadeInOut {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}

.bgGridCell {
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.bgGridCell:hover {
  animation: hoverFadeInOut 1.2s infinite;
}
</style>
