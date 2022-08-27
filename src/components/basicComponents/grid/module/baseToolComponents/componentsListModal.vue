<!--
 * @Date: 2022-05-30 10:48:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-27 16:06:09
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/componentsListModal.vue
-->

<template>
  <div
    class="background"
    :style="{
      zIndex: modalStatus.isOpen ? '1000000000' : '-1',
      opacity: modalStatus.isOpen ? '1' : '0',
    }"
    @click="modalStatus.isOpen = false"
  >
    <div class="content" @click.stop="() => {}">
      <div
        class="cell"
        v-for="(item, index) in componentLists"
        :key="index + '_component'"
        :style="{
          cursor: 'pointer',
          userSelect: 'none',
        }"
        @dblclick="addComponent(item)"
      >
        {{ componentMap[item] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { componentLists } from "@/components/basicComponents/grid/module/gridCard/module/componentLists";
import {
  cardOnChangeType,
  gridCellMaker,
  cardComponentType,
  gridCellTemplate,
  CardComponentTemplate,
} from "../dataTemplate";
export default defineComponent({
  props: ["sizeUnit", "gridList"],
  components: {
    // componentsIconCard,
  },
  data() {
    return {
      componentMap: componentLists,
      componentLists: Object.keys(componentLists),

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
      const comp = this.componentMap[name] as CardComponentTemplate;
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
  z-index: 1000;
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.6);
  z-index: -1;
  transition: all 0.4s;
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
      width: 10vw;
      height: 10vw;
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
</style>
