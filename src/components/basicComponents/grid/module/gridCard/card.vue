<!--
 * @Date: 2022-04-29 15:02:20
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-29 15:02:21
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/card.vue
-->
<script lang="ts">
import cardBox from "@/components/basicComponents/grid/module/gridCard/module/cardBox.vue";
import { h, defineComponent } from "vue";
import { componentGetter } from "./../dataTemplate";
import { componentLists } from "./module/componentLists";
export default defineComponent({
  name: "gridCardBox",
  props: {
    detail: {
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
  methods: {},
  setup(props) {
    let children = props.detail.options.children ? props.detail.options.children : null;
    return () => [
      h(cardBox, {
        blockSize: props.sizeUnit.blockSize,
        detail: props.detail,
      }),
      h(
        componentGetter(props.detail.component, componentLists),
        {
          ...props.detail.options.props,
        },
        () => (children ? children : null)
      ),
    ];
  },
});
</script>
