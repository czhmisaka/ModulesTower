

<!--
 * @Date: 2023-10-09 10:22:33
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-09 16:08:51
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/component/headerBar/applicationHeaderBar.vue
-->
<template>
  <CardBg :cusStyle="{
    width: '100%',
    padding: '0px',
    borderRadius: '0px',
    overflow: 'hidden',
  }">
    <div class="cell message">
      <div class="icon">
        <el-icon size="18" color="#eee">
          <Bell />
        </el-icon>
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
import { userFieldStorage } from "@/modules/userManage/PageConfigData/user/userValueManage";
import { userTableCellStorage } from "@/modules/userManage/PageConfigData/workteam";

export default defineComponent({
  componentInfo: {
    labelNameCn: "应用信息头部导航条",
    key: "applicationHeaderBar",
    description: "应用信息头部导航条",
    gridInfo: {
      middle: gridSizeMaker(12, 0),
    },
  } as componentInfo,
  name: "applicationHeaderBar",
  components: { CardBg, userInfoCard },
  prop: [
    'applicationInfo',
  ],
  data: () => {
    return {
    };
  },
  async mounted() {
    this.$emit("ready");
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.cell {
  position: relative;
  float: left;
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
</style>