<!--
 * @Date: 2022-01-22 19:23:46
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-23 21:37:11
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/icon/iconCell.vue
-->
<script lang="tsx">
import { getIcon } from "@/utils";
import { defineComponent, toRefs, h } from "vue";

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
    const { name,iconOption } = toRefs<any>(props);
    return () =>
      h(
        "el-icon",
        {
          props: { iconOption },
        },
        [h(getIcon(name))]
      );
  },
});
</script>
