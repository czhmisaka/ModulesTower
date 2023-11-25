<script setup lang="ts">
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import { ref, watch, nextTick, onMounted, reactive, toRefs } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import SidebarItem from "./sidebarItem.vue";
import { useNav } from "@/layout/hooks/useNav";
import { usePermissionStoreHook } from "@/store/modules/permission";
import userInfoCard from "@/modules/userManage/component/userCard/userInfoCard.vue";

const menuRef = ref();

const {
  route,
  title,
  routers,
  logout,
  backHome,
  onPanel,
  menuSelect,
  username,
  avatarsStyle,
} = useNav();

nextTick(() => {
  menuRef.value?.handleResize();
});

watch(
  () => route.path,
  () => {
    menuSelect(route.path, routers);
  }
);
const { moduleList, checkModule } = useModuleHook();
const { nowModule } = toRefs(useModuleHook());
const userInfo = reactive({ data: null, userTemplate: [] });
userInfo.data = async () => {
  return await useUserStoreHook().getOptions();
};
onMounted(async () => {
  const userFieldTemplate = await (await userFieldStorage()).getAll();
  const userTemplate = [
    ...userTableCellStorage.getByKeyArr(["name", "icon", "mobile"]),
    ...userFieldTemplate,
  ];
  userInfo.userTemplate = userTemplate;
});
import { userTableCellStorage } from "@/modules/userManage/PageConfigData/main";
import { userFieldStorage } from "@/modules/userManage/PageConfigData/user/userValueManage";
import { useModuleHook } from "@/store/modules/module";
import { useUserStoreHook } from "@/store/modules/user";
</script>

<template>
  <div class="horizontal-header">
    <!-- <div class="horizontal-header-left" @click="backHome">
      <FontIcon icon="team-iconlogo" svg style="width: 35px; height: 35px" />
      <h4>{{ title }}</h4>
    </div> -->
    <el-menu
      router
      ref="menuRef"
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="route.path"
      @select="(indexPath) => menuSelect(indexPath, routers)"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 菜单搜索 -->
      <Search />
      <!-- 通知 -->
      <Notice id="header-notice" />
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <!-- <img
            src="https://avatars.githubusercontent.com/u/22533472?v=4"
            :style="avatarsStyle"
          /> -->
          <p v-if="username" class="dark:text-white">
            {{ username }}
          </p>
        </span>
        <template #dropdown>
          <userInfoCard
            class="userInfoCard"
            :userInfo="userInfo.data"
            :showTemplate="userInfo.userTemplate"
          />
          <!-- 模块选择操作 -->
          <cardBg
            :class="`modulesItem ${
              nowModule.name == item.name ? 'modulesItem_active' : ''
            }`"
            :cus-style="{
              display: 'flex',
              backgroundImage: `linear-gradient(135deg, ${
                item.icon[0] == '{' ? JSON.parse(item.icon).color : 'rgba(0,0,0,0.05)'
              } -200%, rgba(0,0,0,0) 40%)`,
              backdropFilter: 'saturate(50%) blur(4px)',
            }"
            v-for="(item, index) in moduleList"
            @click="nowModule.name != item.name ? checkModule(index) : ''"
          >
            <component
              :size="'16px'"
              :style="{ margin: '2px 6px 0px 0px', lineHeight: '1em' }"
              :is="
                useRenderIcon(
                  item.icon[0] == '{' ? JSON.parse(item.icon) : useRenderIcon(item.icon)
                )
              "
            />
            {{ item.name }}
          </cardBg>
        </template>
      </el-dropdown>
      <span class="set-icon navbar-bg-hover" title="打开项目配置" @click="onPanel">
        <IconifyIconOffline icon="setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}

.horizontal-header-right {
  display: flex;
  min-width: 280px !important;
  height: 48px;
  align-items: center;
  color: #000000d9;
  justify-content: flex-end;
}
.userInfoCard {
  width: 200px !important;
  height: 80px !important;
  margin: 6px;
}

.modulesItem {
  margin: 0 6px 6px;
  padding: 6px 12px;
  width: calc(100% - 12px) !important;
  transition: all 0.4s;
  cursor: pointer;
  font-weight: 600;
  background-repeat: no-repeat !important;
  background-size: 100% !important;
  background-position: -40px !important;
}
.modulesItem:hover {
  background-position: 0px !important;
}
.modulesItem_active {
  background-position: 0px !important;
}
</style>
