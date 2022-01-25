<!--
 * @Date: 2022-01-22 19:23:46
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-24 09:36:24
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/icon/iconCell.vue
-->
<script lang="tsx">
import { getIcon } from "@/utils";
import { ElIcon } from "element-plus";
import { defineComponent, h } from "vue";

export default defineComponent({
  name: "CusIcon",
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
  },
  setup: (props) => {
    return () =>
      h(
        ElIcon,
        {
          props: props.iconOption,
        },
        [h(getIcon(props.name + ""))]
      );
  },
});
</script>
