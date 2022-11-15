<!--
 * @Date: 2022-11-11 09:35:29
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-15 17:25:11
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/inputForm.vue
-->
<template>
  <cardBg
    class="formBox"
    :cus-style="{
      padding: '12px',
      height: 'auto',
    }"
  >
    <VueForm
      v-model="formData"
      :style="{
        textAlign: 'left',
      }"
      :schema="schema"
      :ui-schema="uiSchema"
      :formProps="formProps"
    >
      <div slot-scope="{ formData }" :style="{ textAlign: 'right' }">
        <el-button @click="refreshData">重置</el-button>
        <el-button type="primary" @click="handleSubmit(formData)">搜索</el-button>
      </div>
    </VueForm>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import VueForm from "@lljj/vue3-form-element";
import { stringAnyObj, tableCellTemplate, propertiesMaker } from "./searchTable";

import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
export default defineComponent({
  name: "表单组件",
  props: ["query", "queryItemTemplate", "queryItemConfig"],
  watch: {
    query: {
      handler(val) {
        if (val && Object.keys(val).length > 0)
          val.map((x: string) => {
            if (this.formData[x] != val[x]) {
              this.formData[x] = val[x];
            }
          });
      },
      deep: true,
      immediate: true,
    },
    queryItemTemplate: {
      handler(val) {
        this.initForm(val);
      },
      deep: true,
      immediate: true,
    },
  },

  components: { VueForm, cardBg },
  data() {
    return {
      formData: {},
      uiSchema: {},
      formFooter: {
        show: false,
      },
      formProps: {
        layoutColumn: 3,
        inline: false,
        inlineFooter: false,
        labelSuffix: "：",
        labelPosition: "left",
        isMiniDes: false,
        defaultSelectFirstOption: true,
      },
      schema: {
        title: "搜索",
        type: "object",
        properties: {},
      },
    };
  },

  async mounted() {
    await this.initForm(this.queryItemTemplate);
  },
  methods: {
    /**
     * @name: 初始化搜索用表单和对象
     * @description: initForm
     * @authors: CZH
     * @Date: 2022-11-14 10:17:28
     */
    async initForm(queryItemTemplate: tableCellTemplate[] = this.queryItemTemplate) {
      let properties = {} as stringAnyObj;
      properties = propertiesMaker(queryItemTemplate);
      this.schema.properties = properties;
    },

    // 上报数据修改事件
    onChange() {
      this.$emit("inputChange", this.inputQuery);
    },

    // 回报搜索事件
    handleSubmit(formData: stringAnyObj) {
      this.$emit("search", formData);
    },

    refreshData() {},
  },
});
</script>

<style lang="scss" scoped>
.formBox {
  width: 100%;
  height: auto;
}
</style>
