<!--
 * @Date: 2022-11-21 08:52:56
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-09 08:52:13
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
      <el-scrollbar>
        <el-card>
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
        </el-card>
      </el-scrollbar>
    </div>
    <div class="formBody" v-else>
      <el-form ref="form" v-on:submit.prevent :label-position="'left'" size="small">
        <el-form-item
          :label-width="'120px'"
          :label="item.label"
          v-for="item in plugInData['queryItemTemplate'].filter(
            (x) => x.table.type != showType.btnList
          )"
        >
          {{ item.table.showFunc(plugInData["data"], item.key) }}
        </el-form-item>
      </el-form>
      <!-- <el-descriptions class="margin-top" :column="1">
        <el-descriptions-item
          min-width="100%"
          :label-align="'right'"
          :align="'left'"
          v-for="item in plugInData['queryItemTemplate'].filter(
            (x) => x.table.type != showType.btnList
          )"
          :label="item.label"
        >
          <span v-if="item.table.type == showType.func">
            {{ item.table.showFunc(plugInData["data"], item.key) }}
          </span>
        </el-descriptions-item>
      </el-descriptions> -->
    </div>
    <div :style="{ textAlign: 'left' }">
      <el-divider></el-divider>
      <div v-for="item in plugInData.btnList" style="float: left; margin-right: 6px">
        <el-button
          v-if="item.isShow(formData)"
          :loading="item.isLoading"
          @click="btnClick(item)"
          :type="item.elType"
          :icon="item.icon"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <drawerForm ref="drawer" :plugInData="drawerData"></drawerForm>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueForm from "@lljj/vue3-form-element";
import { cardOnChangeType } from "@/components/basicComponents/grid/module/dataTemplate";
import { propertiesMaker, uiSchemaMaker } from "./searchTable";

import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { ElDrawer, ElDivider, ElButton } from "element-plus";
import drawer from "element-plus/es/components/drawer";
import {
  btnActionTemplate,
  stringAnyObj,
  btnCellTemplate,
  showType,
  tableCellTemplate,
  tableCellOptions,
} from "@/modules/userManage/types";
import drawerForm from "./drawerForm.vue";

let formDataForCheck = {};
export default defineComponent({
  name: "drawerForm",
  components: { VueForm },
  props: ["plugInData", "baseData"],
  watch: {
    formData: {
      handler(val) {
        this.checkOnChange(val);
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

      queryItemTemplate: [] as tableCellTemplate[],

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
      properties = await propertiesMaker(queryItemTemplate, this);
      this.schema = {
        ...this.schema,
        properties,
        ...(this.plugInData["schema"] || {}),
      };
      this.uiSchema = uiSchemaMaker(queryItemTemplate, this);
    },

    async checkOnChange(val = this.formData, force = false) {
      Object.keys(val).map((key) => {
        if (val[key] != formDataForCheck[key] || force) {
          this.queryItemTemplate.map((cell) => {
            if (cell.key == key && cell.input && cell.input.onChangeFunc) {
              const queryItemTemplate = cell.input.onChangeFunc(this, this.formData);
              if (queryItemTemplate) this.initForm(queryItemTemplate);
            }
          });
          formDataForCheck[key] = val[key];
        }
      });
    },

    /**
     * @name: btnClick
     * @description: 按钮点击事件
     * @authors: CZH
     * @Date: 2022-12-02 09:27:05
     * @param {*} btn
     */
    async btnClick(btn: btnCellTemplate) {
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.drawerData = btn.drawerProps;
        this.$refs["drawer"].open();
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        await btn.function(that, this.formData);
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
    },

    /**
     * @name: close
     * @description: 关闭弹窗界面
     * @authors: CZH
     * @Date: 2022-12-02 09:27:52
     */
    async close() {
      this.isOpen = false;
      this.formData = {};
      this.$emit("onChange", {}, { type: [cardOnChangeType.forceRefresh] });
    },

    /**
     * @name: open
     * @description: 打开弹窗见面
     * @authors: CZH
     * @Date: 2022-12-02 09:28:12
     */
    async open() {
      await this.$nextTick();
      this.queryItemTemplate = this.plugInData["queryItemTemplate"]
        ? this.plugInData.queryItemTemplate
        : [];
      await this.initForm(this.queryItemTemplate);
      if (this.plugInData["data"]) this.formData = this.plugInData["data"];
      else this.formData = {};
      formDataForCheck = deepClone(this.formData);
      if (!this.plugInData["noEdit"]) this.checkOnChange(this.formData, true);
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
