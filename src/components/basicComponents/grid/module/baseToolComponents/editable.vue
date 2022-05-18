<!--
 * @Date: 2022-05-15 23:05:09
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-15 23:05:10
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/editable.vue
-->
<script lang="ts">
import { defineComponent, h, toRef, ref } from "vue";
import { cardOnChangeType } from "../dataTemplate";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import { ElPopper } from "element-plus";

export default defineComponent({
  props: {
    baseData: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },
    sizeUnit: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, context) {
    const _blockSize = ref(props.sizeUnit.blockSize);
    const emitData = (key: string, value: any) => {
      context.emit("onChange", key, value, {
        type: [cardOnChangeType.onChange],
      });
    };
    return () =>
      h(cardForCus, {}, [
        h(
          ElPopper,
          {
            props: {
              content: `双击${props.baseData.editable ? "关闭" : "打开"}编辑`,
            },
          },
          [
            h(
              "div",
              {
                style: {
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                },
                on: {
                  dblclick: () => {
                    emitData("editable", !props.baseData.editable);
                  },
                },
              },
              [
                h(iconCell, {
                  style: {
                    fontSize: _blockSize.value * 0.6 + "px",
                    margin: _blockSize.value * 0.2 + "px",
                  },
                  props: {
                    theme: "twoTone",
                    type: props.baseData.editable ? "unlock" : "lock",
                  },
                }),
              ]
            ),
          ]
        ),
      ]);
  },
});
</script>
