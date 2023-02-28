<script lang="ts">
import { defineComponent } from "vue";
import sideDialogForm from "@/modules/userManage/component/searchTable/drawerForm.vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import inputForm from "./inputForm.vue";
import infoTable from "./infoTable.vue";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import search from "@iconify-icons/ep/search";
import { ElPagination } from "element-plus";
import {
  PageDataTemplate,
  stringAnyObj,
  btnCellTemplate,
  btnActionTemplate,
} from "@/modules/userManage/types";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";

export default defineComponent({
  componentInfo: {
    labelNameCn: "菜单组件（侧边）",
    key: "sideMenu",
    description: "通过注入menuMaker构建菜单",
    gridInfo: {
      middle: gridSizeMaker(2, 8),
    },
  } as componentInfo,

  propsDetail: {} as propInfo,

  baseProps: {},

  components: { cardBg },
  props: [],

  methods: {},

  setup() {
    return {};
  },
});
</script>

<template>
  <cardBg
    ref="mainBox"
    :cusStyle="{
      padding: '12px',
    }"
  >
  </cardBg>
</template>

<style scoped></style>
