<!--
 * @Date: 2022-11-11 09:35:29
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-18 11:00:20
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/inputForm.vue
-->
<template>
  <cardBg
    ref="formBox"
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
    <div class="TopRight">
      <iconCell
        :name="isOpen ? 'ArrowDownBold' : 'ArrowUpBold'"
        @click="
          () => {
            isOpen ? initForm() : initForm([queryItemTemplate[0]]);
          }
        "
        :iconOption="{
          fontSize: '12px',
        }"
      />
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import VueForm from "@lljj/vue3-form-element";
import { stringAnyObj, tableCellTemplate, propertiesMaker } from "./searchTable";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
let interval = null;
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

.TopRight {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0px;
  right: 0px;
  margin: 18px;
}
</style>
