<!--
 * @Date: 2023-10-09 10:22:33
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-26 10:47:33
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/component/headerBar/headerBar.vue
-->
<template>
  <CardBg :cusStyle="{
    width: '100%',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#001529',
  }">
    <Navbar :style="{
      height: '100%',
      width: '100%',
      borderRadius: '6px',
      overflow: 'hidden',
    }" />
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
import Navbar from "@/layout/components/navbar.vue";
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
  components: { Navbar, CardBg },
  data: () => {
    return {
      userInfo: { data: null, userTemplate: [] },
      loginOutBtn: useUserStoreHook().getLogOutBtn(),
    };
  },
  async mounted() {
    let data = await useUserStoreHook().getOptions();
    this.userInfo.data = async () => {
      return data;
    };
    const userFieldTemplate = await (await userFieldStorage()).getAll();
    const userTemplate = [
      ...userTableCellStorage.getByKeyArr(["name", "icon", "mobile"]),
      ...userFieldTemplate,
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