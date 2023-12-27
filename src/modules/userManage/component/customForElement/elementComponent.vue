<!--
 * @Date: 2022-05-29 11:25:08
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-19 15:03:54
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/customForElement/elementComponent.vue
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
        labelNameCn: "自定义组件",
        key: "elementComponent",
        description: '滑块组件',
        gridInfo: {
            middle: gridSizeMaker(9, 2),
        },
    } as componentInfo,
    mixins: [baseComponents],
    props: ['baseData', 'detail', 'component', 'propsData', 'onEvent'],
    setup(props, context) {
        context.emit("ready");
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
            )
        ];
    },
});
</script>
