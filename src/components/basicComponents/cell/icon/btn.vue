<!--
 * @Date: 2022-05-29 11:25:08
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-15 16:42:51
 * @FilePath: /lcdp_fe_setup/src/components/basicComponents/cell/icon/btn.vue
-->
<script lang="ts">
import { defineComponent, h, toRefs } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import { ElPopover, ElButton } from 'element-plus';
import { useCardStyleConfigHook } from '../../../../store/modules/cardStyleConfig';
export default defineComponent({
    mixins: [baseComponents],
    props: ["label", "type", 'loading', "sizeUnit", "onClickFunc", "icon", "detail", 'cusStyle'],
    setup(props, context) {
        context.emit("ready");
        const { onClickFunc } = toRefs(props);
        return () => [
            h(
                ElButton,
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
                        width: '100%',
                        height: '100%',
                        margin: '0px auto',
                        borderRadius: useCardStyleConfigHook().get('borderRadius') + 'px',
                        ...props.cusStyle,
                    },
                    ...props
                },
                () => [props.label])
        ];
    },
});
</script>
