<!--
 * @Date: 2022-01-22 19:23:46
 * @LastEditors: CZH
 * @LastEditTime: 2022-06-16 23:41:28
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/icon/iconCell.vue
-->
<script lang="tsx">
import { getIcon } from "@/utils";
import { ElIcon } from "element-plus";
import { defineComponent, h, toRefs } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";

export default defineComponent({
  mixins: [baseComponents],
  name: "lessIcon",
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
    isLoadingIcon: {
      type: Boolean,
      default: false,
    },
  },
  setup: (props) => {
    const { isLoadingIcon, iconOption } = toRefs(props);
    return () =>
      h(
        ElIcon,
        {
          style: {
            ...iconOption.value,
          },
          color: iconOption.value.color ? iconOption.value.color : "",
          size: iconOption.value.fontSize ? iconOption.value.fontSize : "",
          class: [isLoadingIcon.value ? "is-loading" : ""],
        },
        () => h(getIcon(props.name + ""))
      );
  },
});
</script>
