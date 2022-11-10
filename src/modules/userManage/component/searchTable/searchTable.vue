<!--
 * @Date: 2022-11-09 19:26:59
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-09 19:27:30
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable.vue
-->
<template>
  <cardBg> </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { changeCardSize } from "@/components/basicComponents/grid/module/cardApi/index";

export default defineComponent({
  componentInfo: {
    labelNameCn: "搜索列表组件",
    key: "searchTable",
    description:
      "搜索列表组件，可以监听baseData内的参数作为搜索传参数，支持对接不同风格的表单搜索组件",
    gridInfo: {
      middle: gridSizeMaker(9, 8),
    },
  } as componentInfo,
  propsDetail: {
    preLoadData: {
      label: "预加载数据列表",
      type: inputType.array,
    },
    searchFunc: {
      label: "搜索函数",
      type: inputType.functionEditor,
    },
    showTypeList: {
      label: "展示单元模板列表",
      type: inputType.array,
    },
    searchTypeList: {
      label: "搜索单元模板列表",
      type: inputType.array,
    },
  } as propInfo,
  baseProps: {},

  props: ["baseData", "preLoadData", "searchFunc", "showTypeList", "searchTypeList"],
  components: { cardBg },
  data() {
    return {};
  },
  async mounted() {
    this.$emit("ready");
  },
  methods: {},
});
</script>

<style lang="sass" scoped></style>
