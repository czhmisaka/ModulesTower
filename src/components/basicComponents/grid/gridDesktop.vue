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
      gridTemplateColumns: `repeat(auto-fill, calc(100${gridRowNumAndUnit.unit} / ${gridColNum} )`,
      gridTemplateRows: `repeat(auto-fill, calc(100${gridRowNumAndUnit.unit} / ${gridColNum})`,
    }"
  >
    <div
      class="bgGridCell"
      v-for="index in gridColNum * gridRowNumAndUnit.rowNum"
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
      :style="{
        ...gridPositionByXY(outPutPositionAndGridSize(gridCard)),
        animation: 'hoverFadeInOut 0.3s',
      }"
    >
      <card
        :detail="{ ...gridCard, index }"
        :sizeUnit="gridRowNumAndUnit"
        @setGridInfo="
          (gridInfo) => {
            setGridInfo(gridInfo, index);
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
     * @description: 计算行数 和使用单位
     * @authors: CZH
     * @Date: 2022-05-04 18:14:23
     */
    gridRowNumAndUnit() {
      let screen = {
        width: window.innerWidth,
        height: window.innerHeight,
        rowNum: 0,
        unit: "vw",
        blockSize: 0, // px单位的 单个grid单元大小
      };
      if (screen.height * 1 > screen.width * 1) {
        screen.rowNum = Math.floor(screen.width / (screen.height / this.gridColNum));
        screen.unit = "vh";
      } else screen.rowNum = Math.floor(screen.height / (screen.width / this.gridColNum));
      screen.blockSize =
        screen.unit == "vw"
          ? screen.width / this.gridColNum
          : screen.height / this.gridColNum;
      return screen;
    },
  },
  data() {
    return {
      gridColNum: 12,
      // 可使用组件列表
      gridTypeList: testData,

      // 渲染用组件列表
      gridList: [testData[0]],
    };
  },
  methods: {
    gridPositionByXY,
    outPutPositionAndGridSize,

    // 列表修改
    setGridInfo(gridInfo: any, index: number): void {
      this.gridList[index].gridInfo = gridInfo;
    },
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
    background-color: rgba(0, 0, 0, 0);
  }
  50% {
    background-color: rgba(0, 0, 0, 0.5);
  }
  100% {
    background-color: rgba(0, 0, 0, 0);
  }
}

.bgGridCell {
  opacity: 0;
}
.bgGridCell:hover {
  animation: hoverFadeInOut 1.2s infinite;
}
.gridCard {
  transition: all 0.3s;
}
</style>
