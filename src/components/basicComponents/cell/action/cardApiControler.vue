<!--
 * @Date: 2022-09-21 19:56:51
 * @LastEditors: CZH
 * @LastEditTime: 2022-09-21 20:27:26
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/action/cardApiControler.vue
-->
<template>
  <cardBg>
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
  props: [],
  components: { cardBg },

  data() {
    return {
      actionMap,

      func: null as Function,
      data: "",
    };
  },

  mounted() {
    this.$emit("ready");
  },

  methods: {
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
