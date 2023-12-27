<!--
 * @Date: 2022-05-29 11:25:08
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-19 16:10:57
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/customForElement/slider.vue
-->
<script lang="ts">
import { defineComponent, h, toRefs, ref } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import { ElPopover, ElButton, ElSlider, ElDivider } from 'element-plus';
import { useCardStyleConfigHook } from '../../../../store/modules/cardStyleConfig';
import { componentInfo, gridSizeMaker } from '../../../../components/basicComponents/grid/module/dataTemplate';
export default defineComponent({
    componentInfo: {
        labelNameCn: "滑块组件",
        key: "slider",
        description: '滑块组件',
        gridInfo: {
            middle: gridSizeMaker(9, 2),
        },
    } as componentInfo,
    mixins: [baseComponents],
    props: ["label", 'marks', 'step', 'showStops', 'showInput', "type", "range", "max", 'min', 'loading', "sizeUnit", "onChangeFunc", "icon", "detail", 'cusStyle', 'defaultValue'],
    setup(props, context) {
        context.emit("ready");
        let modelValue = ref(props.defaultValue)
        return () => [
            h(
                cardBg,
                {
                    style: {
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        padding: '12px',
                        paddingTop: '0px'
                    },
                },
                () => [
                    props.label ? h(
                        ElDivider,
                        {
                            style: {
                                width: 'calc(100% - 24px)',
                                marginLeft: "12px"
                            },
                            contentPosition: "left"
                        }, () => [
                            props.label
                        ]
                    ) : null,
                    h(
                        ElSlider,
                        {
                            style: {
                                cursor: "pointer",
                                width: 'calc(100% - 48px)',
                                height: 'calc(100% - 49px)',
                                margin: '24px auto',
                                borderRadius: useCardStyleConfigHook().get('borderRadius') + 'px',
                                ...props.cusStyle,
                            },
                            onInput: (val) => {
                                modelValue.value = val
                            },
                            onChange: (val) => {
                                if (props.onChangeFunc) {
                                    props.onChangeFunc(context, val)
                                }
                            },
                            modelValue: modelValue.value,
                            showInput: true,
                            ...props,
                        }
                    )
                ]
            )
        ];
    },
});
</script>
