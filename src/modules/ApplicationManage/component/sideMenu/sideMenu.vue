<!--
 * @Date: 2023-05-30 10:47:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-13 15:56:57
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/component/sideMenu/sideMenu.vue
-->
<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  gridSizeMaker,
  inputType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import sideMenuCell from "@/modules/ApplicationManage/component/sideMenu/menuCell/sideMenuCell.vue";

import { menuCellActionTemplate, menuCellTemplate } from "./menuCell/types";
import { propInfo } from '../../../../components/basicComponents/grid/module/dataTemplate';

export default defineComponent({
  components: { cardBg, sideMenuCell },
  componentInfo: {
    labelNameCn: "侧边菜单",
    key: "sideMenu",
    description: "展示侧边菜单",
    gridInfo: {
      middle: gridSizeMaker(9, 8),
    },
  } as componentInfo,
  name: "sideMenu",
  propsDetail: {
    menuCellList: {
      label: '菜单列表',
      type: inputType.array,
      description: '必填'
    },
    clickFunc: {
      label: '点击事件',
      type: inputType.functionEditor
    },
    preMenuTitle: {
      label: '预设菜单',
      type: inputType.text,
      description: '使用menucell中存在的title'
    },
  } as propInfo,
  props: [
    "baseData",
    "sizeUnit",
    "menuCellList",
    "clickFunc",
    "preMenuTitle",
    "watchKey",
    "watchFunc",
    "nowKey"
  ],

  methods: {
    async click(menuCell: menuCellTemplate) {
      if (this.clickFunc) await this.clickFunc(this, menuCell);
      if (menuCell.type == menuCellActionTemplate.Function) {
        await menuCell.options.function(this, this.baseData);
      }
    },
  },
  async mounted() {
    this.$emit("ready");
  },
});
</script>

<template>
  <cardBg ref="mainBox" :cusStyle="{
    width: '100%',
    padding: '0px',
    borderRadius: '0px',
    overflow: 'hidden',
    paddingTop: '12px'
  }">
    <!-- sidebar-container -->
    <el-menu popper-effect="light" class=" menu" style="width: 100% !important" :index="nowKey">
      <sideMenuCell v-for="(item, index) in menuCellList" :menuCell="item" @clickFunc="click" :key="index" />
    </el-menu>
  </cardBg>
</template>

<style lang="scss" scoped>
.menu {
  height: 100%;
  background-color: rgba(0, 0, 0, 0) !important;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    background-color: #0000 !important;
    color: #0f0303 !important;
  }
}
</style>
