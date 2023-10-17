<!--
 * @Date: 2023-05-30 10:47:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-13 15:12:49
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/component/sideMenu/menuCell/sideMenuCell.vue
-->

<template>
  <el-sub-menu class="menuCell subMenuCell" v-if="menuCell.type == menuCellActionTemplate.MenuCellList"
    :index="menuCell.key">
    <template #title>
      <div class="icon">
        <!-- <ElIcon v-if="menuCell.icon">
          <component :is="getIcon(menuCell.icon)"></component>
        </ElIcon> -->
      </div>
      <div class="title">
        {{ menuCell.title }}
      </div>
    </template>
    <sideMenuCell v-for="(item, index) in menuCell.children" :key="index" :menuCell="item" @clickFunc="clickFunc" />
  </el-sub-menu>
  <el-menu-item v-else class="menuCell" :index="menuCell.key" @click="clickFunc(menuCell)">
    <div class="icon">
      <!-- <ElIcon v-if="menuCell.icon">
        <component :is="getIcon(menuCell.icon)"></component>
      </ElIcon> -->
    </div>
    <div class="title">
      {{ menuCell.title }}
    </div>
  </el-menu-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { menuCellActionTemplate } from "./types";
import { getIcon } from "@/utils";

export default defineComponent({
  components: { cardBg },
  name: "sideMenuCell",
  props: ["menuCell"],
  data: () => {
    return { menuCellActionTemplate };
  },
  methods: {
    getIcon,
    async clickFunc(menuCell) {
      this.$emit("clickFunc", menuCell);
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.menu {
  width: 100%;
}
</style>
