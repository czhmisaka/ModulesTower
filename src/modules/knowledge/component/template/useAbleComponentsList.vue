<!--
 * @Date: 2023-08-08 17:50:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-25 15:32:23
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/component/template/useAbleComponentsList.vue
-->
<template>
  <cardBg
    :cus-style="{
      padding: '6px 12px 12px 12px',
      borderRadius: '0px',
    }"
    :title="'组件列表'"
  >
    <div v-for="components in useAbleComponents" class="mainBox">
      <div class="title">
        <ElIcon :size="'12px'">
          <component :is="getIcon(components.icon)"></component>
        </ElIcon>
        {{ components.name }}
      </div>
      <VueDraggable
        v-model="components.componentslist"
        :animation="150"
        :group="{ name: groupName || 'board', pull: 'clone', put: false }"
        :clone="clone"
        :sort="false"
      >
        <div v-for="item in components.componentslist">
          <cardBg
            :cus-style="{
              margin: '3px',
              width: 'calc(50% - 6px)',
              borderRadius: '3px',
              float: 'left',
              padding: '3px',
              height: 'auto',
            }"
            class="hover"
          >
            <div class="componentName">
              <ElIcon :size="'8px'">
                <component :is="getIcon(components.icon)"></component>
              </ElIcon>
              {{ item.name }}
            </div>
          </cardBg>
        </div>
      </VueDraggable>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VueDraggable } from "vue-draggable-plus";

import sideDialogForm from "@/modules/userManage/component/searchTable/drawerForm.vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import inputForm from "./inputForm.vue";
import infoTable from "./infoTable.vue";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import search from "@iconify-icons/ep/search";
import { ElPagination } from "element-plus";
import {
  PageDataTemplate,
  stringAnyObj,
  btnCellTemplate,
  btnActionTemplate,
} from "@/modules/userManage/types";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";
import { inUseModulesComponent, useAbleComponents } from "./useAbleComponents";
import { getIcon } from "@/utils";

export default defineComponent({
  componentInfo: {
    labelNameCn: "可用组件列表",
    key: "useAbleComponentsList",
    description: "可用组件列表",
    gridInfo: {
      middle: gridSizeMaker(9, 8),
    },
  } as componentInfo,
  props: ["baseData", "sizeUnit", "detail", "clickFunc", "groupName"],
  components: {
    cardBg,
    VueDraggable,
  },
  mounted() {
    this.$emit("ready");
  },
  data: () => {
    return {
      useAbleComponents,
    };
  },
  methods: {
    getIcon,
    click(data) {
      if (this.clickFunc) {
        const that = this;
        this.clickFunc(that, data);
      }
    },
    clone(e) {
      return {
        ...e.tableCellMaker,
        key: `key_${(Math.random() + "").replaceAll(".", "")}`,
        __name: e.name,
        __key: `key_${(Math.random() + "").replaceAll(".", "")}`,
      } as inUseModulesComponent;
    },
  },
});
</script>
<style lang="scss" scoped>
.title {
  margin-top: 12px;
  margin-bottom: 6px;
  font-weight: bold;
  height: auto;
  width: 100%;
  line-height: 1em;
  text-align: center;
}

.mainBox {
  position: relative;
  width: 100%;
  height: auto;
  display: inline-block;
}
.hover {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.hoverWord {
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
}
.hover:hover {
  .hoverWord {
    opacity: 1;
  }
}
</style>
