<!--
 * @Date: 2022-05-24 14:14:42
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-24 23:56:35
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/cardEditModal.vue
-->

<template>
  <span>
    <div :class="'baseModal ' + (modalControl.isOpen ? 'open' : 'close')" @click="close">
      <div class="formModalBox" @click.stop="fuckNo">
        <el-card title="组件属性" class="card">
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
        <div class="BtnList">
          <el-button class="btn" type="primary" @click="close(true)">保存</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import { componentLists } from "@/components/basicComponents/grid/module/gridCard/module/componentLists";
import { componentGetter } from "@/components/basicComponents/grid/module/dataTemplate";
import { defineComponent } from "vue";

export default defineComponent({
  name: "cardEditModal",
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
    };
  },
  methods: {
    getPropsData() {
      this.data = { ...this.detail.options.props };
      const props = componentGetter(this.detail.component, componentLists).settngDetail
        .props;
      this.dataInputTemplate = [];
      for (let x in props) {
        this.dataInputTemplate.push({
          key: x,
          ...props[x],
        });
      }
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
        };
        this.$emit("onChange", this.componentIndex, gridList);
      }
      this.modalControl.isOpen = false;
    },

    fuckNo() {},
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
  .card {
    width: calc(100% - 20px);
    height: auto;
    margin: 10px;
    border-radius: 6px;
  }
  .BtnList {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: auto;
    height: auto;
    .btn {
      margin-right: 12px;
    }
  }
}
</style>
