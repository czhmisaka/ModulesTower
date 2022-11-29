<!--
 * @Date: 2022-11-21 08:52:56
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-29 16:18:41
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/drawerForm.vue
-->
<template>
  <el-drawer
    v-if="plugInData"
    v-model="isOpen"
    :title="plugInData.title"
    :size="`${plugInData.size || 50}%`"
    :with-header="plugInData.title ? true : false"
    :append-to-body="'True'"
  >
    <div class="formBody" v-if="!plugInData['noEdit']">
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
    <div class="formBody" v-else>
      <el-card>
        <el-form ref="form" v-on:submit.prevent :label-position="'top'">
          <el-form-item v-for="item in plugInData['queryItemTemplate']">
            <template #label>
              <h2 style="font-weight: 900">{{ item.label }}</h2>
            </template>
            {{ item.table.showFunc(plugInData["data"], item.key) }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div :style="{ textAlign: 'left' }">
      <el-divider></el-divider>
      <el-button
        v-for="item in plugInData.btnList"
        @click="btnClick(item)"
        :type="item.elType"
        :icon="item.icon"
      >
        {{ item.label }}
      </el-button>
    </div>
    <drawerForm ref="drawer" :plugInData="drawerData"></drawerForm>
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

  components: { VueForm },
  props: ["plugInData", "baseData"],
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
      if (this.plugInData["queryItemTemplate"])
        await this.initForm(this.plugInData.queryItemTemplate);
      if (this.plugInData["data"]) this.formData = this.plugInData["data"];
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
