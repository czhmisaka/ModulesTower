<!--
 * @Date: 2022-04-28 21:57:48
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-27 14:38:59
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/gridDesktop.vue
-->

<template>
  <div ref="screenId" style="width: 100%; height: 100%">
    <grid-layout
      class="bases"
      :layout="gridListToLayout()"
      :col-num="gridColNum"
      :row-height="gridRowNumAndUnit().blockSize"
      :responsive="false"
      :isDraggable="baseData.editable"
      :isResizable="false"
      :vertical-compact="false"
      :prevent-collision="false"
      :use-css-transforms="true"
      :margin="[baseData.margin, baseData.margin]"
    >
      <grid-item
        v-for="(item, index) in gridListToLayout()"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        @move="gridItemOnMove"
        @resize="gridItemOnResize"
        class="grid-item"
        :style="{
          ...gridItemStyle(gridList[index]),
          transition: baseData.editable
            ? 'max-width 0.4s, width 0.3s , height 0.3s'
            : 'max-width 0.4s, transform 0.4s , width 0.3s , height 0.3s',
        }"
      >
        <card
          :ref="'card_' + index"
          :detail="{ ...gridList[index], index }"
          :baseData="baseData"
          :sizeUnit="gridRowNumAndUnit()"
          :gridList="gridList"
          :componentLists="componentLists"
          @onChange="(value, options) => cardOnChange(index, value, options)"
        />
      </grid-item>
    </grid-layout>
    <componentsListModal
      :gridList="gridList"
      :componentLists="componentLists"
      ref="componentsListModal"
      @onChange="
        (index, value) =>
          cardOnChange(index, value, {
            type: [cardOnChangeType.gridCardListonChange],
          })
      "
    />
    <cardEditModal
      :detail="baseData._componentDetail"
      ref="cardEdit"
      :gridList="gridList"
      :componentIndex="baseData._componentIndex"
      :sizeUnit="gridRowNumAndUnit()"
      :componentLists="componentLists"
      @onChange="
        (index, value) =>
          cardOnChange(index, value, {
            type: [cardOnChangeType.gridCardListonChange],
          })
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { deepMerge } from "@/components/basicComponents/grid/module/cardApi";
import cardEditModal from "@/components/basicComponents/grid/module/baseToolComponents/cardEditModal.vue";
import { testData } from "./module/testData";
import {
  cardOnChangeType,
  gridCellTemplate,
  CardComponentTemplate,
} from "./module/dataTemplate";
import { gridPositionByXY, outPutPositionAndGridSize } from "./module/util";
import componentsListModal from "@/components/basicComponents/grid/module/baseToolComponents/componentsListModal.vue";
import GridLayout from "@/components/basicComponents/grid/module/baseToolComponents/gridComponent/components/GridLayout.vue";
import GridItem from "@/components/basicComponents/grid/module/baseToolComponents/gridComponent/components/GridItem.vue";
import card from "@/components/basicComponents/grid/module/gridCard/card.vue";

let interval = null as any;
let componentBoxInfo = {} as {
  width: string | number;
  height: string | number;
};

