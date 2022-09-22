<!--
 * @Date: 2022-09-21 19:56:51
 * @LastEditors: CZH
 * @LastEditTime: 2022-09-22 15:34:20
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/action/cardApiControler.vue
-->
<template>
  <cardBg
    @mouseenter="changeStatus(true)"
    @mouseleave="changeStatus(false)"
    :cus-style="{
      background: 'black',
      color: 'white',
    }"
  >
    <span v-if="status">
      <el-select v-model="func" placeholder="选择调用方式" class="float_left">
        <el-option
          v-for="(item, index) in Object.keys(actionMap)"
          :key="index"
          :label="item"
          :value="actionMap[item]"
        >
        </el-option>
      </el-select>
      <el-input v-model="data" class="float_left"> </el-input>
      <el-button type="primary" @click="action">GO！！！</el-button>
    </span>
    <div v-else :style="'height: 100%; line-height:' + sizeUnit.blockSize + 'px'">
      <el-icon :style="{ fontSize: sizeUnit.blockSize * 0.5 + 'px' }">
        <Edit />
      </el-icon>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  setData,
  changeVisible,
  changeCardPosition,
  changeCardSize,
  changeCardProperties,
} from "../../grid/module/cardApi/index";

const actionMap = {
  setData,
  changeVisible,
  changeCardPosition,
  changeCardSize,
  changeCardProperties,
};

export default defineComponent({
  name: "cardApi调用大师",
  props: ["baseData", "gridList", "sizeUnit"],

  components: { cardBg },

  data() {
    return {
      actionMap,

      func: null as Function,
      data: "",

      status: false,
    };
  },

  mounted() {
    this.$emit("ready");
  },

  methods: {
    changeStatus(status: boolean) {
      this.status = status;
      changeCardPosition(this, {
        cardApiControler: status
          ? {
              x: 1,
              y: 1,
            }
          : {
              x: 2,
              y: 2,
            },
      });
      changeCardSize(this, {
        cardApiControler: status
          ? {
              width: 3,
              height: 3,
            }
          : {
              width: 1,
              height: 1,
            },
      });
    },

    action() {
      try {
        const JSONData = JSON.parse(this.data);
        this.func(this, JSONData);
      } catch {
        ElMessage({
          message: "数据处理失败",
          type: "error",
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.float_left {
  float: left;
  max-width: 40%;
}
</style>
