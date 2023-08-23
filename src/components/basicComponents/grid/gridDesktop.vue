<!--
 * @Date: 2022-04-28 21:57:48
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-23 23:18:25
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/gridDesktop.vue
-->

<template>
  <div
    :ref="'screenId_' + idRandom"
    :id="'screenId_' + idRandom"
    :style="{
      transition: 'transform 0.3s',
      overflow: cusStyle.wholeScreen ? '' : '',
      transform: cusStyle.testProps ? 'rotateX(60deg) rotateZ(-30deg) scale(1.3) ' : '',
      ...cusStyleProps,
    }"
    class="baseGrid"
  >
    <grid-layout
      :layout="gridListToLayout()"
      :col-num="gridColNum"
      :row-height="gridRowNumAndUnit.blockSize"
      :responsive="false"
      :isDraggable="baseData.editable"
      :isResizable="false"
      :vertical-compact="false"
      :prevent-collision="false"
      :use-css-transforms="true"
      :maxRows="cusStyle.maxRows || 30"
      :margin="[gridRowNumAndUnit.margin, gridRowNumAndUnit.margin]"
    >
      <div
        :class="'grayBg ' + (hightLightComponentsList.length > 0 ? 'grayBg_Active' : '')"
        :style="{
          zIndex: hightLightComponentsList.length > 0 ? 20000 : -1,
          width: hightLightControler.show ? '100vw' : '0px',
          height: hightLightControler.show ? '100vh' : '0px',
        }"
      ></div>
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
          transition: noAnimate
            ? ''
            : baseData.editable
            ? fastMode
              ? 'max-width 0.4s, width 0.3s , height 0.3s'
              : ''
            : fastMode
            ? 'max-width 0.4s, transform 0.5s ease-in-out , width 0.3s , height 0.3s'
            : '',
        }"
      >
        <card
          :ref="'card_' + index"
          :detail="{ ...gridList[index], index }"
          :baseData="baseData"
          :sizeUnit="gridRowNumAndUnit"
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
      :sizeUnit="gridRowNumAndUnit"
      :componentLists="componentLists"
      @onChange="
        (index, value) =>
          cardOnChange(index, value, {
            type: [cardOnChangeType.gridCardListonChange],
          })
      "
    />
    <component
      v-for="item in Object.keys(PlugInComponents)"
      :is="PlugInComponents[item]"
      :ref="`PlugIn_${item}`"
      :plugInData="plugInData[item]"
      :baseData="baseData"
      :gridList="gridList"
      :componentLists="componentLists"
      @onChange="(value, options) => cardOnChange(-1, value, options)"
    ></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from "vue";
import { getAction } from "@/router/util";
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
import card from "@/components/basicComponents/grid/module/gridCard/card.vue";
import gridLayout from "./GridLayout/GridLayout.vue";
import gridItem from "./GridLayout/GridItem.vue";

