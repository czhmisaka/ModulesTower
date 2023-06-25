<script setup lang="ts">
import { ref } from "vue";
import { noticesData } from "./data";
import NoticeList from "./noticeList.vue";
import { templateRef } from "@vueuse/core";
import { Tabs, TabPane } from "@pureadmin/components";
import { useCartHook } from "@/store/modules/cart";
import { useRouter } from "vue-router";
import { useTags } from "@/layout/hooks/useTag";

const dropdownDom = templateRef<ElRef | null>("dropdownDom", null);
const activeName = ref(noticesData[0] ? noticesData[0].name : "");

const cart = useCartHook();
cart.getCart();
let noticesNum = cart.count;
function tabClick() {
  (dropdownDom as any).value.handleOpen();
}
const { router } = useTags();

function toCart() {
  router.push({ path: "/photoWebSiteModule/MYPICTURE" });
}
</script>

<template>
  <el-dropdown ref="dropdownDom" trigger="click" placement="bottom-end">
    <span class="dropdown-badge navbar-bg-hover select-none" @click="toCart">
      <el-badge v-if="useCartHook().count > 0" :value="useCartHook().count" :max="99">
        <span class="header-notice-icon">
          <!-- <IconifyIconOffline icon="cart" /> -->
          <el-icon><ShoppingCart /></el-icon>
        </span>
      </el-badge>
      <span class="header-notice-icon" v-else>
        <!-- <IconifyIconOffline icon="cart" /> -->
        <el-icon><ShoppingCart /></el-icon>
      </span>
    </span>
    <!-- <template #dropdown>
      <el-dropdown-menu>
        <Tabs
          centered
          class="dropdown-tabs"
          v-model:activeName="activeName"
          @tabClick="tabClick"
        >
          <template v-for="item in notices" :key="item.key">
            <TabPane :tab="`${item.name}(${item.list.length})`">
              <el-scrollbar max-height="330px">
                <div class="noticeList-container">
                  <NoticeList :list="item.list" />
                </div>
              </el-scrollbar>
            </TabPane>
          </template>
        </Tabs>
      </el-dropdown-menu>
    </template> -->
  </el-dropdown>
</template>

<style>
.ant-tabs-dropdown {
  z-index: 2900 !important;
}
</style>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 60px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  width: 336px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  border-radius: 4px;

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-scroll) {
    display: flex;
    justify-content: center;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.noticeList-container) {
    padding: 15px 24px 0 24px;
  }
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}
</style>
