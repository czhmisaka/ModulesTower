<!--
 * @Date: 2022-11-09 11:19:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-16 10:23:46
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/component/formPage/formPage.vue
-->
<template>
  <cardBg :cusStyle="{
    padding: '12px',
    ...cusStyle,
  }">
    <div class="formPageTitle" v-if="title">{{ title }}</div>
    <div class="formBody" :class="{
      formBody_noBtn: !btnList || btnList.length == 0,
      formBody_noTitle: !title,
      formBody_noTitle_noBtn: (!btnList || btnList.length == 0) && !title,
    }" v-if="(!showTypeProp || showTypeProp == 'edit') && formData && formProps && formInputTemplate">
      <el-scrollbar>
        <el-card>
          <VueForm v-model="formData" :style="{
            textAlign: 'top',
          }" :schema="schema" :ui-schema="uiSchema" :formProps="formProps">
            <div slot-scope="{ formData }" :style="{ textAlign: 'right' }"></div>
          </VueForm>
        </el-card>
      </el-scrollbar>
    </div>
    <!-- {{ formData }} -->
    <div :class="{
      formBody_noBtn: !btnList || btnList.length == 0,
      formBody_noTitle: !title,
      formBody_noTitle_noBtn: (!btnList || btnList.length == 0) && !title,
    }" v-if="showTypeProp == 'show'">
      <el-form ref="form" v-on:submit.prevent :label-position="'left'" size="small">
        <el-form-item :label-width="'120px'" :label="item.label" v-for="(item, index) in showItemTemplate.filter(
          (x) => x.table.type != showType.btnList
        )" :key="index + 'btnFormList'">
          <span v-if="item.table.type == showType.funcComponent">
            <component :is="item.table.showFunc(formData, item.key)"></component>
          </span>
          <span v-else-if="item.type == showType.func">
            {{ item.table.showFunc(formData, item.key) }}
          </span>
        </el-form-item>
      </el-form>
    </div>
    <!-- {{ btnList }} -->
    <div :style="{ textAlign: 'left' }" v-if="btnList && btnList.length > 0">
      <el-divider></el-divider>
      <div class="btnListStyle">
        <div v-for="(item, index) in btnList.filter((btn) =>
          btn && btn.isShow
            ? btn.isShow(formData, JSON.parse(JSON.stringify(btn)))
            : true
        )" :key="index + 'btn'" style="margin-right: 6px; display: inline-block">
          <el-button :loading="item.isLoading" @click="btnClick(item)" :type="item.elType" :icon="item.icon">
            {{ item.label }}
          </el-button>
        </div>
      </div>
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

import {
  propertiesMaker,
  uiSchemaMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import VueForm from "@lljj/vue3-form-element";
import { btnList } from "@/modules/knowledge/PageConfigData/template/templateDetail";
import { showType, tableCellTemplate, btnCellTemplate, btnActionTemplate } from "@/modules/userManage/types";
import { stringAnyObj } from '../../types';
import { queryItemTemplateLocal } from '../../../knowledge/PageConfigData/template/templateDetail';

export default defineComponent({
  componentInfo: {
    labelNameCn: "表单页面",
    key: "formPage",
    description: "",
    gridInfo: {
      middle: gridSizeMaker(12, 8),
    },
  } as componentInfo,

  propsDetail: {
    title: {
      label: "表单展示模板",
      description: "一次性获取所有数据",
      type: inputType.text,
    },
    formDataFunc: {
      label: '表单数据获取',
      type: inputType.functionEditor
    },
    defaultFormData: {
      label: "表单默认数据",
      description: "",
      type: inputType.obj,
    },
    showItemTemplate: {
      label: "表单展示模板",
      description: "一次性获取所有数据",
      type: inputType.functionEditor,
    },
    formInputTemplate: {
      label: "表单输入模板",
      type: inputType.obj,
    },
    btnList: {
      label: "操作按钮列表",
      type: inputType.obj,
    },
    showTypeProp: {
      label: '展示方式',
      type: inputType.boolean
    },
  } as propInfo,

  baseProps: {},
  props: ['formDataFunc', "title", "defaultFormData", "showItemTemplate", "formInputTemplate", "btnList", 'showTypeProp', 'cusStyle'],
  components: { cardBg, VueForm },
  watch: {},
  data: () => {
    return {
      searchResult: [],
      formItemTemplate: [] as tableCellTemplate[],
      showType,
      schema: {
        type: "object",
        properties: {},
      },
      formData: {},
      uiSchema: {},
      formProps: {
        layoutColumn: 1,
        inlineFooter: false,
        labelSuffix: "",
        labelPosition: "left",
        isMiniDes: false,
        defaultSelectFirstOption: true,
        labelWidth: "120px",
      },
    };
  },
  async mounted() {
    await this.init();
    await this.initForm();
    this.$emit("ready");
  },
  methods: {
    // 初始化表单
    async initForm(formInputTemplate: tableCellTemplate[] = this.formInputTemplate) {
      let properties = {} as stringAnyObj;
      properties = await propertiesMaker(formInputTemplate, this, true);
      this.schema = {
        ...this.schema,
        properties,
        // ...(this.plugInData["schema"] || {}),
      };
      this.uiSchema = uiSchemaMaker(formInputTemplate, this);
    },

    async init() {
      if (this.defaultFormData)
        this.formData = this.defaultFormData;
      if (this.formDataFunc)
        this.formData = await this.formDataFunc(this);
    },

    async btnClick(btn: btnCellTemplate) {
      btn["isLoading"] = true;
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.$modules.getModuleApi()["userManage_openDrawerForm"](this, btn.drawerProps);
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        await btn.function(that, that.formData);
        this.$emit("search");
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
      btn["isLoading"] = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.formPageTitle {
  text-align: left;
  height: 34px;
  line-height: 34px;
}

.formBody {
  height: calc(100% - 119px);
  overflow-y: auto;
  overflow-x: hidden;
}

.formBody_noBtn {
  height: calc(100% - 34px);
  overflow-y: auto;
  overflow-x: hidden;
}

.formBody_noTitle {
  height: calc(100% - 85px);
  overflow-y: auto;
  overflow-x: hidden;
}

.formBody_noTitle_noBtn {
  height: calc(100%);
  overflow-y: auto;
}

.btnListStyle {
  height: 36px;
  width: 100%;
  overflow: hidden;
  overflow-x: auto !important;
  white-space: nowrap;
}
</style>
