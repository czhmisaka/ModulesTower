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
    <div
      class="gridCard"
      v-for="(gridCard, index) in gridList"
      :key="index + '_gridCard'"
      :style="gridPositionByXY(outPutPositionAndGridSize(gridCard))"
    >
      {{ gridPositionByXY(outPutPositionAndGridSize(gridCard)) }}
      <card :detail="{ ...gridCard, index }" />
      <component :is="componentMap.get('iconCell')" :name="'Delete'"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { componentMap } from "./module/gridCard/module/componentsList";
import { testData } from "./module/testData";
import { gridPositionByXY, outPutPositionAndGridSize } from "./module/util";
import card from "@/components/basicComponents/grid/module/gridCard/card.vue";
export default defineComponent({
  name: "gridDesktop",
  components: { card },
  props: {
    cusStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    /**
     * @name: gridRowNum
     * @description: 计算行数
     * @authors: CZH
     * @Date: 2022-05-04 18:14:23
     */
    gridRowNum() {
      let screen = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      return Math.floor(screen.height / (screen.width / this.gridColNum));
    },
  },
  data() {
    return {
      componentMap,
      gridColNum: 4,
      // 可使用组件列表
      gridTypeList: testData,

      // 渲染用组件列表
      gridList: [testData[0]],
    };
  },
  methods: {
    gridPositionByXY,
    outPutPositionAndGridSize,
  },
  async mounted() {},
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
