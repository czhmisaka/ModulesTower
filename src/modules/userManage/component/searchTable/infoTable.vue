<!--
 * @Date: 2022-11-11 10:18:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-29 16:04:15
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/infoTable.vue
-->
<template>
  <div ref="tableBox" class="tableBox">
    <ElTable
      ref="tableController"
      :header-cell-style="tableHeader"
      :data="dataList"
      @selection-change="selectPosition"
      v-loading="loading"
      style="cursor: default"
      @cell-dblclick="cellDblclick"
      :row-style="{ 'min-height': '60px', 'min-width': '100px' }"
      :fit="true"
      :border="false"
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
        <template #header>
          <div class="ColumnHeader">
            <el-popover
              placement="top-start"
              trigger="hover"
              :show-after="400"
              :content="`${item.label}`"
            >
              <template #reference>
                {{ item.label }}
              </template>
            </el-popover>
          </div>
        </template>
        <template #default="scope">
          <div
            class="flexBox"
            :style="item.table?.style"
            v-if="item.table.type == showType.func"
          >
            <el-popover
              placement="top-start"
              trigger="hover"
              :show-after="500"
              :content="item.table.showFunc(scope.row, item.key)"
            >
              <template #reference>
                {{ item.table.showFunc(scope.row, item.key) }}
              </template>
            </el-popover>
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

  computed: {
    tableHeader() {
      return {
        backgroundColor: "#f8f9fb",
        fontWeight: 900,
        color: "#333",
      };
    },
  },

  methods: {
    /**
     * @name: cellDblclick
     * @description: 行内双击事件
     * @authors: CZH
     * @Date: 2022-11-15 15:07:10
     * @param {*} data
     */
    cellDblclick(data) {
      console.log(data, "asd");
      this.$modules.getModuleApi()["userManage_openDrawerForm"](this, {
        title: "详情",
        queryItemTemplate: this.template,
        btnList: [],
        data,
        noEdit: true,
      });
    },

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
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
}
.flexBox {
  text-align: left;
  user-select: text;
  font-weight: 300;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ColumnHeader {
  float: left;
  width: calc(100% - 26px);
  user-select: text;
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
