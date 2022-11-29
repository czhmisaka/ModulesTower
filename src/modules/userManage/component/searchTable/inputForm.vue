<!--
 * @Date: 2022-11-11 09:35:29
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-29 15:19:29
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/inputForm.vue
-->
<template>
  <div
    v-if="
      (queryItemTemplate && queryItemTemplate.length > 0) ||
      (btnList && btnList.length > 0) ||
      !autoSearch
    "
  >
    <cardBg
      ref="formBox"
      class="formBox"
      :cus-style="{
        padding: '12px',
        height: 'auto',
        paddingBottom: (btnList && btnList.length > 0) || !autoSearch ? '12px' : '0px',
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
        @change="onChange"
      >
        <div
          v-if="btnList.length > 0 || !autoSearch"
          slot-scope="{ formData }"
          :style="{ textAlign: 'right' }"
        >
          <el-button
            v-for="item in btnList"
            @click="btnClick(item)"
            :type="item.elType"
            :icon="item.icon"
          >
            {{ item.label }}
          </el-button>
          <el-button v-if="!autoSearch" @click="refreshData(-1)">重置</el-button>
          <el-button v-if="!autoSearch" type="primary" @click="handleSubmit(formData)"
            >搜索</el-button
          >
        </div>
      </VueForm>
      <div class="TopRight" v-if="isNeedClose">
        <iconCell
          :name="isOpen ? 'ArrowDownBold' : 'ArrowUpBold'"
          @click="changeOpen"
          :iconOption="{
            fontSize: '12px',
          }"
        />
      </div>
    </cardBg>
    <el-divider
      :style="{
        width: 'calc(100% - 24px)',
        margin: '12px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import VueForm from "@lljj/vue3-form-element";
import { stringAnyObj, tableCellTemplate, propertiesMaker } from "./searchTable";
import { btnCellTemplate } from "./drawerForm";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
let interval = null;
export default defineComponent({
  name: "表单组件",
  props: ["query", "queryItemTemplate", "queryItemConfig", "btnList", "autoSearch"],
  watch: {
    query: {
      handler(val) {
        this.refreshData(val);
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

  computed: {
    isNeedClose() {
      return Object.keys(this.schema.properties).length >= 3;
    },
  },

  components: { VueForm, cardBg, iconCell },

  data() {
    return {
      formData: {},
      uiSchema: {},
      formFooter: {
        show: false,
      },
      isOpen: true,
      formProps: {
        layoutColumn: 3,
        inlineFooter: false,
        labelSuffix: "：",
        labelPosition: "top",
        isMiniDes: false,
        defaultSelectFirstOption: true,
        labelWidth: "120px",
      },
      schema: {
        type: "object",
        properties: {},
      },
    };
  },

  async mounted() {
    this.refreshData(this.query);
    let that = this;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (that.$refs["formBox"] && that.$refs["formBox"]["$el"]) {
        let width = that.$refs["formBox"]["$el"].offsetWidth;
        if (width / 4 > 300) {
          that.formProps.layoutColumn = 3;
          that.formProps.labelPosition = "left";
        } else if (width / 4 > 250) {
          that.formProps.layoutColumn = 3;
          that.formProps.labelPosition = "top";
        } else if (width / 3 > 300) {
          that.formProps.layoutColumn = 2;
          that.formProps.labelPosition = "left";
        } else if (width / 3 > 200) {
          that.formProps.layoutColumn = 2;
          that.formProps.labelPosition = "top";
        } else {
          that.formProps.layoutColumn = 1;
          that.formProps.labelPosition = "left";
        }
      }
    }, 500);
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
      if (Object.keys(this.query).length > 0) {
      }
      let properties = {} as stringAnyObj;
      properties = propertiesMaker(queryItemTemplate);
      this.schema.properties = properties;
    },

    // 上报数据修改事件
    onChange() {
      this.$emit("inputChange", this.formData);
    },

    // 回报搜索事件
    handleSubmit(formData: stringAnyObj) {
      this.$emit("search", formData);
    },

    /**
     * @name: btnClick
     * @description: 回报自定义按钮事件
     * @authors: CZH
     * @Date: 2022-11-21 19:03:17
     * @param {*} btn
     */
    btnClick(btn: btnCellTemplate) {
      this.$emit("btnClick", btn);
    },

    changeOpen() {
      this.isOpen = !this.isOpen;
      this.isOpen
        ? this.initForm()
        : this.initForm(this.queryItemTemplate.slice(0, this.formProps.layoutColumn));
    },

    refreshData(val: any) {
      if (val == -1) {
        this.$emit("inputChange", {});
      } else if (val && Object.keys(val).length > 0) {
        for (let x in val) {
          if (this.formData[x] != val[x]) {
            this.formData[x] = val[x];
          }
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.formBox {
  width: 100%;
  height: auto;
  transition: all 0.3s;
}

.TopRight {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0px;
  right: 0px;
  margin: 18px;
}
</style>
