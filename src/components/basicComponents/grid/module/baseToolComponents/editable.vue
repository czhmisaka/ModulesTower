<!--
 * @Date: 2022-05-15 23:05:09
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-22 20:09:45
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/editable.vue
-->
<script lang="ts">
import { defineComponent, h, toRef, ref } from "vue";
import { cardOnChangeType } from "../dataTemplate";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import { ElPopper } from "element-plus";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";

export default defineComponent({
  mixins: [baseComponents],
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
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, context) {
    const _blockSize = ref(props.sizeUnit.blockSize);
    const emitData = (value: any) => {
      context.emit(
        "onChange",
        { editable: value },
        {
          type: [cardOnChangeType.onChange],
        }
      );
    };
    context.emit("ready");
    return () => [
      h(
        ElPopper,
        {
          style: {
            cursor: "pointer",
          },
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
              ondblclick: () => emitData(!props.baseData.editable),
              ontouchend: () => emitData(!props.baseData.editable),
              sizeUnit: props.sizeUnit,
              detail: props.detail,
              name: props.baseData.editable ? "Unlock" : "Lock",
            }),
          ],
        }
      ),
    ];
  },
});
</script>
