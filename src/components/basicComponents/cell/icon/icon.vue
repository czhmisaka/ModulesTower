<!--
 * @Date: 2022-05-29 11:25:08
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-29 11:25:16
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/icon/icon.vue
-->
<script lang="ts">
import { defineComponent, h, toRefs } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
export default defineComponent({
  mixins: [baseComponents],
  props: ["name", "sizeUnit", "onClickFunc"],
  setup(props, context) {
    context.emit("ready");
    const { onClickFunc } = toRefs(props);
    return () => [
      h(cardBg, {}, () => [
        h(iconCell, {
          name: props.name,
          sizeUnit: props.sizeUnit,
          ondblclick: (e: any) => onClickFunc.value({ props, context, e }),
        }),
      ]),
    ];
  },
});
</script>
