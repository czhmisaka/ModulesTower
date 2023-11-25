<!--
 * @Date: 2023-08-10 08:34:56
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-20 10:24:00
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/component/template/board.vue
-->
<template>
  <cardBg
    :cus-style="{
      padding: '6px 12px 12px 12px',
      borderRadius: '0px',
    }"
  >
    <el-scrollbar>
      <VueDraggable v-model="templateList" :animation="150" :group="groupName || 'board'">
        <div v-if="templateList.length == 0" class="enpty"></div>
        <div v-for="(item, i) in templateList" :key="item.__key">
          <block
            :key="i"
            class="item"
            :item="item"
            :schema="schema"
            :ui-schema="uiSchema"
            :form-data="formData[item.key]"
            :formProps="formProps"
            @onUpdate="(e) => updateFormData(e, item.key)"
            @delete="deleteItem(i)"
            @edit="editItem(item)"
          />
        </div>
        <div class="enpty"></div>
      </VueDraggable>
    </el-scrollbar>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import VueForm from "@lljj/vue3-form-element";
import block from "./block.vue";
import { changeCardProperties } from "@/components/basicComponents/grid/module/cardApi";
import { useAbleComponents } from "./useAbleComponents";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";

export default defineComponent({
  componentInfo: {
    labelNameCn: "展示表单",
    key: "board",
    description: "展示表单",
    gridInfo: {},
  } as componentInfo,
  components: { cardBg, VueForm, block, VueDraggable },
  props: [
    "baseData",
    "sizeUnit",
    "detail",
    "schema",
    "queryItemTemplate",
    "queryItemTemplateChange",
    "formProps",
    "groupName",
    "componentPropsLabel",
  ],
  watch: {
    templateList: {
      handler(val) {
        if (this.queryItemTemplateChange) this.queryItemTemplateChange(this, val);
      },
      deep: true,
    },
    queryItemTemplate: {
      handler(val) {
        console.log(
          "请求执行：queryItemTemplate",
          JSON.parse(JSON.stringify(this.queryItemTemplate))
        );
        this.templateList = val;
      },
      deep: true,
      immediate: true,
    },
  },
  data: () => {
    return {
      isOpen: false,
      formData: {},
      uiSchema: {},

      templateList: [],
    };
  },
  methods: {
    updateFormData(data, key) {
      this.formData[key] = data;
    },

    deleteItem(i) {
      this.templateList.splice(i, 1);
    },

    editItem(item) {
      let data = {};
      const that = this;
      useAbleComponents.map((componentList) => {
        componentList.componentslist.map((x) => {
          if (x.name == item.__name) {
            let cardProperties = {};
            this.queryItemTemplateChange(this, this.templateList);
            data[that.componentPropsLabel] = {
              canUpdate: false,
            };
            changeCardProperties(that, data, false);
            setTimeout(() => {
              data[that.componentPropsLabel] = {
                queryItemTemplate: [],
              };
              changeCardProperties(that, data, false);
            }, 50);
            setTimeout(() => {
              data[that.componentPropsLabel] = {
                formData: item,
                queryItemTemplate: x.componentPropsTemplate,
              };
              changeCardProperties(that, data, true);
            }, 100);

            setTimeout(() => {
              data[that.componentPropsLabel] = {
                canUpdate: true,
              };
              changeCardProperties(that, data, false);
            }, 150);
          }
        });
      });
    },
  },
  mounted() {
    this.$emit("ready");
    if (this.queryItemTemplate)
      this.queryItemTemplateChange(this, this.queryItemTemplate);
  },
});
</script>

<style lang="scss" scoped>
.enpty {
  height: 400px;
  width: 100%;
}
</style>
