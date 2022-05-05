<!--
 * @Date: 2022-04-29 15:02:20
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-29 15:02:21
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/card.vue
-->
<script lang="ts">
import { h, defineComponent } from "vue";
import cardBox from "@/components/basicComponents/grid/module/gridCard/module/cardBox.vue";
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
  setup(props, context) {
    const onResize = (inputData: any): void => {
      let gridInfo = props.detail.gridInfo;
      gridInfo.default.size = inputData;
      context.emit("setGridInfo", gridInfo);
    };
    return () =>
      h(
        cardBox,
        {
          blockSize: props.sizeUnit.blockSize,
          detail: props.detail,
          onResize: onResize,
        },
        [h(props.detail.component, { ...props.detail.options.props })]
      );
  },
});
</script>
