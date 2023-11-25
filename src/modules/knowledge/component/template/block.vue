<!--
 * @Date: 2023-08-10 11:24:08
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-08 15:29:33
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/component/template/block.vue
-->
<template>
  <cardBg
    class="itemBox"
    :cus-style="{
      filter: 'none',
    }"
  >
    <div class="infoBox">
      {{ item.key }}
    </div>
    <VueForm
      v-model="formData_local"
      :style="{
        textAlign: 'left',
      }"
      :schema="schemaInData"
      :ui-schema="uiSchema"
      :formProps="formProps"
    >
      <div slot-scope="{ formData_local }" :style="{ textAlign: 'right' }"></div>
    </VueForm>
    <div class="edit">
      <el-button type="primary" icon="Edit" @click="$emit('edit')" plain size="small" />
      <el-button
        type="danger"
        icon="Delete"
        @click="$emit('delete')"
        size="small"
        plain
      />
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  PageDataTemplate,
  stringAnyObj,
  btnCellTemplate,
  btnActionTemplate,
  tableCellTemplate,
} from "@/modules/userManage/types";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";
import {
  propertiesMaker,
  tableCellTemplateMaker,
  uiSchemaMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import VueForm from "@lljj/vue3-form-element";

export default defineComponent({
  name: "block",
  props: ["formData", "schema", "formProps", "item"],
  watch: {
    item: {
      async handler(val) {
        await this.initForm();
      },
      deep: true,
      immediate: true,
    },
    formData_local: {
      handler(val) {
        this.emitUpdate(val[this.item.key]);
      },
      deep: true,
      immediate: true,
    },
  },
  components: { cardBg, VueForm },
  data: () => {
    return {
      formData_local: {},
      schemaInData: {
        type: "object",
        properties: {},
      },
      uiSchema: {},
    };
  },
  methods: {
    async initForm(queryItemTemplate: tableCellTemplate[] = [this.item]) {
      let properties = {} as stringAnyObj;
      properties = await propertiesMaker(queryItemTemplate, this, true);
      this.schemaInData = {
        ...this.schemaInData,
        ...this.schema,
        properties,
      };
      this.uiSchema = uiSchemaMaker(queryItemTemplate, this);
      let data = {};
      data[this.item.key] = this.formData;
      this.formData_local = data;
    },

    // 全量提交 formData
    emitUpdate(data) {
      this.$emit("onUpdate", data);
    },
  },
});
</script>

<style lang="scss" scoped>
.itemBox {
  margin: 6px 6px 0px 6px;
  width: calc(100% - 12px) !important;
  transition: box-shadow 0.3s, transform 0.4s, border-radius 0.3s, height 0.1s;
  padding: 6px 12px 12px 12px;
  border-radius: 2px;
  border: 0px solid #ccc;
}
.infoBox {
  transition: all 0.3s;
  position: absolute;
  opacity: 0;
  right: 12px;
  bottom: 6px;
  font-size: 12px;
  font-weight: 100;
  z-index: 100000;
}

.edit {
  transition: all 0.3s;
  height: 0px;
  overflow: hidden;
  opacity: 0;
  float: left;
}
.itemBox {
  transform: translate(-1px, -1px);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  .edit {
    height: auto;
    opacity: 1;
  }
  .infoBox {
    opacity: 1;
  }
}
</style>
