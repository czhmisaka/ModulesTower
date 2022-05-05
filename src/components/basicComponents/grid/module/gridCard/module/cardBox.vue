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
    v-on:resizing="resize"
    v-on:dragging="resize"
    class="moveBox"
  >
    {{ detail }}

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
    resize(newReact: any) {
      console.log(newReact, "qwe");
      this.$emit("resize", {
        width: newReact.w,
        height: newReact.h,
      });
    },
  },
  setup() {},
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
