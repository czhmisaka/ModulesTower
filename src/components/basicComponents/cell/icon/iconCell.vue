<!--
 * @Date: 2022-01-22 19:23:46
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-24 21:34:23
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/icon/iconCell.vue
-->
<script lang="tsx">
import { getIcon } from "@/utils";
import { ElIcon } from "element-plus";
import { defineComponent, h, reactive, toRefs } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {baseComponents} from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";

export default defineComponent({
  mixins: [baseComponents],
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
    isLoadingIcon:{
      type:Boolean,
      default:false
    },
  },
  setup: (props,context) => {
    const { sizeUnit,isLoadingIcon } = toRefs(props);
    context.emit('ready');
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
            class:[isLoadingIcon.value? "is-loading":""],
          },
          () => h(getIcon(props.name + ""))
        ),
      ]);
  },
});
</script>
