<!--
 * @Date: 2022-05-29 11:25:08
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-25 20:20:21
 * @FilePath: /lcdp_fe_setup/src/components/basicComponents/cell/icon/icon.vue
-->
<script lang="ts">
import { defineComponent, h, toRefs } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import { ElPopover } from "element-plus";
export default defineComponent({
  mixins: [baseComponents],
  props: ["name", "sizeUnit", "onClickFunc", "tips", "detail"],
  setup(props, context) {
    context.emit("ready");
    const { onClickFunc } = toRefs(props);
    return () => [
      h(
        cardBg,
        {
          // ondblclick: (e: any) => {
          onclick: (e: any) => {
            if (typeof onClickFunc.value == "function")
              onClickFunc.value({ props, context, e });
            else if (typeof onClickFunc.value == "string") {
              const func = eval(`()=>` + onClickFunc.value);
              func()({ props, context, e });
            }
          },
          ontouchend: (e: any) => {
            if (typeof onClickFunc.value == "function")
              onClickFunc.value({ props, context, e });
            else if (typeof onClickFunc.value == "string") {
              const func = eval(`()=>` + onClickFunc.value);
              func()({ props, context, e });
            }
          },
          style: {
            cursor: "pointer",
          },
        },
        () =>
          props.tips
            ? h(
              ElPopover,
              {
                trigger: "hover",
                content: props.tips,
                width: "auto",
              },
              {
                reference: () =>
                  h(iconCell, {
                    name: props.name,
                    sizeUnit: props.sizeUnit,
                    detail: props.detail,
                  }),
              }
            )
            : h(iconCell, {
              name: props.name,
              sizeUnit: props.sizeUnit,
              detail: props.detail,
            })
      ),
    ];
  },
});
</script>
