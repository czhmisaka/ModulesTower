<!--
 * @Date: 2022-11-09 11:19:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-22 16:08:06
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/menuListRemote.vue
-->
<template>
  <cardBg :cusStyle="{
    padding: '12px',
  }">
    <div :class="`menuBox box_${random}`">
      <div class="searchBar">
        <el-input :style="{
          width: '100%',
          marginRight: searchBtn || selectedKey != '' ? '6px' : '',
        }" v-model="selectedKey" :size="size" @keydown.enter.prevent="searchFuncByName ? searchByName() : search()"
          clearable></el-input>
        <el-button v-show="selectedKey && selectedKey.length > 0" @click="searchFuncByName ? searchByName() : search()"
          :size="size" plain type="primary">
          搜索
        </el-button>
        <el-button style="margin-left: 0px" :size="size"
          v-if="searchBtn && isBtnShow(searchBtn) && selectedKey.length == 0" :loading="searchBtn.isLoading"
          :type="searchBtn.elType" plain @click="btnClick(searchBtn)">
          {{ searchBtn.label }}
        </el-button>
      </div>

      <!-- 这里展示的是搜索结果 -->
      <div class="content" v-if="searchResult.length != 0 && selectedKey">
        <div v-for="item in searchResult">
          <cardBg :title="item.label" :title-icon="item.icon" :cus-style="{
            margin: '6px 3px',
            width: 'calc(100% - 6px)',
            borderRadius: '3px',
            padding: '3px',
          }">
            <div v-for="it in item.data" class="flexItem">
              <div>
                {{ it.label }}
              </div>
              <el-button v-if="item.btn" @click="btnClick(item.btn, it)" :type="item.btn.elType" :icon="item.btn.icon"
                size="small" plain text>
                {{ item.btn.label }}
              </el-button>
            </div>
          </cardBg>
        </div>
      </div>

      <!-- 这里展示的是默认树形结构 -->
      <div class="content" v-if="searchResult.length == 0 && selectedKey == ''">
        <el-tree v-model="treeData" :props="defaultProps" :lazy="true" :load="treeDataFuncByLevel"
          @node-click="nodeClick">
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div class="text">{{ node.label }}</div>
              <el-button v-if="clickItemDetailFunc" text size="small" icon="More"
                @click.stop="clickItemDetail(data)"></el-button>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  btnCellTemplate,
  btnActionTemplate,
  showType,
  stringAnyObj,
  tableCellTemplate,
} from "../types";
import * as Icons from "@element-plus/icons-vue";

