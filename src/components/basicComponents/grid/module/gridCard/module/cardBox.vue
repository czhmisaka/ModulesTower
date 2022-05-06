<!--
 * @Date: 2022-05-05 00:07:38
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-05 00:07:38
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/module/cardBox.vue
-->

<template>
  <vue-drag-resize
    :isActive="true"
    :w="detail.gridInfo.default.size.width * blockSize"
    :h="detail.gridInfo.default.size.height * blockSize"
    :x="0"
    :y="0"
    v-on:resizing="resize"
    v-on:dragging="resize"
    class="moveBox"
  >
    <slot></slot>
  </vue-drag-resize>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
    blockSize: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    // 计算回传值
    computedUnit(size: number): number {
      return Math.round(size / this.blockSize) + 1;
    },

    // 触发resize事件
    resize(newReact: any) {
      console.log(newReact, "qwe");
      if (newReact.w || newReact.h)
        this.$emit("resize", {
          width: this.computedUnit(newReact.w) || this.detail.gridInfo.default.size.width,
          height:
            this.computedUnit(newReact.h) || this.detail.gridInfo.default.size.height,
        });
      if (newReact.x || newReact.y)
        this.$emit("move", {
          x: this.computedUnit(newReact.y) || this.detail.gridInfo.default.position.y,
          y: this.computedUnit(newReact.x) || this.detail.gridInfo.default.position.x,
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.moveBox {
  overflow: hidden;
  transition: background 0.1s;
  top: 0px;
  left: 0px;
}
.moveBox:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
