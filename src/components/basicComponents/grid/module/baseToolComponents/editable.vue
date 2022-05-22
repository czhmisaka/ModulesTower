<!--
 * @Date: 2022-05-15 23:05:09
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-22 00:44:55
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/editable.vue
-->
<script lang="ts">
import { defineComponent, h, toRef, ref } from "vue";
import { cardOnChangeType } from "../dataTemplate";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import { ElPopper } from "element-plus";

export default defineComponent({
  emits: ["onChange"],
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
    gridList: {
      type: Array,
      default: () => {
        return [] as Array<any>;
      },
    },
  },
  setup(props, context) {
    const _blockSize = ref(props.sizeUnit.blockSize);
    const emitData = (key: string, value: any) => {
      console.log("emitData");
      context.emit("onChange", key, value, {
        type: [cardOnChangeType.onChange],
      });
    };
    console.log("render");
    return () => [
      h(
        ElPopper,
        {
          trigger: "hover",
          content: `双击${props.baseData.editable ? "关闭" : "打开"}编辑`,
        },
        {
          trigger: () => [
            h(iconCell, {
              iconOption: {
                fontSize: _blockSize.value * 0.6 + "px",
                margin: _blockSize.value * 0.2 + "px",
              },
              ondblclick: () => emitData("editable", !props.baseData.editable),
              sizeUnit: props.sizeUnit,
              name: props.baseData.editable ? "Unlock" : "Lock",
            }),
          ],
        }
      ),
    ];
  },
});
</script>
