<!--
 * @Date: 2022-05-30 10:48:53
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-15 19:53:23
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/componentsListModal.vue
-->

<template>
  <div
    :class="'background ' + (modalStatus.isOpen ? 'open' : 'close')"
    @click="modalStatus.isOpen = false"
  >
    <div class="content" @click.stop="() => {}">
      <div
        class="cell"
        v-for="(item, index) in Object.keys({ ...componentMap, ...componentLists })"
        :key="index + '_component'"
        :style="{
          cursor: 'pointer',
          userSelect: 'none',
        }"
        @dblclick="addComponent(item)"
        @touchend="addComponent(item)"
      >
        <componentsIconCard
          :cardComponents="{ ...componentMap, ...componentLists }[item]"
          :sizeUnit="sizeUnit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { componentLists } from "@/components/basicComponents/grid/module/gridCard/module/componentLists";
import componentsIconCard from "./componentsIconCard.vue";
import {
  cardOnChangeType,
  gridCellMaker,
  cardComponentType,
  gridCellTemplate,
  CardComponentTemplate,
} from "../dataTemplate";
import { translate } from "element-plus";
export default defineComponent({
  props: ["sizeUnit", "gridList", "componentLists"],
  components: {
    componentsIconCard,
  },
  data() {
    return {
      componentMap: componentLists,

      // 显示状态控制
      modalStatus: {
        isOpen: false,
      } as {
        [key: string]: any;
      },
    };
  },
  methods: {
    open() {
      this.modalStatus.isOpen = true;
    },

    // 添加组件
    addComponent(name: string) {
      const comp = { ...this.componentMap, ...this.componentLists }[
        name
      ] as CardComponentTemplate;
      let newComp: gridCellTemplate = gridCellMaker(
        name,
        name,
        {},
        {
          name,
          type: cardComponentType.componentList,
        },
        {
          props: {
            ...comp.settngDetail.baseProps,
          },
        }
      );
      if (comp.compontentInfo && comp.compontentInfo.group == "settingTool") {
        newComp.options = {
          ...newComp.options,
          isSettingTool: true,
        };
      }
      if (comp.compontentInfo && comp.compontentInfo.gridInfo) {
        const size =
          comp.compontentInfo.gridInfo[Object.keys(comp.compontentInfo.gridInfo)[0]];
        newComp.setSize(size.width, size.height);
      }
      this.modalStatus.isOpen = false;
      const gridList = [...this.gridList].concat([newComp]);
      this.$emit("onChange", this.gridList.length, gridList, {
        type: [cardOnChangeType.gridCardListonChange, cardOnChangeType.cardEdit],
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.background {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
  opacity: 0.7;
  top: 0px;
  left: 0px;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.05);
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  .content {
    width: 80vw;
    height: 80vh;
    margin: 10vh 10vw;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .cell {
      width: 16vw;
      height: 16vw;
      // background-color: #fff;
      // box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      margin: 1.6vw;
      border-radius: 6px;
      text-align: center;
    }
  }

  .content::-webkit-scrollbar {
    width: 4px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.2);
  }
  .content::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.2);
  }
  .content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #555;
  }
}
.open {
  opacity: 1;
  z-index: 100000;
  transform: translate(0%);
  .formModalBox {
    transform: scale(1);
  }
}

.close {
  transform: translate(100%);
}
</style>
