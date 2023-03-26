<!--
 * @Date: 2023-02-14 17:29:00
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-27 00:31:02
 * @FilePath: /ConfigForDesktopPage/src/layout/components/search/index.vue
-->
<script lang="ts" setup>
import { SearchModal } from "./components";
import { useBoolean } from "../../hooks/useBoolean";
const { bool: show, toggle } = useBoolean();
function handleSearch() {
  // toggle();
  window.open("/#/photoWebSiteModule/CHOSSEARCH");
}
</script>

<template>
  <div
    class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover"
    @click="handleSearch"
  >
    <IconifyIconOffline icon="search" />
  </div>
  <SearchModal v-model:value="show" />
</template>
