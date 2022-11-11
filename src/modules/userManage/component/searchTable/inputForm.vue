<!--
 * @Date: 2022-11-11 09:35:29
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-11 09:46:31
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/inputCell.vue
-->
<template>
  <div class="formBox">
    <el-form
      @submit.native.prevent
      :model="inputQuery"
      label-suffix=":"
      label-width="150px"
    >
      <inputCellVue></inputCellVue>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import inputCellVue from "./inputCell/index.vue";
export default defineComponent({
  name: "输入单元组件",
  components: { inputCellVue },
  props: ["query", "queryItemTemplate", "queryItemConfig", "btnList"],
  data() {
    return {
      inputQuery: [],
    };
  },

  methods: {
    // 返回数据修改事件
    onChange() {
      this.$emit("onChange", this.inputQuery);
    },
  },
});
</script>

<style lang="scss" scoped>
.formBox {
  width: 100%;
  height: auto;
}
</style>
