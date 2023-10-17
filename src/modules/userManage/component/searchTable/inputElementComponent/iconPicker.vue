<!--
 * @Date: 2023-07-21 17:14:55
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-07 14:40:58
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/searchTable/inputElementComponent/iconPicker.vue
-->
<template>
  <div>
    <el-popover
      placement="bottom"
      title="选择图标"
      width="510px"
      trigger="click"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button>
          <component v-if="selected" :is="useRenderIcon(selected)" />
          &nbsp;&nbsp; 选择图标
        </el-button>
      </template>
      <template #default>
        <div class="scrollBox">
          <CardBg
            title="图标颜色"
            :cus-style="{
              width: '480px',
              height: 'auto',
              padding: '6px',
              overflow: 'none',
              position: 'relative',
              zIndex: '1211',
            }"
          >
            <el-button
              v-for="c in colors"
              :color="c"
              size="small"
              style="margin-top: 6px"
              @click="selected.color = c"
              class="colorBox"
            >
            </el-button>
            <div
              :style="{
                display: 'inline-block',
                transform: 'translate(8px, 5.5px)',
              }"
            >
              <el-color-picker
                :append-to-body="true"
                :teleported="false"
                size="small"
                v-model="selected.color"
              />
            </div>
            <div
              :style="{
                display: 'inline-block',
                transform: 'translate(14px, 3.5px)',
              }"
            >
              <el-button
                type="default"
                size="small"
                plain
                @click="
                  selected.color = '';
                  selected.src = '';
                "
              >
                清除图标
              </el-button>
            </div>
          </CardBg>
          <CardBg
            title="系统图标"
            :cus-style="{
              marginTop: '6px',
              width: '480px',
              height: 'auto',
              padding: '6px',
            }"
            class="flexBox"
          >
            <div
              v-for="item in elIcons"
              class="iconBox"
              @click="selected = { ...selected, ...item }"
            >
              <component
                :is="useRenderIcon({ ...item, color: selected.color })"
                class="iconCell"
              />
            </div>
          </CardBg>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as Icons from "@element-plus/icons-vue";
// 使用svg的icon
const svg = import.meta.glob("@/assets/svg/icon/*.svg");

import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, toRaw, PropType, nextTick, computed, CSSProperties } from "vue";
import CardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { max } from "lodash";
import { IconType, iconTemplate } from "./iconPicker";

let elIcons = [];
for (let x in Icons) {
  elIcons.push({
    iconType: IconType.elIcon,
    src: x,
  } as iconTemplate);
}

let svgIcon = [];

export default defineComponent({
  name: "iconPicker",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  components: { CardBg },
  watch: {
    selected: {
      handler(val) {
        if (Object.keys(val).length > 0)
          this.$emit("update:modelValue", JSON.stringify(this.selected));
      },
      deep: true,
      immediate: true,
    },
    modelValue: {
      handler(val) {
        this.selected = JSON.parse(val);
      },
    },
  },
  data: () => {
    return {
      elIcons,
      colors: ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399", "#000"],
      selected: {} as iconTemplate,
    };
  },
  async mounted() {
    // console.log(this.modelValue, "alue");
    try {
      this.selected = JSON.parse(this.modelValue);
    } catch {}
  },
  methods: {
    useRenderIcon,
    ref,
    toRaw,
    nextTick,
    computed,
  },
});
</script>
<style lang="scss" scoped>
.scrollBox {
  padding: 3px;
  max-height: 50vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.iconBox {
  float: left;
  width: 33px;
  margin: 3px;
  height: 33px;
  line-height: 33px;
  text-align: center;
  border-radius: 2px;
  border: 0px solid #ccc;
  transition: box-shadow 0.3s, transform 0.4s, border-radius 0.3s;
  .iconCell {
  }
}
.iconBox:hover {
  transform: translate(-1px, -1px);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}
.colorBox {
  transition: box-shadow 0.3s, transform 0.4s, border-radius 0.3s;
}

.colorBox:hover {
  transform: translate(-1px, -1px);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}
</style>
