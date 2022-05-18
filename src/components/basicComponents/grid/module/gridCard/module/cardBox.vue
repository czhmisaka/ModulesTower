<!--
 * @Date: 2022-05-05 00:07:38
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-11 10:08:31
 * @FilePath: /o2oaweb/src/thirdThemeComponents/grid/module/gridCard/module/cardBox.vue
-->

<template>
  <div class="dragBox" :draggable="true">
    <slot></slot>
  </div>
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
  data() {
    return {
      dragStatus: false,
      checkTick: 0,
    };
  },

  methods: {
    // 计算回传值
    computedUnit(size: number): number {
      return Math.round(size / this.blockSize) + 1;
    },
  },
});
</script>

<style lang="scss" scoped>
.dragBox {
  overflow: hidden;
  top: 0px;
  left: 0px;
  position: absolute;
}
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
