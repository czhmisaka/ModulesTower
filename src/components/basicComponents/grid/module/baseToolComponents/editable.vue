<!--
 * @Date: 2022-05-29 11:25:08
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-27 17:25:52
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/icon/icon.vue
-->
<script lang="ts">
import { defineComponent, h } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import { setData } from "../cardApi/index";
export default defineComponent({
  mixins: [baseComponents],
  props: ["sizeUnit", "detail", "baseData"],
  setup(props, context) {
    context.emit("ready");
    return () => [
      h(
        cardBg,
        {
          ondblclick: (e: any) => {
            setData(context, {
              editable: !props.baseData.editable,
            });
          },
          ontouchend: (e: any) => {
            setData(context, {
              editable: !props.baseData.editable,
            });
          },
          style: {
            cursor: "pointer",
          },
        },
        () =>
          h(iconCell, {
            name: !props.baseData.editable ? "Lock" : "Unlock",
            sizeUnit: props.sizeUnit,
            detail: props.detail,
          })
      ),
    ];
  },
});
</script>
