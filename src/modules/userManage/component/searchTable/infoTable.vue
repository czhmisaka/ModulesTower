<!--
 * @Date: 2022-11-11 10:18:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-28 20:51:17
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/infoTable.vue
-->
<template>
  <div ref="tableBox" class="tableBox">
    <ElTable
      ref="tableController"
      :data="dataList"
      @selection-change="selectPosition"
      border
      stripe
      v-loading="loading"
      style="cursor: default"
      @cell-dblclick="cellDblclick"
      :row-style="{ 'min-height': '60px', 'min-width': '100px' }"
      :fit="true"
      :height="'100%'"
    >
      <ElTableColumn type="selection" align="center" fixed="left"></ElTableColumn>
      <ElTableColumn
        v-for="(item, index) in template"
        :sortable="item.table.sortable"
        :sort-by="(row, index) => sortBy(row, index, item.key)"
        :label="item.label"
        :width="item.table?.width || 'auto'"
      >
        <template #default="scope">
          <div
            class="flexBox"
            :style="item.table?.style"
            v-if="item.table.type == showType.func"
          >
            {{ item.table.showFunc(scope.row, item.key) }}
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { showType, tableCellTemplate } from "./searchTable";
export default defineComponent({
  components: { ElTable, ElTableColumn },
  props: ["template", "loading", "dataList"],

  data() {
    return {
      showType,
      selectedList: [] as any[],
    };
  },

  methods: {
    /**
     * @name: cellDblclick
     * @description: 行内双击事件
     * @authors: CZH
     * @Date: 2022-11-15 15:07:10
     * @param {*} data
     */
    cellDblclick(data) {},

    /**
     * @name: selectPosition
     * @description: 选择行变化
     * @authors: CZH
     * @Date: 2022-11-15 15:08:32
     */
    selectPosition(e) {
      this.selectedList = e;
      this.$emit("selectedChange", this.selectedList);
    },

    /**
     * @name: tableHeight
     * @description: 获取表格高度
     * @authors: CZH
     * @Date: 2022-11-15 17:20:46
     */
    tableHeight() {
      if (this.$refs["tableBox"]) return this.$refs["tableBox"].offsetHeight;
      else return null;
    },

    sortBy(row, index, key) {
      return row[key];
    },
  },
});
</script>

<style lang="scss" scoped>
.tableBox {
  height: 100%;
}
.flexBox {
  overflow: hidden;
  display: flex;
  height: 100%;
  text-align: center;
  text-overflow: ellipsis;
  user-select: text;
  font-weight: 300;
}
.columHeader {
  position: absolute;
  padding-left: 20px;
  overflow: hidden;
}
</style>
