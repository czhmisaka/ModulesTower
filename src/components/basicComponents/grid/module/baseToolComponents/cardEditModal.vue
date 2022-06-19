<!--
 * @Date: 2022-05-24 14:14:42
 * @LastEditors: CZH
 * @LastEditTime: 2022-06-18 01:08:28
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/cardEditModal.vue
-->

<template>
  <span>
    <div :class="'baseModal ' + (modalControl.isOpen ? 'open' : 'close')" @click="close">
      <div class="formModalBox" @click.stop="fuckNothing">
        <el-card header="组件属性" class="card">
          <el-form :model="data" v-on:submit.prevent>
            <el-form-item
              v-for="(formItem, index) in dataInputTemplate"
              :key="index + '_FormItem'"
              :label="formItem.label"
            >
              <el-input v-model="data[formItem.key]" />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card header="组件模式" class="card">
          <el-form ref="form" v-on:submit.prevent>
            <el-form-item label="模式">
              <el-select v-model="cardComponentDetail.type" placeholder="组件加载模式">
                <el-option
                  :label="item"
                  :value="item"
                  v-for="item in cardComponentType"
                  :key="item + 'cardComponentType'"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="代码"
              v-if="cardComponentDetail.type == cardComponentType.fromData"
            >
              <Codemirror
                v-model="cardComponentDetail.data"
                :options="cmOptions"
                :height="400"
                border
              />
            </el-form-item>
          </el-form>
        </el-card>

        <div class="BtnList">
          <el-button class="btn" type="primary" @click="close(true)">保存</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
// 配置代码编辑器
import Codemirror from "codemirror-editor-vue3";
import { EditorConfiguration } from "codemirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/xq-dark.css";

const cmOptions = {
  mode: "javascript", // 语言模式
  theme: "xq-dark", // 主题
  lineNumbers: false, // 显示行号
  smartIndent: true, // 智能缩进
  indentUnit: 4, // 智能缩进单位为4个空格长度
  abSize: 4,
  foldGutter: true, // 启用行槽中的代码折叠
  styleActiveLine: true, // 显示选中行的样式
} as EditorConfiguration;

import { componentLists } from "@/components/basicComponents/grid/module/gridCard/module/componentLists";
import {
  componentGetter,
  cardComponent,
  cardComponentType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { defineComponent } from "vue";

export default defineComponent({
  name: "cardEditModal",
  components: {
    Codemirror,
  },
  props: ["detail", "gridList", "componentIndex"],
  data() {
    return {
      componentLists,
      modalControl: {
        isOpen: false,
      } as { [key: string]: any },

      data: {} as { [key: string]: any },
      dataInputTemplate: [] as Array<{
        [key: string]: any;
      }>,

      // codeMirrorOptions: cmOptions,
      cmOptions,

      cardComponentDetail: {} as cardComponent,
      cardComponentType,
    };
  },
  methods: {
    getPropsData() {
      // 拆分组件属性,设置表单数据
      this.dataInputTemplate = [];
      this.data = { ...this.detail.options.props };

      // componentList 模式属性预先加载
      if (this.detail.component.type == cardComponentType.componentList) {
        const props = componentGetter(this.detail.component, componentLists).settngDetail
          .props;
        for (let x in props) {
          this.dataInputTemplate.push({
            key: x,
            ...props[x],
          });
        }
      }

      // 获取当前组件模式
      this.cardComponentDetail = { ...this.detail.component };

      this.$forceUpdate();
    },

    async open() {
      this.getPropsData();
      await this.$nextTick();
      this.modalControl.isOpen = true;
    },

    async close(needSave = false) {
      if (needSave) {
        const gridList = [...this.gridList];
        gridList[this.componentIndex] = {
          ...this.detail,
          options: {
            ...this.detail.options,
            props: {
              ...this.detail.options.props,
              ...this.data,
            },
          },
          component: {
            ...this.detail.component,
            ...this.cardComponentDetail,
          },
        };
        this.$emit("onChange", this.componentIndex, gridList);
      }
      this.modalControl.isOpen = false;
    },

    fuckNothing() {},
  },
});
</script>

<style lang="scss" scoped>
.baseModal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  //   z-index: 1000000000;
  z-index: -1;
  opacity: 0;
  top: 0px;
  left: 0px;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  .formModalBox {
    transform: scale(0.4);
  }
}

.open {
  opacity: 1;
  z-index: 10000000000;
  .formModalBox {
    transform: scale(1);
  }
}

.formModalBox {
  transition: all 0.4s;
  position: absolute;
  width: 80vw;
  top: 10vh;
  height: 80vh;
  min-width: 800px;
  max-width: 1400px;
  border-radius: 12px;
  background: #fefefe;
  overflow-x: hidden;
  overflow-y: scroll;
  .card {
    width: calc(100% - 20px);
    height: auto;
    margin: 10px;
    border-radius: 6px;
    text-align: left;
  }
  .BtnList {
    position: relative;
    text-align: right;
    bottom: 12px;
    width: 100%;
    right: 12px;
    width: auto;
    height: auto;
    margin-top: 30px;
    .btn {
      margin-right: 12px;
    }
  }
}

.cm-s-xq-dark .CodeMirror-line::selection,
.cm-s-xq-dark .CodeMirror-line > span::selection,
.cm-s-xq-dark .CodeMirror-line > span > span::selection {
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}
</style>
