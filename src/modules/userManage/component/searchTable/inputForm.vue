<!--
 * @Date: 2022-11-11 09:35:29
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-11 09:46:31
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/inputCell.vue
-->
<template>
  <div class="formBox">FormProvider</div>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import { FormProvider, createSchemaField } from "@formily/vue";
import { ElInput } from "element-plus";
const { SchemaField } = createSchemaField({
  components: {
    ElInput,
  },
});
export default defineComponent({
  name: "表单组件",
  components: {},
  props: ["query", "queryItemTemplate", "queryItemConfig", "btnList"],
  data() {
    return {
      inputQuery: [],
    };
  },

  methods: {
    // 上报数据修改事件
    onChange() {
      this.$emit("onChange", this.inputQuery);
    },

    // 处理当前数据处理事件
  },
});
</script>

<style lang="scss" scoped>
.formBox {
  width: 100%;
  height: auto;
}
</style>
