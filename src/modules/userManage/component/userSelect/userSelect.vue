<!--
 * @Date: 2023-09-15 09:36:44
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-05 09:41:36
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/userSelect/userSelect.vue
-->
<template>
  <cardBg :cus-style="{
    padding: '6px 12px 12px 12px',
  }">
    <el-form v-if="selectPropsList && selectPropsList.length > 0">
      <el-form-item v-for="item in selectPropsList" :label="item.label">
        <el-tag v-for="tag in selectData[item.key || item.label]" :type="item.color || 'primary'"
          style="margin-left: 6px;margin-bottom:3px;margin-top: 3px;" closable @close="delFunc(item.key, tag)">
          {{ tag.label }}
        </el-tag>
      </el-form-item>
    </el-form>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { changeCardProperties } from '../../../../components/basicComponents/grid/module/cardApi/index';
import data from '@iconify-icons/ep/edit';
import {
  gridSizeMaker,
  componentInfo,
  propInfo,
  inputType,
} from "@/components/basicComponents/grid/module/dataTemplate";
export default defineComponent({
  components: { cardBg },

  componentInfo: {
    labelNameCn: "人员选择 - 展示组件",
    key: "userSelect",
    description: "展示当前选择的人员，部门，角色等信息，可通过配置方式修改选择方式",
    gridInfo: {
      middle: gridSizeMaker(3, 8),
    },
  } as componentInfo,
  propsDetail: {
    selectPropsList: {
      label: "配置选择项展示列表",
      type: inputType.array,
    },
    selectData: {
      label: "已经选择的选择项",
      type: inputType.obj,
    },
  } as propInfo,
  baseProps: {},
  props: ["baseData", "sizeUnit", "detail", "selectPropsList", "selectData", 'deleteFunc'],
  watch: {
    selectData: {
      handler(val) {
      }
    },
  },
  data: () => {
    return {};
  },

  methods: {

    async delFunc(key, tag) {
      await this.deleteFunc(this, key, tag);
    }
  },

  async mounted() {
    this.$emit("ready");
  },
});
</script>

<style scoped></style>
