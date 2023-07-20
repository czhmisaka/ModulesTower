<!--
 * @Author: LJH
 * @Date: 2023-06-02 10:23:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-02 10:43:58
-->
<template>
  <div class="workteamAddUserDiv">
    <div class="leftUnitList"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, toRefs } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  setData,
  hightLightComponent,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { useUserStoreHook } from "@/store/modules/user";

import {
  btnActionTemplate,
  stringAnyObj,
  btnCellTemplate,
  showType,
  tableCellTemplate,
  tableCellOptions,
} from "@/modules/userManage/types";
export default defineComponent({
   componentInfo: {
    labelNameCn: "用户信息展示组件",
    key: "userInfoCard",
    description: "展示用户信息",
    gridInfo: {
      middle: gridSizeMaker(4, 3),
    },
  } as componentInfo,
  propsDetail:{

  },
  baseProps:{
    
  }
})
</script>

<style lang="scss" scoped>
  .workteamAddUserDiv {
    width: 100%;
    height: 100%;
    background:red;
    display: flex;
  }
</style>