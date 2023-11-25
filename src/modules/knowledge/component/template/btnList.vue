<!--
 * @Date: 2023-08-18 09:47:00
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-05 18:45:30
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/component/template/btnList.vue
-->
<template>
  <cardBg
    :cus-style="{
      padding: '6px 12px 12px 12px',
      borderRadius: '0px',
    }"
  >
    <div v-for="item in btnList" class="floatLeft" :style="item.style ? item.style : ''">
      <el-button
        v-if="isShow(item)"
        :loading="item.isLoading"
        @click="btnClick(item, baseData)"
        :disabled="isDisable(item)"
        :type="
          item.elType
            ? typeof item.elType != 'string'
              ? item.elType(baseData)
              : item.elType
            : ''
        "
        plain
        size="small"
        :icon="item.icon"
      >
        {{ item.label }}
      </el-button>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  btnActionTemplate,
  btnCellTemplate,
  stringAnyObj,
} from "@/modules/userManage/types";
import {
  gridSizeMaker,
  componentInfo,
  propInfo,
  inputType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { takeRight } from "lodash";
export default defineComponent({
  components: { cardBg },
  props: ["baseData", "sizeUnit", "detail", "btnList", "gridList"],
  data: () => {
    return {};
  },
  async mounted() {
    this.$emit("ready");
  },
  methods: {
    isShow(btn: btnCellTemplate) {
      return btn.isShow(this.baseData, btn);
    },

    isDisable(btn: btnCellTemplate) {
      return btn.isDisable(this.baseData);
    },

    /**
     * @name: btnClick
     * @description: 自定义按钮事件
     * @authors: CZH
     * @Date: 2022-11-21 19:04:03
     * @param {*} btn
     */
    async btnClick(btn: btnCellTemplate, data?: stringAnyObj) {
      btn["isLoading"] = true;
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.$modules.getModuleApi()["userManage_openDrawerForm"](this, btn.drawerProps);
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        await btn.function(that, data);
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
      btn["isLoading"] = false;
    },
  },

  propsDetail: {
    btnList: {
      label: "按钮列表",
      type: inputType.obj,
    },
  } as propInfo,

  baseProps: {
    btnList: [btnMaker("测试按钮", btnActionTemplate.Function, {})],
  } as stringAnyObj,

  componentInfo: {
    labelNameCn: "按钮列表组件",
    key: "btnList",
    description: "按钮列表组件",
    gridInfo: {
      middle: gridSizeMaker(4, 1),
    },
  } as componentInfo,
});
</script>

<style scoped lang="scss">
.floatLeft {
  float: left;
  margin-right: 6px;
}
</style>
