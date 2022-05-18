<!--
 * @Date: 2022-01-22 19:23:46
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-24 09:36:24
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/icon/iconCell.vue
-->
<script lang="tsx">
import { getIcon } from "@/utils";
import { ElIcon } from "element-plus";
import { defineComponent, h, reactive } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { gridCellTemplate } from "../../grid/module/dataTemplate";

export default defineComponent({
  name: "IconCell",
  props: {
    name: {
      type: String,
    },
    iconOption: {
      type: Object,
      default: () => {
        return {};
      },
    },
    sizeUnit: {
      type: Object,
      default: () => {
        return {} as {
          [key: string]: any;
        };
      },
    },
  },
  setup: (props) => {
    const _blockSize = reactive(props.sizeUnit).blockSize;
    console.log(props.iconOption);
    return () =>
      h(cardBg, {}, () => [
        h(
          ElIcon,
          {
            size: _blockSize * 0.5,
          },
          () => h(getIcon(props.name + ""))
        ),
      ]);
  },
});
</script>