export type iconType = keyof typeof Icons;
interface SearchResult {
  label: string;
  data: {
    label: string;
    [key: string]: any;
  }[];
  icon?: iconType;
  detail?: tableCellTemplate[];
  btn?: btnCellTemplate;
}
enum sizeTem {
  small = "small",
  large = "large",
  default = "default",
}
const random = Math.floor(Math.random() * 10000000);
export default defineComponent({
  componentInfo: {
    labelNameCn: "菜单列表组件(远程数据)",
    key: "menuListRemote",
    description: "更具输入的menuData展示列表，点击输出对应的单元对象",
    gridInfo: {
      middle: gridSizeMaker(3, 8),
    },
  } as componentInfo,

  propsDetail: {
    treeDataFuncByLevel: {
      label: "树状列表数据（按照对象获取）",
      description: "展开节点时才会加载子节点列表，用于应对大数据展示的情况，避免带宽消耗",
      type: inputType.functionEditor,
    },
    outputKey: {
      label: "baseData输出key",
      type: inputType.text,
    },
    defaultProps: {
      label: "数据替换方案",
      description: "参考文档：https://element-plus.org/zh-CN/component/tree.html#props",
      type: inputType.obj,
    },
    clickItemDetailFunc: {
      label: "点击元素详情事件",
      description: "一般用于展示元素弹窗等",
      type: inputType.functionEditor,
    },
    clickItemFunc: {
      label: "点击元素详情事件",
      description: "一般用于展示元素弹窗等",
      type: inputType.functionEditor,
    },
    searchFuncByName: {
      label: "搜索事件（名称）",
      description: "一般用于复合搜索",
      type: inputType.functionEditor,
    },
    searchBtn: {
      label: "定制按钮1",
      type: inputType.obj,
    },
  } as propInfo,

  baseProps: {
    outputKey: "menuSelectCell",
    defaultProps: {
      children: "children",
      label: "label",
    },
  },

  props: [
    "baseData",
    "sizeUnit",
    "outputKey",
    "defaultProps",
    "treeDataFuncByLevel",
    "clickItemDetailFunc",
    "clickItemFunc",
    "searchBtn",
    "searchFuncByName",
  ],
  components: { cardBg },
  watch: {
    selectedKey(val) {
      this.searchResult = [];
    },
  },
  data: () => {
    return {
      treeData: [],
      searchResult: [],
      selectedKey: "",
      random,
      size: sizeTem.small,
    };
  },
  async mounted() {
    await this.init();
    this.$emit("ready");
  },
  methods: {
    isBtnShow(btn: btnCellTemplate) {
      const that = this;
      return btn.isShow(that, btn);
    },

    /**
     * @name: nodeClick
     * @description: 点击上报事件
     * @authors: CZH
     * @Date: 2022-11-09 16:55:30
     * @param {*} node
     */
    nodeClick(node) {
      let outputKey = this.outputKey || "menuList_output";
      let data = {};
      const that = this;
      data[outputKey] = JSON.parse(JSON.stringify(node));
      if (this.clickItemFunc) {
        this.clickItemFunc(that, node);
      }
      setData(this, data);
    },

    /**
     * @name: init
     * @description: 初始化
     * @authors: CZH
     * @Date: 2022-11-18 17:04:57
     */
    async init() {
      const that = this;
      setTimeout(() => {
        const el = document.querySelector(`.box_${that.random} .custom-tree-node`);
        if ("click" in el) ((el as unknown) as any)["click"]();
      }, 500);
    },

    async search() {
      const that = this;
      const resolve = (res) => {
        that.searchResult =
          res.length > 1
            ? res.reduce((pre, item) => {
              let children = [];
              if (item.children) {
                children = item.children;
                delete item.children;
              }
              if (!pre.length) return [pre].concat(item).concat(children);
              else {
                return pre.concat(item).concat(children);
              }
            })
            : res;
      };
      this.treeDataFuncByLevel({}, resolve, this.selectedKey);
    },

    /**
     * @name: clickItemDetail
     * @description: 点击元素详情按钮事件
     * @authors: CZH
     * @Date: 2023-01-28 15:08:50
     * @param {*} data
     */
    async clickItemDetail(data) {
      const that = this;
      if (this.clickItemDetailFunc) this.clickItemDetailFunc(that, data);
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
        this.$emit("search");
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
      btn["isLoading"] = false;
    },

    async searchByName() {
      if (this.searchFuncByName) {
        let res = await this.searchFuncByName(this.selectedKey);
        this.searchResult = res as SearchResult[];
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.menuBox {
  width: 100%;
  height: 100%;
  transition: all 0.3;

  ::v-deep .el-tree-node__label {
    width: calc(100% - 12px);
  }

  .searchBar {
    display: flex;
  }

  .content {
    width: 100%;
    height: auto;
    max-height: calc(100% - 40px);
    overflow-y: auto;
    overflow-x: hidden;

    .searchItem {
      margin: 4px 18px;
      width: calc(100% - 16px);
    }
  }
}

.treeNode {
  flex: 1;
  align-items: center;
  justify-content: space-between;
  display: flex;
  line-height: 30px;
  width: 100%;
  overflow: hidden;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .text {
    width: calc(100% - 40px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}

.flexItem {
  align-items: center;
  display: flex;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  justify-content: space-between;
  width: 100%;
  color: #666;
}


::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
  transition: all 0.2s;
}

::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: var(--el-color-primary);
  border-radius: 6px;
  color: #fff;
  margin: 3px 0px;
}
</style>