let useAble = 0;
export default defineComponent({
  name: "gridDesktop",
  components: {
    card,
    gridLayout,
    gridItem,
    cardEditModal,
    componentsListModal,
  },
  setup() {
    const PlugInComponents = shallowRef(getAction()["getAllPluginComponent"]());
    return {
      PlugInComponents,
    };
  },
  props: {
    // 自定样式
    cusStyle: {
      type: Object,
      default: () => {
        return {
          wholeScreen: false,
          maxRows: 12,
          margin: 0,
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

    // 当前桌面使用的组件数据
    desktopData: {
      type: Array,
      default: () => {
        return testData as Array<gridCellTemplate>;
      },
    },

    // 可以使用的组件列表
    componentLists: {
      type: Object,
      default: () => {
        return {} as { [key: string]: CardComponentTemplate };
      },
    },

    // 动画加速模式 / gpu
    fastMode: {
      type: Boolean,
      default: true,
    },

    // 无动画模式
    noAnimate: {
      type: Boolean,
      default: false,
    },

    // 桌面配置方案预置数据
    preBaseData: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },

    modelValue: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },
  },
  computed: {},

  watch: {
    moduleValue: {
      handler(val) {
        this.baseData = {
          ...this.baseData,
          ...val,
        };
      },
      deep: true,
      immediate: true,
    },
    preBaseData(val) {},
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
      gridList: [] as gridCellTemplate[],
      // 更新组件用
      updateTimes: 0,

      // 插入式能力组件列表
      // PlugInComponents: {},
      // 插入式组件数据使用列表
      plugInData: {},

      // 基础数据存放
      baseData: {
        margin: 0,
        editable: false,
        wholeScreen: false,
        _componentDetail: {},
        _componentIndex: -1,
      } as { [key: string]: any },

      idRandom: (useAble += Math.random()),

      // 高光组件列表
      hightLightComponentsList: [] as string[],
      hightLightControler: {
        show: false,
        timeOut: null,
      },

      // 桌面组件配置
      cusStyleProps: {} as { [key: string]: any },

      gridRowNumAndUnit: {} as any,
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

    /**
     * @name: gridRowNum
     * @description: 计算行数 和使用单位
     * @authors: CZH
     * @Date: 2022-05-04 18:14:23
     */
    gridRowNumAndUnitDeal() {
      let width = 0;
      let height = 0;
      if (this.$refs["screenId_" + this.idRandom]) {
        width = this.$refs["screenId_" + this.idRandom].offsetWidth;
        height = this.$refs["screenId_" + this.idRandom].offsetHeight;
      }
      let screen = {
        width: width || document.body.offsetWidth,
        height: height || document.body.offsetHeight,
        rowNum: 0,
        colNum: this.gridColNum,
        unit: "vw",
        blockSize: 0, // px单位的 单个grid单元大小
        colSize: 0,
        margin: this.cusStyle?.margin || 12,
      };
      if (this.cusStyle.wholeScreen == true) {
        screen.rowNum = Math.floor(screen.width / (screen.height / this.gridColNum));
        screen.unit = "vh";
        let rowOrColKey = this.cusStyle.maxRows || this.gridColNum;
        screen.blockSize =
          (screen.height - screen.margin * (rowOrColKey + 1)) / rowOrColKey;
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
      this.gridRowNumAndUnit = screen;
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
      },
      name = ""
    ) {
      options.type.map(async (type) => {
        if (index != -1)
          console.log(
            index < this.gridList.length
              ? "组件「" + this.gridList[index].labelNameCN + "」"
              : "桌面组件",
            "请求执行事件<" + type + ">",
            value
          );
        else
          console.log(
            `插入式能力组件「${name}」请求事件<${type}>`,
            JSON.parse(JSON.stringify(value))
          );
        if (type == cardOnChangeType.onChange) {
          for (let x in value) {
            this.baseData[x] = value[x];
          }
          this.baseData = { ...this.baseData };
        } else if (type == cardOnChangeType.upOnChange) {
          this.$emit("update:modelValue", value);
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
        } else if (type == cardOnChangeType.cardConfigChange) {
          if (typeof value == "object") {
            const changeList = Object.keys(value);
            const needRefreshCardList = [] as number[];
            // debugger;
            this.gridList = this.gridList.map((card: gridCellTemplate, index: number) => {
              changeList.map((x: string) => {
                if (card.label == x) {
                  needRefreshCardList.push(index);
                  card = deepMerge(value[x], card);
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
        } else if (type == cardOnChangeType.cardConfigChangeNoMerge) {
          if (typeof value == "object") {
            const changeList = Object.keys(value);
            const needRefreshCardList = [] as number[];
            // debugger;
            this.gridList = this.gridList.map((card: gridCellTemplate, index: number) => {
              changeList.map((x: string) => {
                if (card.label == x) {
                  needRefreshCardList.push(index);
                  for (let c in value[x]) {
                    card.options.props[c] = value[x][c];
                  }
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
        } else if (type == cardOnChangeType.hightLightCard) {
          if (this.hightLightControler.timeOut)
            clearTimeout(this.hightLightControler.timeOut);
          if (typeof value == "object" && value.length > 0) {
            const cardLabelList = this.gridList.map((card: gridCellTemplate) => {
              return card.label;
            });
            this.hightLightControler.show = true;
            value.map((cardLabel) => {
              if (
                cardLabelList.indexOf(cardLabel) > -1 &&
                this.hightLightComponentsList.indexOf(cardLabel) == -1
              )
                this.hightLightComponentsList.push(cardLabel);
            });
          } else {
            this.hightLightComponentsList = [];
            const that = this;
            this.hightLightControler.timeOut = setTimeout(() => {
              that.hightLightControler.show = false;
            }, 300);
          }
        } else if (type == cardOnChangeType.cardEdit) {
          this.baseData._componentDetail = this.gridList[index];
          this.baseData._componentIndex = index;
          await this.$nextTick();
          this.$refs?.cardEdit?.open();
        } else if (type == cardOnChangeType.gridCardListonChange) {
          if (index != -1) {
            this.gridList[index] = value[index];
          } else {
            this.gridList = [...value];
          }
        } else if (type == cardOnChangeType.cardAdd) {
          // 这里写的尽量简单了，后期优化
          if (value) {
            this.gridList = this.gridList.concat([value]);
          }
        } else if (type == cardOnChangeType.cardDelete) {
          if (value.length > 0) {
            this.gridList = this.gridList.filter((x) => {
              return value.indexOf(x.label) == -1;
            });
          } else this.gridList.splice(index, 1);
        } else if (type == cardOnChangeType.openComponentsList) {
          this.$refs.componentsListModal.open();
        } else if (type == cardOnChangeType.moduleApi) {
          if (typeof value == "object") {
            for (let refs in value) {
              if (this.$refs[`PlugIn_${refs}`]) {
                const plugInComponent = this.$refs[`PlugIn_${refs}`][0];
                if (!value[refs]) {
                  if (plugInComponent && plugInComponent["close"]) {
                    plugInComponent["close"]();
                  }
                } else {
                  this.plugInData[refs] = value[refs];
                  if (plugInComponent && plugInComponent["open"]) {
                    plugInComponent["open"]();
                  }
                }
              }
            }
          } else if (type == cardOnChangeType.changeDesktopProperties) {
            if (typeof value == "object") this.cusStyleProps = value;
          }
        }
      });
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
            maxWidth: "10000px",
            zIndex:
              this.hightLightComponentsList.indexOf(gridCell.label) > -1
                ? "20001"
                : "100",
            opacity: "1",
          };
        } else {
          style = {
            maxWidth: "100%",
            opacity: "0",
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

  async created() {
    if (this.preBaseData && Object.keys(this.preBaseData).length > 0)
      Object.keys(this.preBaseData).map((key) => {
        this.baseData[key] = this.preBaseData[key];
      });

    // 添加触发器
    const that = this;
    const data = {};
    const name = "griddesktop_func_" + this.idRandom;
    data[name] = that.gridRowNumAndUnitDeal;
    window.addEventListener("resize", data[name]);
  },

  async unmounted() {
    // 删除触发器
    const that = this;
    const data = {};
    const name = "griddesktop_func_" + this.idRandom;
    data[name] = that.gridRowNumAndUnitDeal;
    window.removeEventListener("resize", data[name]);
  },

  async mounted() {
    this.forceUpdateGridList();
    const that = this;
    // that.gridRowNumAndUnitDeal();
    setTimeout(() => {
      that.gridRowNumAndUnitDeal();
    }, 100);
  },
});
</script>

<style lang="scss" scoped>
.baseGrid {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}
.grayBg {
  background-size: 4px 4px;
  transition: background-color 0.3s, background-image 0.3s, background-size 0.3s,
    backdrop-filter 0.3s;
  position: fixed;
  top: 0px;
  left: 0px;
  background-image: radial-gradient(transparent 2px, var(--bg-color) 2px);
  backdrop-filter: saturate(50%) blur(4px);
}
.grayBg_Active {
  background-color: rgba(0, 0, 0, 0.3);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
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
  transition: opacity 0.4;
}
.bgGridCell:hover {
  animation: hoverFadeInOut 1.2s infinite;
}
</style>
