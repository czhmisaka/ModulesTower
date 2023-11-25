<!--
 * @Date: 2023-08-09 15:19:03
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-25 20:18:30
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/component/template/formProps.vue
-->
<template>
  <cardBg
    :title="title"
    :cus-style="{
      padding: '6px 12px 12px 12px',
      borderRadius: '0px',
    }"
  >
    <el-scrollbar>
      <VueForm
        v-if="canUpdate_local"
        v-model="formData_local"
        @change="change"
        :style="{
          textAlign: 'top',
        }"
        :schema="schema_local"
        :ui-schema="uiSchema"
        :formProps="formProps"
      >
        <div slot-scope="{ formData_local }" :style="{ textAlign: 'right' }"></div>
      </VueForm>
      <!-- 调试用 -->
      <!-- {{ formData_local }} -->
    </el-scrollbar>
  </cardBg>
</template>

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

import {
  PageDataTemplate,
  stringAnyObj,
  btnCellTemplate,
  btnActionTemplate,
  tableCellTemplate,
} from "@/modules/userManage/types";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";
import VueForm from "@lljj/vue3-form-element";
import {
  propertiesMaker,
  uiSchemaMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";

export default defineComponent({
  componentInfo: {
    labelNameCn: "表單属性编辑",
    key: "formProps",
    description: "表單属性编辑",
    gridInfo: {
      middle: gridSizeMaker(9, 8),
    },
  } as componentInfo,
  props: [
    "formData",
    "schema",
    "onChange",
    "queryItemTemplate",
    "title",
    "baseData",
    "canUpdate",
  ],
  components: {
    cardBg,
    VueForm,
  },
  data: () => {
    return {
      schema_local: {},
      uiSchema: {},
      formProps: {
        layoutColumn: 1,
        inlineFooter: false,
        labelSuffix: "",
        labelPosition: "top",
        isMiniDes: false,
        defaultSelectFirstOption: true,
        labelWidth: "80px",
      },
      formData_local: {},
      canUpdate_local: false,
    };
  },
  watch: {
    queryItemTemplate: {
      handler(val) {
        this.initForm();
      },
      immediate: true,
    },
    formData: {
      handler(val) {
        this.formData_local = val;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    change(val) {
      if (
        this.onChange &&
        this.canUpdate_local &&
        this.canUpdate &&
        Object.keys(this.formData).length > 0
      ) {
        this.onChange(this, deepClone(this.formData_local));
      }
    },
    /**
     * @name: 初始化表单
     * @description: initForm
     * @authors: CZH
     * @Date: 2022-11-14 10:17:28
     */
    async initForm(queryItemTemplate: tableCellTemplate[] = this.queryItemTemplate) {
      this.canUpdate_local = false;
      let properties = {} as stringAnyObj;
      properties = await propertiesMaker(queryItemTemplate, this, true);
      this.schema_local = {
        ...this.schema,
        properties,
      };
      this.uiSchema = uiSchemaMaker(queryItemTemplate, this);
      this.canUpdate_local = true;
    },
  },
  mounted() {
    this.$emit("ready");
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
