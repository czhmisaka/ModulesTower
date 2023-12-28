<!--
 * @Date: 2023-05-30 10:47:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-06 17:08:04
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
    labelNameCN: "侧边菜单",
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
    'gridList',
    'detail',
    "clickFunc",
    "preMenuTitle",
    "watchKey",
    "watchFunc",
    "nowKey",
    "color"
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
    overflow: 'hidden',
    paddingTop: '0px'
  }">
    <!-- sidebar-container -->
    <el-menu popper-effect="light" class=" menu" style="width: 100% !important;border:0px #fff solid" :index="nowKey">
      <sideMenuCell v-for="(item, index) in menuCellList" :menuCell="item" @clickFunc="click" :key="index"
        :color="color" />
    </el-menu>
  </cardBg>
</template>

<style lang="scss" scoped>
.menu {
  height: 100%;
  background-color: rgba(0, 0, 0, 0) !important;

  :deep(.el-menu) {
    background-color: #0000;
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    background-color: #0000 !important;
    color: #0f0303 !important;
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu) {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) -50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 150%) rgb(255, 255, 255) !important;
    backdrop-filter: saturate(50%) blur(4px);
    background-position: -120px !important;
    background-size: 200% !important;
    // color: #fefefe !important;
    width: calc(100% - 12px);
    font-weight: 600;
    /* height: 100px; */
    height: auto;
    margin: 6px;
    border-radius: 6px;
    line-height: 3em;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);
    transition: background-position 0.3s ease-in-out;
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background-position: 0px !important;
  }

  :deep(.el-sub-menu) {
    .el-menu-item {
      padding-left: 30px;
    }

    padding-bottom: 0.1px;
  }
}
</style>
