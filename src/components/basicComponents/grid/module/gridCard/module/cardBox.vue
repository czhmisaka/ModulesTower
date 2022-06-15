<!--
 * @Date: 2022-05-05 00:07:38
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-24 21:55:07
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/module/cardBox.vue
-->

<template>
  <div class="baseBox">
    <div class="dragBox" :draggable="true">
      <div class="editBox">
        <div
          v-for="(btn, index) in btnList"
          :key="index + '_btn'"
          class="iconBox"
          :style="{
            width: `${sizeUnit.blockSize * 0.8}px`,
            height: `${sizeUnit.blockSize * 0.8}px`,
            margin: `${sizeUnit.blockSize * 0.05}px`,
            textAlign: 'center',
            lineHeight: `${sizeUnit.blockSize * 0.8}px`,
            fontSize: sizeUnit.blockSize * 0.5 + 'px',
            background: '#fff',
            borderRadius: '12px',
            cursor: 'pointer',
          }"
          @dblclick="btnClickDealCenter(btn)"
        >
          <el-tooltip :content="btn.name" placement="top">
            <iconCell
              :name="btn.type"
              :iconOption="{
                color: btn.color,
                margin: `${sizeUnit.blockSize * 0.15}px`,
              }"
              :sizeUnit="sizeUnit"
            />
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { cardOnChangeType } from "../../dataTemplate";
interface Btn {
  type: string;
  name: string;
  theme: string;
  trigger: string;
  color: string;
  [key: string]: any;
}

function btnMaker(
  type: string,
  name: string,
  option: {
    [key: string]: any;
  } = {}
): Btn {
  let back = {
    type,
    name,
    theme: "twoTone",
    color: "#1890ff",
    trigger: type,
    ...option,
  } as Btn;
  return back;
}

import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";

export default defineComponent({
  components: {
    iconCell: iconCell,
  },
  props: {
    sizeUnit: {
      type: Object,
      default: () => {
        return {};
      },
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
    blockSize: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      btnList: [
        btnMaker("Edit", "编辑"),
        btnMaker("Delete", "删除", {
          color: "#f5222d",
        }),
      ],
    };
  },

  methods: {
    /**
     * @name: btnClickDealCenter
     * @description: 按钮点击处理中心
     * @authors: CZH
     * @Date: 2022-05-24 11:31:17
     * @param {*} btn
     */
    btnClickDealCenter(btn: Btn) {
      switch (btn.type) {
        case "Edit":
          this.$emit("onChange", {}, { type: [cardOnChangeType.cardEdit] });
          break;
        case "Delete":
          this.$emit("onChange", {}, { type: [cardOnChangeType.cardDelete] });
          break;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.baseBox {
  top: 0px;
  left: 0px;
  position: absolute;
  transition: all 0.3s;
  float: none;
  width: 0px;
  height: 0px;
}
.dragBox {
  overflow: hidden;
  top: 0px;
  width: 100%;
  height: 100%;
  left: 0px;
  position: absolute;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  flex-flow: column;
}
.editBox {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-around;
  opacity: 0;
  .iconBox {
    transform: translateY(-30px);
    transition: all 0.6s;
    opacity: 0;
  }
}
.dragBox:hover {
  // .dragBox {
  backdrop-filter: blur(10px);
  background: rgba(199, 199, 199, 0.5);
  border-radius: 12px;
  .editBox {
    opacity: 1;
    .iconBox {
      transform: translateY(0px);
      opacity: 1;
    }
  }
}
.moveBox {
  overflow: hidden;
  transition: background 0.1s;
  top: 0px;
  left: 0px;
}
.moveBox:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
