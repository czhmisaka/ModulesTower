<!--
 * @Date: 2022-11-21 08:52:56
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-13 16:38:46
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/searchTable/drawerForm.vue
-->
<template>
  <el-drawer v-if="plugInData" v-model="isOpen" :title="plugInData.title"
    :size="`${plugInData.size || (isMobile() ? 100 : 50)}%`" :with-header="plugInData.title ? true : false"
    :append-to-body="true" :close-on-click-modal="true" :show-close="true" @close="fuckClose">
    <div style="display: none">{{ formData }}</div>
    <div :class="'formBody ' +
      (!plugInData.btnList || plugInData.btnList.length == 0 ? 'formBody_noBtn' : '')
      " v-if="isOpen && plugInData['gridDesktop'] && plugInData['gridDesktopConfig']">
      <div :style="{
        width: 'calc(100%)',
        height: 'calc(100%)',
        background: 'rgba(0,0,0,0)',
        overflow: 'hidden',
      }">
        <gridDesktop ref="gridDesktop" :grid-col-num="plugInData['gridDesktopConfig'].gridColNum"
          :desktopData="desktopDataList" :preBaseData="plugInData['gridDesktopConfig'].preBaseData"
          :component-lists="component" :cus-style="plugInData['gridDesktopConfig']?.cusStyle" v-model="formData" />
      </div>
    </div>
    <div :class="'formBody ' +
      (!plugInData.btnList || plugInData.btnList.length == 0 ? 'formBody_noBtn' : '')
      " v-else-if="isOpen && !plugInData['noEdit']">
      <!--  调试模式 -->
      <!-- {{ formData }} -->
      <!-- {{ schema }} -->
      <el-scrollbar>
        <VueForm v-if="isOpen" v-model="formData" :style="{
          textAlign: 'top',
        }" :schema="schema" :ui-schema="uiSchema" :formProps="formProps">
          <div slot-scope="{ formData }" :style="{ textAlign: 'right' }"></div>
        </VueForm>
      </el-scrollbar>
    </div>
    <div :class="'formBody ' +
      (!plugInData.btnList || plugInData.btnList.length == 0 ? 'formBody_noBtn' : '')
      " v-else-if="isOpen">
      <el-form ref="form" v-on:submit.prevent :label-position="'left'">
        <el-form-item :label-width="'120px'" :label="item.label" v-for="(item, index) in queryItemTemplate.filter(
          (x) => x.table.type != showType.btnList
        )" :key="index + 'el-form'">
          <span v-if="item.table.type == showType.dataKey">
            {{ plugInData["data"][item.key] }}
          </span>
          <component v-else-if="item.table.type == showType.funcComponent" @btnClick="btnClick"
            :is="item.table.showFunc(plugInData['data'], item.key)" @click="(btns) => btnClick(btns, plugInData['data'])">
          </component>
          <span v-else-if="item.table.type == showType.func">
            {{ item.table.showFunc(plugInData["data"], item.key) }}
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div :style="{ textAlign: 'left' }" v-if="isOpen && plugInData.btnList && plugInData.btnList.length > 0">
      <el-divider></el-divider>
      <div v-for="(item, index) in plugInData.btnList.filter((btn) =>
        btn && btn.isShow ? btn.isShow(formData, JSON.parse(JSON.stringify(btn))) : true
      )" style="float: left; margin-right: 6px" :key="index + 'btnlistitem'">
        <el-upload ref="uploadRef" :headers="getDownLoadRequestHeaders()" class="upload-demo"
          :action="actionUrl + (item.uploadInfo ? item.uploadInfo.action : '')"
          :limit="item.uploadInfo ? item.uploadInfo.limit : 1"
          :data="item.uploadInfo ? { ...item.uploadInfo.data, id: formData.id } : {}" :on-success="(response, file, fileList) => {
            return btnClick(item, response);
          }
            " :on-error="(response, file, fileList) => {
    return btnClick(item, response);
  }
    " :on-exceed="(response, file, fileList) => {
    return btnClick(item, response);
  }
    " :show-file-list="false" v-if="item.type == btnActionTemplate.UploadFunction">
          <el-button plain icon="plus" type="primary">{{ item.label }}</el-button>
        </el-upload>
        <el-button plain :loading="item.isLoading" @click="btnClick(item)" :disabled="item.isDisable(formData)"
          :type="item.elType" :icon="item.icon" v-else>
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
import { getDownLoadRequestHeaders } from "@/utils/api/user/header";
import {
  btnActionTemplate,
  stringAnyObj,
  btnCellTemplate,
  showType,
  tableCellTemplate,
  tableCellOptions,
} from "@/modules/userManage/types";
import drawerForm from "./drawerForm.vue";
import { isMobile } from "@/utils/Env";

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import gridDesktop from "@/components/basicComponents/grid/gridDesktop.vue";
import { getPreUrl } from "@/utils/api/requests";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
const VITE_PROXY_DOMAIN_REAL = getPreUrl();
let formDataForCheck = {};
export default defineComponent({
  name: "drawerForm",
  components: { VueForm, gridDesktop },
  props: ["plugInData", "baseData", 'detail'],

  computed: {
    component() {
      return this.$modules.getAllComponents();
    },
  },
  watch: {
    formData: {
      handler(val) {
        if (this.isReady) this.checkOnChange(val);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      btnActionTemplate,
      isOpen: false,
      formData: {
        id: "",
      },
      uiSchema: {},
      isMobile,
      isReady: false,

      showType,

      formFooter: {
        show: false,
      },

      formProps: {
        layoutColumn: 1,
        inlineFooter: false,
        labelSuffix: "",
        labelPosition: "left",
        isMiniDes: false,
        defaultSelectFirstOption: true,
        labelWidth: "120px",
      },

      queryItemTemplate: [] as tableCellTemplate[],
      desktopDataList: [] as gridCellTemplate[],
      schema: {
        type: "object",
        properties: {},
      },

      // drawer
      drawerData: {} as stringAnyObj,
      actionUrl: VITE_PROXY_DOMAIN_REAL,
    };
  },
  methods: {
    /**
     * @name: 初始化表单
     * @description: initForm
     * @authors: CZH
     * @Date: 2022-11-14 10:17:28
     */
    getDownLoadRequestHeaders() {
      return getDownLoadRequestHeaders();
    },
    async initForm(queryItemTemplate: tableCellTemplate[] = this.queryItemTemplate) {
      let properties = {} as stringAnyObj;
      properties = await propertiesMaker(queryItemTemplate, this, true);
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
          this.queryItemTemplate.map(async (cell) => {
            if (cell.key == key && cell.input && cell.input.onChangeFunc) {
              // 如有返回则可以重置表单的输入方案
              const that = this;
              const queryItemTemplate = await cell.input.onChangeFunc(
                that,
                this.formData,
                key
              );
              if (
                queryItemTemplate &&
                queryItemTemplate.length &&
                queryItemTemplate[0].key
              )
                this.initForm(queryItemTemplate);
              else if (queryItemTemplate) {
                for (let x in queryItemTemplate) {
                  this.formData[x] = queryItemTemplate[x];
                }
                this.$forceUpdate();
              }
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
    async btnClick(btn: btnCellTemplate, res?: stringAnyObj) {
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.drawerData = btn.drawerProps;
        this.$refs["drawer"].open();
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        if (this.plugInData["gridDesktop"]) {
          let Data = this.$refs["gridDesktop"].baseData;
          await btn.function(this, Data);
        } else await btn.function(this, this.formData);
      } else if (btn.type == btnActionTemplate.UploadFunction && btn.function) {
        await btn.function(this, res);
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
      // this.$emit("onChange", {}, { type: [cardOnChangeType.forceRefresh] });
      refreshDesktop(this)
    },

    fuckClose() {
      localStorage.setItem("fuckThePJ", "true");
    },

    /**
     * @name: open
     * @description: 打开弹窗见面
     * @authors: CZH
     * @Date: 2022-12-02 09:28:12
     */
    async open() {
      this.isReady = false;
      await this.$nextTick();
      if (this.plugInData["gridDesktop"] && this.plugInData["gridDesktopConfig"]) {
        this.desktopDataList = await this.plugInData["gridDesktopConfig"].desktopData();
      } else if (this.plugInData["queryItemTemplate"]) {
        this.queryItemTemplate = this.plugInData["queryItemTemplate"]
          ? this.plugInData.queryItemTemplate
          : [];
        if (this.plugInData["formProps"])
          this.formProps = {
            ...this.formProps,
            ...this.plugInData["formProps"],
          };
      }
      await this.initForm(this.queryItemTemplate);
      this.isReady = true;
      if (this.plugInData["data"]) this.formData = this.plugInData["data"];
      else this.formData = {};
      formDataForCheck = deepClone(this.formData);
      if (!this.plugInData["noEdit"]) this.checkOnChange(this.formData, true);
      this.isOpen = true;
    },
  },
});

</script>

<style>
.el-drawer__title::after {
  border-bottom: 1px solid var(--el-border-color);
  content: "";
  height: 1px;
  display: block;
  width: 100%;
  transform: translateY(1em);
}

.genFormLabel {
  font-weight: 700;
}

.genFromComponent .genFormItemRequired:before {
  content: "" !important;
  margin: 0px !important;
}

.genFromComponent .genFormItemRequired:after {
  content: "*" !important;
  color: #f56c6c;
  margin-left: 4px;
}
</style>

<style lang="scss" scoped>
.formBody {
  height: calc(100% - 85px);
  overflow-y: auto;
  overflow-x: hidden;
}

.formBody_noBtn {
  height: calc(100%) !important;
  overflow-y: auto;
}
</style>
