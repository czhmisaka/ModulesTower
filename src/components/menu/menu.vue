<!--
 * @Date: 2021-12-30 19:40:51
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-28 17:59:33
 * @FilePath: /configforpagedemo/src/components/menu/menu.vue
-->
<template>
  <el-menu>
    <el-menu-item-group> </el-menu-item-group>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    menuList: {
      type: Array,
      default: () => {
        return [] as any[];
      },
    },
  },
  // setup() {},
});
</script>
