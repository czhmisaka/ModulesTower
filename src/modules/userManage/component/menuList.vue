<!--
 * @Date: 2022-11-09 11:19:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-09 11:08:58
 * @FilePath: /configforpagedemo/src/modules/userManage/component/menuList.vue
-->
<template>
  <cardBg
    :cusStyle="{
      padding: '12px',
    }"
  >
    <div class="menuBox">
      <el-select
        :style="{
          width: '100%',
        }"
        v-model="selectedKey"
        multiple
        filterable
        remote
        reserve-keyword
        :remote-method="fillter"
        placeholder="搜索"
      >
        <el-option
          v-for="item in searchList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-tree :data="treeData" :props="defaultProps" @node-click="nodeClick" />
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
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
    treeDataFunc: {
      label: "树状列表数据（一次性获取）",
      description: "一次性获取所有数据",
      type: inputType.functionEditor,
    },
    outputKey: {
      label: "baseData输出key",
      type: inputType.text,
    },
    defaultProps: {
      label: "数据替换方案",
      description: "参考文档：https://element-plus.org/zh-CN/component/tree.html#props",
      type: inputType.obj,
    },
  } as propInfo,

  baseProps: {
    treeDataFunc: () => {
      let num = 0;
      let testData = () => {
        return { label: "Hello World _ " + num, value: "测试数据" + num++ };
      };
      return [
        {
          ...testData(),
          children: [testData(), testData()],
        },
      ];
    },
    outputKey: "menuSelectCell",
    defaultProps: {
      children: "children",
      label: "label",
    },
  },

  props: ["baseData", "sizeUnit", "outputKey", "defaultProps", "treeDataFunc"],
  components: { cardBg },
  watch: {},
  data: () => {
    return {
      treeData: [],
      searchList: [],
      selectedKey: "",
    };
  },
  async mounted() {
    await this.init();
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
      let outputKey = this.outputKey || "menuList_output";
      let data = {};
      data[outputKey] = JSON.parse(JSON.stringify(node));
      setData(this, data);
    },

    /**
     * @name: init
     * @description: 初始化
     * @authors: CZH
     * @Date: 2022-11-18 17:04:57
     */
    async init() {
      if (this.treeDataFunc) {
        let that = this;
        that.treeData = await that.treeDataFunc(that);
      }
    },

    async fillter() {},
  },
});
</script>

<style lang="scss" scoped>
.menuBox {
  width: 100%;
  height: 100%;
}
</style>