export default defineComponent({
  name: "gridDesktop",
  components: {
    card,
    GridLayout,
    GridItem,
    cardEditModal,
    componentsListModal,
  },
  props: {
    // 自定样式
    cusStyle: {
      type: Object,
      default: () => {
        return {
          wholeScreen: false,
          maxRows: 12,
          margin: 10,
        } as {
          // 全屏幕展示
          wholeScreen: false;
          maxRows: number;
          margin: number;
          [key: string]: any;
        };
      },
    },

    // 可编辑状态 // 目前尚未实装功能
    editable: {
      type: Boolean,
      default: false,
    },

    // 渲染间隔
    gridColNum: {
      type: Number,
      default: 12,
    },

    // 可以使用的组件列表
    desktopData: {
      type: Array,
      default: () => {
        return testData as Array<gridCellTemplate>;
      },
    },

    componentLists: {
      type: Object,
      default: () => {
        return {} as { [key: string]: CardComponentTemplate };
      },
    },
  },
  computed: {},

  watch: {
    editable(val) {
      this.baseData.editable = val;
    },

    desktopData(val) {
      this.forceUpdateGridList();
    },
  },
  data() {
    return {
      cardOnChangeType,
      // 渲染用组件列表
      gridList: [],
      // 更新组件用
      updateTimes: 0,
      // 组件列表

      // 基础数据存放
      baseData: {
        margin: 12,
        editable: false,
        wholeScreen: false,
        _componentDetail: {},
        _componentIndex: -1,
      } as { [key: string]: any },
    };
  },
  methods: {
    gridPositionByXY,
    outPutPositionAndGridSize,

    // 列表修改
    setGridInfo(gridInfo: any, index: number): void {
      this.gridList[index].gridInfo = gridInfo;
    },

    // 输出gridLayout需要的数据
    gridListToLayout() {
      const back: Array<any> = this.gridList.map(
        (item: gridCellTemplate, index: number) => {
          let cell = outPutPositionAndGridSize(item);
          if (cell.x > this.gridColNum) cell.x = 0;
          if (cell.width > this.gridColNum) cell.width = this.gridColNum;
          return {
            x: cell.x,
            y: cell.y,
            w: cell.width,
            h: cell.height,
            i: index,
          };
        }
      );
      return back;
    },

    // 移动gridItem
    gridItemOnMove(i: number, x: number, y: number): void {
      this.gridList[i].setPosition(x, y);
    },

    // 形状编辑gridItem
    gridItemOnResize(i: number, newH = 0, newW = 0): void {
      this.gridList[i].setSize(newW, newH);
    },

    /**
     * @name: cardOnChange
     * @description: 卡片回传事件处理中心
     * @authors: CZH
     * @Date: 2022-05-12 15:29:55
     */
    async cardOnChange(
      index: number,
      value: any,
      options: {
        type: Array<cardOnChangeType>;
        [key: string]: any;
      }
    ) {
      options.type.map(async (type) => {
        console.log(
          index != -1 && index < this.gridList.length
            ? "组件「" + this.gridList[index].labelNameCN + "」"
            : "桌面组件",
          "请求执行事件<" + type + ">",
          JSON.parse(JSON.stringify(value))
        );
        if (type == cardOnChangeType.onChange) {
          for (let x in value) {
            this.baseData[x] = value[x];
          }
          this.baseData = { ...this.baseData };
        } else if (type == cardOnChangeType.upOnChange) {
          this.$emit("onChange", value);
        } else if (type == cardOnChangeType.forceRefresh) {
          const gridList = [...this.gridList];
          this.gridList = [];
          await this.$nextTick();
          this.gridList = gridList;
        } else if (type == cardOnChangeType.forceRefreshToOrgin) {
          this.gridList = [] as Array<gridCellTemplate>;
          await this.$nextTick();
          this.forceUpdateGridList();
          this.$forceUpdate();
        } else if (type == cardOnChangeType.gridCardListonChange) {
          if (index != -1) {
            this.gridList[index] = value[index];
          } else {
            this.gridList = [...value];
          }
        } else if (type == cardOnChangeType.cardConfigChange) {
          if (typeof value == "object") {
            const changeList = Object.keys(value);
            const needRefreshCardList = [] as number[];
            // debugger;
            this.gridList = this.gridList.map((card: gridCellTemplate, index: number) => {
              changeList.map((x: string) => {
                if (card.label == x) {
                  needRefreshCardList.push(index);
                  card = deepMerge(JSON.parse(JSON.stringify(value[x])), card);
                }
              });
              return card;
            });
            needRefreshCardList.map((item) => {
              if (this.$refs["card_" + item] && this.$refs["card_" + item].length > 0) {
                this.$refs["card_" + item][0].$forceUpdate();
              }
            });
          } else {
            console.error("输入数据有误", value);
          }
        } else if (type == cardOnChangeType.cardEdit) {
          this.baseData._componentDetail = this.gridList[index];
          this.baseData._componentIndex = index;
          await this.$nextTick();
          this.$refs?.cardEdit?.open();
        } else if (type == cardOnChangeType.cardDelete) {
          this.gridList.splice(index, 1);
        } else if (type == cardOnChangeType.openComponentsList) {
          this.$refs.componentsListModal.open();
        }
      });
    },

    /**
     * @name: gridRowNum
     * @description: 计算行数 和使用单位
     * @authors: CZH
     * @Date: 2022-05-04 18:14:23
     */
    gridRowNumAndUnit() {
      console.log("gridLayout", this.$refs["screenId"]);
      console.dir(this.$refs["screenId"]);
      let screen = {
        width:
          document.getElementById("screenId")?.offsetWidth || document.body.offsetWidth,
        height:
          document.getElementById("screenId")?.offsetHeight || document.body.offsetHeight,
        rowNum: 0,
        colNum: this.gridColNum,
        unit: "vw",
        blockSize: 0, // px单位的 单个grid单元大小
        margin: this.cusStyle?.margin || 12,
      };
      if (screen.height * 1 > screen.width * 1 || this.cusStyle.wholeScreen == true) {
        screen.rowNum = Math.floor(screen.width / (screen.height / this.gridColNum));
        screen.unit = "vh";
        screen.blockSize = screen.height / (this.cusStyle.maxRows || this.gridColNum);
      } else {
        screen.rowNum = Math.floor(screen.height / this.gridColNum);
        screen.blockSize =
          screen.unit == "vw"
            ? (screen.width -
                this.gridColNum * this.cusStyle.margin -
                this.cusStyle.margin) /
              this.gridColNum
            : screen.height / this.gridColNum;
      }
      return screen;
    },

    /**
     * @name: gridItemStyle
     * @description: 计算组件grid Item 属性的数据
     * @authors: CZH
     * @Date: 2022-08-18 18:16:17
     * @param {*} gridCell
     */
    gridItemStyle(gridCell: gridCellTemplate): { [key: string]: string } {
      let style: { [key: string]: string } = {};
      if (
        "options" in gridCell &&
        gridCell.options &&
        "showInGridDesktop" in gridCell.options
      ) {
        if (gridCell.options.showInGridDesktop) {
          style = {
            ...style,
            maxWidth: "10000px",
            zIndex: "100",
          };
        } else {
          style = {
            ...style,
            maxWidth: "100%",
            overflow: "hidden",
            zIndex: "1",
          };
        }
      }
      return style;
    },

    // 填充gridList
    forceUpdateGridList() {
      this.gridList = this.desktopData as Array<gridCellTemplate>;
    },
  },

  async mounted() {
    this.forceUpdateGridList();
    if (interval) clearInterval(interval);
    interval = setInterval(async () => {
      let width =
        document.getElementById("screenId")?.offsetWidth || document.body.offsetWidth;
      let height =
        document.getElementById("screenId")?.offsetHeight || document.body.offsetHeight;
      if (componentBoxInfo?.width != width || componentBoxInfo?.height != height) {
        this.$forceUpdate();
        this.updateTimes++;
        if (this.updateTimes > 99999) this.updateTimes = -11111;
      }
      componentBoxInfo = {
        width: width,
        height: height,
      };
    }, 500);
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
.grid-item {
  transition: max-width 0.4s;
}
.bgGridCell:hover {
  animation: hoverFadeInOut 1.2s infinite;
}
.gridCard {
  transition: all 0.3s;
}
</style>
