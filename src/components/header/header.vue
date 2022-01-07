<!--
 * @Date: 2021-12-30 19:40:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-07 21:21:24
 * @FilePath: /configforpagedemo/src/components/header/header.vue
-->
<template>
  <div class="header">
    <el-icon size="30" color="#000">
      <edit></edit>
    </el-icon>
    <edit></edit>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "header",
  porps: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    headerConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
.header {
  width: 100vw;
  height: 50px;
  box-shadow: 0px 0px 10px #ccc;
}
</style>