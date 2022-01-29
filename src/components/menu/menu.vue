<!--
 * @Date: 2021-12-30 19:40:51
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-29 10:11:35
 * @FilePath: /configforpagedemo/src/components/menu/menu.vue
-->
<template>
  <el-menu>
    <el-menu-item-group>
      
    </el-menu-item-group>
  </el-menu>
</template>

<script lang="ts">
import { menuCellTemplate } from "@/config/siteConfig/menu";
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    menuList: {
      type: Array,
      default: () => {
        return Array<menuCellTemplate>();
      },
    },
  },
  // setup() {},
});
</script>
