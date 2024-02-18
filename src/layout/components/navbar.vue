<script setup lang="ts">
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import { getConfig } from "@/utils/config/appConfig";
import mixNav from "./sidebar/mixNav.vue";
import { useNav } from "@/layout/hooks/useNav";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import topCollapse from "./sidebar/topCollapse.vue";
import { useModuleHook } from "@/store/modules/module";
import { useUserStore, useUserStoreHook } from "@/store/modules/user";
import userInfoCard from "@/modules/userManage/component/userCard/userInfoCard.vue";
import { onMounted, reactive } from "vue";
import { post } from "@/utils/api/requests";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { toRefs } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { btnActionTemplate } from "@/modules/userManage/types";
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { useAppStoreHook } from "@/store/modules/app";
import { removeToken } from "@/utils/auth";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { resetRouter } from "@/router";
import { useRouter } from "vue-router";
import { loginPage } from "@/router/index";
import modulesTag from './modules/modulesTag.vue';
import { ElMessage } from 'element-plus';
import {
  useDark,
  debounce,
  useGlobal,
  storageLocal,
  storageSession,
} from "@pureadmin/utils";
const {
  body,
  dataTheme,
  layoutTheme,
  themeColors,
  dataThemeChange,
  setEpThemeColor,
  setLayoutThemeColor,
} = useDataThemeChange();
const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  avatarsStyle,
  toggleSideBar,
} = useNav();
const userInfo = reactive({ data: null, userTemplate: [] });
userInfo.data = async () => {
  let data = await useUserStoreHook().getOptions();
  return data
};
onMounted(async () => {});
function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}
const router = useRouter();

const loginOutBtn = btnMaker("登出", btnActionTemplate.Function, {
  elType: "danger",
  icon: 'SwitchButton',
  function: async (that, data) => {
    await useUserStoreHook().logOut()
  },
});

const toUserCenterBtn = btnMaker('个人中心', btnActionTemplate.Function, {
  icon: 'UserFilled',
  elType: 'primary',
  function: async (that, data) => {
    ElMessage.warning('组件正在开发中')
  }
})
</script>

<template>
  <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0, 21, 41, 0.08)] dark:shadow-[#0d0d0d]">
    <topCollapse v-if="device === 'mobile'" class="hamburger-container" :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar" />

    <div v-if="layout !== 'mix' && device !== 'mobile'" class="breadcrumb-container"
      style="font-size: 1.2em;height: 100%;width: 200px;line-height: 48px;text-align: left;display: flex;justify-content: space-between;">
      {{ useNav().title.value }}
      <el-divider direction="vertical" v-if="layout !== 'mix' && device !== 'mobile'" style="margin: auto 6px;" />
    </div>
    <Breadcrumb v-if="layout !== 'mix' && device !== 'mobile'" class="breadcrumb-container" />

    <mixNav v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 模块切换 -->
      <modulesTag />
      <!-- 菜单搜索 -->
      <!-- <Search /> -->
      <!-- 通知 -->
      <!-- <Notice id="header-notice" /> -->
      <!-- 退出登录 -->
      <el-divider direction="vertical" />

      <el-dropdown trigger="click">
        <!-- <span class="el-dropdown-link navbar-bg-hover select-none"> -->
        <span class="el-dropdown-link select-none">
          <!-- <p v-if="username" class="dark:text-white navBarWord"> -->
          <p v-if="username" class="navBarWord">
            {{ username }}
            <el-icon style="transform: translateY(2px);">
              <ArrowDown />
            </el-icon>
          </p>
        </span>
        <template #dropdown>
          <userInfoCard class="userInfoCard" :userInfo="userInfo.data" :showTemplate="userInfo.userTemplate"
            :main-action-btn-list="[toUserCenterBtn]" :btnList="[loginOutBtn]" />
        </template>
      </el-dropdown>

      <el-divider direction="vertical" />

      <!-- 用户登陆 -->

      <span class="set-icon navbar-bg-hover" title="打开项目配置" @click="onPanel">
        <IconifyIconOffline icon="setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;
  background: $navBarColor !important;

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    min-width: 280px;
    height: 48px;
    height: 100%;
    align-items: center;
    //color: #000000d9;
    justify-content: flex-end;

    .el-dropdown-link {
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
    width: auto;
    height: auto;
  }
}

.logout {
  max-width: 300px;

  :deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}

.userInfoCard {
  width: 300px !important;
  margin: 6px;
  overflow: hidden;
}
</style>
