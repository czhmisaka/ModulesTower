<!--
 * @Date: 2022-04-28 21:57:48
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-07 15:55:31
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/gridDesktopEdit.vue
-->

<template>
  <grid-layout
    class="bases"
    :layout="gridListToLayout()"
    :col-num="gridColNum"
    :row-height="gridRowNumAndUnit.blockSize"
    :responsive="false"
    :vertical-compact="false"
    :prevent-collision="true"
    :use-css-transforms="true"
    :margin="[10, 10]"
  >
    <grid-item
      v-for="(item, index) in gridListToLayout()"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :key="item.i"
    >
      <card
        :detail="{ ...gridList[index], index }"
        :sizeUnit="gridRowNumAndUnit"
        @setGridInfo="
          (gridInfo) => {
            setGridInfo({ ...gridList[index] }, index);
          }
        "
      />
    </grid-item>
  </grid-layout>
  {{ gridList }}
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { testData } from "./module/testData";
import { gridCellTemplate } from "./module/dataTemplate";
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
    editable: {
      type: Boolean,
      default: false,
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
      gridList: [],
    };
  },
  methods: {
    gridPositionByXY,
    outPutPositionAndGridSize,

    // 列表修改
    setGridInfo(gridInfo: any, index: number): void {
      this.gridList[index].gridInfo = gridInfo;
    },

    gridListToLayout() {
      return this.gridList.map((item: gridCellTemplate, index: number) => {
        let cell = outPutPositionAndGridSize(item);
        return {
          x: cell.x,
          y: cell.y,
          w: cell.width,
          h: cell.height,
          i: index,
        };
      });
    },
  },
  async mounted() {
    console.log("mounted", this.$utils.deepClone(testData[0]), testData[0]);
    this.gridList.push(this.$utils.deepClone(testData[0]));
    this.gridList.push({
      ...testData[0],
      options: {
        props: {
          name: "Delete",
        },
      },
    });
    this.gridList[1].gridInfo.default.position.x = 4;
  },
});
</script>

<style lang="scss" scoped>
.baseGrid {
  width: 100vw;
  height: 100vh;
  display: grid;
}

.base {
  width: 100vw;
  height: 100vh;
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
