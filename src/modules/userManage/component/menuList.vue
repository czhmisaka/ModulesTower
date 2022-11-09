<!--
 * @Date: 2022-11-09 11:19:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-09 11:20:27
 * @FilePath: /configforpagedemo/src/modules/userManage/component/menuList.vue
-->
<template>
  <cardBg>
    <el-tree :data="menuData" :props="defaultProps" @node-click="nodeClick" />
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";

export default defineComponent({
  componentInfo: {
    labelNameCn: "菜单列表组件",
    key: "menuList",
    description: "更具输入的menuData展示列表，点击输出对应的单元对象",
    gridInfo: {
      middle: gridSizeMaker(3, 8),
    },
  } as componentInfo,

  propsDetail: {
    menuData: {
      label: "菜单列表",
      type: inputType.obj,
    },
    outputKey: {
      label: "baseData输出key",
      type: inputType.text,
    },
    defaultProps: {
      label: "数据替换方案",
      type: inputType.obj,
    },
  } as propInfo,

  baseProps: {
    menuData: [],
    outputKey: "menuSelectCell",
    defaultProps: {
      children: "children",
      label: "label",
    },
  },

  props: ["baseData", "sizeUnit", "menuData", "outputKey", "defaultProps"],
  components: { cardBg },
  watch: {},
  data: () => {
    return {
      defaultProps: {},
    };
  },
  async mounted() {
    this.$emit("ready");
  },
  methods: {
    /**
     * @name: nodeClick
     * @description: 点击上报事件
     * @authors: CZH
     * @Date: 2022-11-09 16:55:30
     * @param {*} node
     */
    nodeClick(node) {
      let data = {};
      data[this.outputKey] = node;
      setData(this, data);
    },
  },
});
</script>

<style lang="sass" scoped></style>
