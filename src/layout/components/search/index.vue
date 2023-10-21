<!--
 * @Date: 2023-02-14 17:29:00
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-18 23:01:19
 * @FilePath: /ConfigForDesktopPage/src/layout/components/search/index.vue
-->
<script lang="ts" setup>
import { SearchModal } from "./components";
import { useBoolean } from "../../hooks/useBoolean";
import { isMobile } from "@/utils/Env";
const { bool: show, toggle } = useBoolean();
function handleSearch() {
  // toggle();
  if (isMobile()) {
    window.open("/#/photoWebSiteModule/CHOSSEARCHS");
  } else {
    window.open("/#/photoWebSiteModule/CHOSSEARCH");
  }
}
</script>

<template>
  <!-- <div class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover" @click="handleSearch">
    <IconifyIconOffline icon="search" />
  </div>
  <SearchModal v-model:value="show" /> -->
</template>
