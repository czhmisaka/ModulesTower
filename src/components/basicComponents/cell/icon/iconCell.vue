<!--
 * @Date: 2022-01-22 19:23:46
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-22 18:18:20
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/icon/iconCell.vue
-->
<script lang="tsx">
import { getIcon } from "@/utils";
import { ElIcon } from "element-plus";
import { defineComponent, h, reactive, toRefs } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

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
        return {};
      },
    },
  },
  setup: (props) => {
    const { sizeUnit } = toRefs(props);
    return () =>
      h(cardBg, {}, () => [
        h(
          ElIcon,
          {
            style: {
              margin: sizeUnit.value.blockSize * 0.25 + "px",
              fontSize:sizeUnit.value.blockSize * 0.5 + "px",
              ...props.iconOption,
            },
          },
          () => h(getIcon(props.name + ""))
        ),
      ]);
  },
});
</script>
