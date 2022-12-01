<!--
 * @Date: 2022-11-21 08:52:56
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-01 16:41:21
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
          textAlign: 'top',
        }"
        :schema="schema"
        :ui-schema="uiSchema"
        :formProps="formProps"
      >
        <div slot-scope="{ formData }" :style="{ textAlign: 'right' }"></div>
      </VueForm>
    </div>
    <div class="formBody" v-else>
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item
          v-for="item in plugInData['queryItemTemplate'].filter(
            (x) => x.table.type != showType.btnList
          )"
          :label="item.label"
        >
          <span v-if="item.table.type == showType.func">
            {{ item.table.showFunc(plugInData["data"], item.key) }}
          </span>
        </el-descriptions-item>
      </el-descriptions>
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
import { tableCellTemplate, propertiesMaker, showType } from "./searchTable";

// windows 系统下有引入顺序问题，所以在组件内直接创建使用
// 主要是懒得重复写了
export interface stringAnyObj {
  [key: string]: any;
}

/**
 * @name: btnCell
 * @description: 自定义事件按钮
 * @authors: CZH
 * @Date: 2022-11-21 17:11:45
 */
export enum btnActionTemplate {
  OpenDrawer = "OpenDrawer",
  Function = "Function",
  Url = "Url",
}

import { tableCellOptions } from "./searchTable";
import { th } from "element-plus/es/locale";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";

/**
 * @name: drawerProps
 * @description: 弹窗属性事件
 * @authors: CZH
 * @Date: 2022-11-23 22:49:56
 */
export interface drawerProps {
  title: string;
  queryItemTemplate: tableCellOptions[];
  btnList: btnCellTemplate[];
  data?: stringAnyObj;
  noEdit?: boolean;
}

/**
 * @name: btnCellTemplate
 * @description: 按钮对象
 * @authors: CZH
 * @Date: 2022-11-23 22:50:42
 */
export interface btnCellTemplate extends stringAnyObj {
  label: string;
  type: btnActionTemplate;
  icon?: "";
  elType?: "";
  drawerDetail?: drawerProps;
  function?: (that: stringAnyObj) => void;
  url?: string;
}
let formDataForCheck = {};
export default defineComponent({
  name: "drawerForm",
  components: { VueForm },
  props: ["plugInData", "baseData"],
  watch: {
    formData: {
      handler(val) {
        Object.keys(val).map((key) => {
          if (val[key] != formDataForCheck[key]) {
            const queryItemTemplate = this.plugInData["queryItemTemplate"];
            queryItemTemplate.map((cell) => {
              if (cell.key == key && cell.input && cell.input.onChangeFunc)
                cell.input.onChangeFunc(this);
            });
            formDataForCheck[key] = val[key];
          }
        });
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      btnActionTemplate,
      isOpen: false,
      formData: {},
      uiSchema: {},
      showType,
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
    async initForm(
      queryItemTemplate: tableCellTemplate[] = this.plugInData.queryItemTemplate
    ) {
      let properties = {} as stringAnyObj;
      properties = await propertiesMaker(queryItemTemplate, this);
      this.schema = { ...this.schema, properties, ...(this.plugInData["schema"] || {}) };
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

    async close() {},

    async open() {
      await this.$nextTick();
      if (this.plugInData["queryItemTemplate"])
        await this.initForm(this.plugInData.queryItemTemplate);
      if (this.plugInData["data"]) this.formData = this.plugInData["data"];
      else this.formData = {};
      formDataForCheck = deepClone(this.formData);
      this.isOpen = true;
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
