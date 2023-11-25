<!--
 * @Date: 2023-09-13 14:37:24
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-13 16:46:28
-->
<template>
  <el-dropdown trigger="click">
    <div class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover">
      <el-icon><Menu /></el-icon>
    </div>
    <template #dropdown>
      <modulesLIst></modulesLIst>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import modulesLIst from "@/layout/components/modules/modulesLIst.vue";
import { Menu } from "@element-plus/icons-vue";
</script>
