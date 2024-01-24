<!--
 * @Date: 2023-10-09 10:22:33
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-22 22:18:06
 * @FilePath: /ConfigForDesktopPage/src/modules/ApplicationManage/component/headerBar/headerBar.vue
-->
<template>
  <CardBg
    :cusStyle="{
      width: '100%',
      padding: '0px',
      borderRadius: '0px',
      overflow: 'hidden',
      backgroundColor: '#001529',
    }"
  >
    <div class="cell userInfo" >
      <el-dropdown trigger="click">
        <div class="icon">
          <el-icon size="18" color="#eee"><User /></el-icon>
        </div>
        <div class="text" v-if="userInfo.data">
          {{ userInfo.data().username }}
        </div>
        <template #dropdown>
          <userInfoCard v-if="userInfo.data"
            class="userInfoCard"
            :userInfo="userInfo.data"
            :showTemplate="userInfo.userTemplate"
            :btnList="[loginOutBtn]"
          />
        </template>
      </el-dropdown>
    </div>
    <div class="cell message">
      <div class="icon">
        <el-icon size="18" color="#eee"><Bell /></el-icon>
      </div>
      <div class="text">消息中心</div>
    </div>
  </CardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import userInfoCard from "@/modules/userManage/component/userCard/userInfoCard.vue";
import { useUserStore, useUserStoreHook } from "@/store/modules/user";

export default defineComponent({
  componentInfo: {
    labelNameCn: "头部导航条",
    key: "headerBar",
    description: "头部导航条",
    gridInfo: {
      middle: gridSizeMaker(12, 0),
    },
  } as componentInfo,
  name: "headerBar",
  components: { CardBg, userInfoCard },
  data: () => {
    return {
      userInfo: { data: null, userTemplate: [] },
    };
  },
  async mounted() {
    let data = await useUserStoreHook().getOptions();
    this.userInfo.data = async () => {
      return data;
    };
    
    const userTemplate = [
    ];
    this.userInfo.userTemplate = userTemplate;
    this.$emit("ready");
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.cell {
  position: relative;
  float: right;
  text-align: center;
  width: auto;
  height: 100%;
  display: flex;
  justify-content: space-around;
  color: #ddd;
  font-size: 14px;
  padding: 0px 12px;
  transition: 0.3s all;
  cursor: pointer;

  .icon {
    display: flex;
    flex-flow: column;
    justify-content: center;
    width: 24px;
  }
  .text {
    display: flex;
    flex-flow: column;
    justify-content: center;
    text-align: center;
  }
}
.cell:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.userInfoCard {
  width: 200px !important;
  margin: 6px;
}
</style>