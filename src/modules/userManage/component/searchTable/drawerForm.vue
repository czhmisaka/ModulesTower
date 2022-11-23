<!--
 * @Date: 2022-11-21 08:52:56
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-21 08:54:50
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/sideDialogForm.vue
-->
<template>
  <el-drawer
    v-model="isOpen"
    :title="detail.title"
    :size="`${detail.size || 50}%`"
    :with-header="detail.title ? true : false"
    :append-to-body="appendToBody"
  >
    <div class="formBody">
      <VueForm
        v-if="isOpen"
        v-model="formData"
        :style="{
          textAlign: 'left',
        }"
        :schema="schema"
        :ui-schema="uiSchema"
        :formProps="formProps"
      >
        <div slot-scope="{ formData }" :style="{ textAlign: 'right' }"></div>
      </VueForm>
    </div>
    <div :style="{ textAlign: 'left' }">
      <el-divider></el-divider>
      <el-button
        v-for="item in detail.btnList"
        @click="btnClick(item)"
        :type="item.elType"
        :icon="item.icon"
      >
        {{ item.label }}
      </el-button>
    </div>
    <drawerForm ref="drawer" :detail="drawerData"></drawerForm>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueForm from "@lljj/vue3-form-element";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj, tableCellTemplate, propertiesMaker } from "./searchTable";
import { btnCellTemplate, btnActionTemplate } from "./drawerForm";
export default defineComponent({
  name: "drawerForm",
  componentInfo: {} as componentInfo,

  components: { VueForm },
  props: ["appendToBody", "detail", "baseData"],
  data() {
    return {
      btnActionTemplate,
      isOpen: false,
      formData: {},
      uiSchema: {},
      formFooter: {
        show: false,
      },
      formProps: {
        layoutColumn: 1,
        inlineFooter: false,
        labelSuffix: "：",
        labelPosition: "left",
        isMiniDes: false,
        defaultSelectFirstOption: true,
        labelWidth: "120px",
      },
      schema: {
        type: "object",
        properties: {},
      },

      // drawer
      drawerData: {} as stringAnyObj,
    };
  },
  methods: {
    /**
     * @name: 初始化表单
     * @description: initForm
     * @authors: CZH
     * @Date: 2022-11-14 10:17:28
     */
    async initForm(queryItemTemplate: tableCellTemplate[] = this.queryItemTemplate) {
      let properties = {} as stringAnyObj;
      properties = propertiesMaker(queryItemTemplate);
      this.schema.properties = properties;
    },

    async btnClick(btn: btnCellTemplate) {
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.drawerData = btn.drawerProps;
        this.$refs["drawer"].open();
      } else if (btn.type == btnActionTemplate.Function) {
        let that = this;
        await btn.function(that);
      } else if (btn.type == btnActionTemplate.Url) {
      }
    },

    async open() {
      this.isOpen = true;
      await this.$nextTick();
      if (this.detail["queryItemTemplate"])
        await this.initForm(this.detail.queryItemTemplate);
    },
  },
});
</script>

<style lang="scss" scoped>
.formBody {
  height: calc(100% - 85px);
  overflow-y: auto;
}
</style>
