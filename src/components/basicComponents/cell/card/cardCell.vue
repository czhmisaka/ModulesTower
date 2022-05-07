<template>
  <el-card class="wholeBox">
    你说的对
    <slot></slot>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
});
</script>

<style lang="scss" scoped>
.wholeBox {
  width: 100%;
  height: 100%;
}
</style>
