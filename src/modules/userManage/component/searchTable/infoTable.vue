<!--
 * @Date: 2022-11-11 10:18:58
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-13 18:36:59
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/infoTable.vue
-->
<template>
  <div ref="tableBox" class="tableBox">
    <ElTable
      ref="tableController"
      :header-cell-style="isDark ? tableHeaderDark : tableHeader"
      :data="dataList"
      @selection-change="selectPosition"
      v-loading="loading"
      style="cursor: default"
      :row-style="{ 'min-height': '60px', 'min-width': '100px' }"
      :fit="true"
      :border="false"
      :height="'100%'"
      row-key="id"
    >
      <ElTableColumn type="selection" align="center" fixed="left"></ElTableColumn>
      <ElTableColumn
        v-for="(item, index) in template"
        :sortable="item.table.sortable"
        :sort-by="(row, index) => sortBy(row, index, item.key)"
        :label="item.label"
        :width="
          item.table.type == showType.btnList ? '200px' : item.table?.width || 'auto'
        "
        :prop="item.key"
        :fixed="item.table.type == showType.btnList ? 'right' : item.table.fixed"
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
        <template #default="scope" v-if="item.table.type != showType.dataKey">
          <div
            class="flexBox"
            :style="item.table?.style"
            v-if="item.table.type == showType.funcComponent"
          >
            <component :is="item.table.showFunc(scope.row, item.key)"></component>
          </div>
          <div
            class="flexBox"
            :style="item.table?.style"
            v-if="item.table.type == showType.func"
          >
            <el-popover
              v-if="typeof item.table.showFunc(scope.row, item.key) == 'string'"
              placement="top-start"
              trigger="hover"
              :show-after="500"
              :content="
                `【${item.label}】` + item.table.showFunc(scope.row, item.key) + ''
              "
            >
              <template #reference>
                {{ item.table.showFunc(scope.row, item.key) }}
              </template>
            </el-popover>
          </div>
          <div
            class="flexBox noOverflow"
            :style="item.table?.style"
            v-if="item.table.type == showType.btnList"
          >
            <el-button
              v-for="btns in (btnList(item, scope.row)
                ? btnList(item, scope.row)
                : []
              ).filter((x, i) => {
                return i < 3;
              })"
              :loading="btns.isLoading"
              size="small"
              link
              type="primary"
              @click="btnClick(btns, scope.row)"
            >
              {{ btns.label }}
            </el-button>
            <el-button
              v-if="!item.table.noDetail"
              size="small"
              type="default"
              style="float: right; margin-right: 6px"
              @click="cellDblclick(scope.row)"
              icon="More"
            >
            </el-button>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElButton, ElPopover, ElTable, ElTableColumn } from "element-plus";
import { useDark } from "@pureadmin/utils";
import loading from "element-plus/es/components/loading";
import tableHeader from "element-plus/es/components/table/src/table-header";
import { btnCellTemplate, btnActionTemplate, showType, stringAnyObj } from "../../types";
import { cardOnChangeType } from "@/components/basicComponents/grid/module/dataTemplate";
export default defineComponent({
  components: { ElTable, ElTableColumn },
  props: ["template", "loading", "dataList", "baseData"],

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
    tableHeaderDark() {
      return {
        backgroundColor: "rgba(0,0,0,0.3)",
        fontWeight: 900,
        color: "#ddd",
      };
    },
  },

  methods: {
    btnList(item, data) {
      if (!item.table.btnList) return false;
      const back = item.table.btnList.filter((x) => {
        return x.isShow(data, JSON.parse(JSON.stringify(x)));
      });
      if (back && back.length > 0) return back;
      else return false;
    },

    /**
     * @name: cellDblclick
     * @description: 行内双击事件
     * @authors: CZH
     * @Date: 2022-11-15 15:07:10
     * @param {*} data
     */
    cellDblclick(data) {
      let btnList = [];
      this.template.map((item) => {
        if (item.table.type == showType.btnList && item.table.btnList) {
          item.table.btnList.map((btn) => {
            btnList.push(btn);
          });
        }
      });
      this.$modules.getModuleApi()["userManage_openDrawerForm"](this, {
        title: "详情",
        queryItemTemplate: this.template,
        btnList,
        data,
        noEdit: true,
      });
    },

    close() {
      this.$emit("search");
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

    /**
     * @name: btnClick
     * @description: 按钮点击事件
     * @authors: CZH
     * @Date: 2022-12-02 09:27:05
     * @param {*} btn
     */
    async btnClick(btn: btnCellTemplate, data?: stringAnyObj) {
      btn["isLoading"] = true;
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.$modules.getModuleApi()["userManage_openDrawerForm"](this, btn.drawerProps);
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        await btn.function(that, data);
        // this.$emit("search");
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
      btn["isLoading"] = false;
    },

    sortBy(row, index, key) {
      return row[key];
    },
  },

  setup() {
    const { isDark } = useDark();
    return {
      isDark,
    };
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
  display: contents;
  float: left;
  user-select: text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.noOverflow {
  overflow: hidden;
  text-overflow: unset;
}
.ColumnHeader {
  float: left;
  width: calc(100% - 26px);
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
