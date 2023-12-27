<!--
 * @Date: 2023-12-14 17:59:20
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-24 22:29:08
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/searchTable/info/colEditor.vue
-->
<template>
    <cardBg>
        <ElDivider content-position="left" style="width:calc(100% - 48px);margin-left:24px">{{ label }}</ElDivider>
        <VueDraggable v-model="queryItemTemplateLocal" :animation="150" :group="groupName">
            <div v-for=" item  in  queryItemTemplateLocal " :key="item.key">
                <cardBg :cus-style="{
                    width: 'calc(100% - 24px) ！important',
                    padding: '6px',
                    margin: '12px'
                }
                    ">
                    <div class="flexbox">
                        <div class="word">
                            {{ item.label }}
                        </div>
                        <el-switch v-model="item.showAble" inline-prompt active-text="展示" inactive-text="隐藏" />
                    </div>
                </cardBg>
            </div>
        </VueDraggable>
    </cardBg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VueDraggable } from 'vue-draggable-plus';
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { tableCellTemplate } from '../../../types';
import { componentInfo } from '@/components/basicComponents/grid/module/dataTemplate';
import CardBg from '@/components/basicComponents/cell/card/cardBg.vue';
import { deepClone } from '@/utils';

export default defineComponent({
    componentInfo: {
        labelNameCn: "表单列排序",
        key: "colEditor",
        description: "表单列排序菜单",
        gridInfo: {},
    } as componentInfo,
    components: { VueDraggable, cardBg },
    props: {
        groupName: {
            type: String,
            default: 'colEditor'
        },
        queryItemTemplate: {
            type: Array,
            default: () => [] as tableCellTemplate[]
        },
        onChange: {
            type: Function,
            default: () => { return () => { } }
        },
        label: {
            type: String,
            default: '列表配置'
        },
    },
    watch: {
        queryItemTemplateLocal: {
            async handler(val) {
                await this.onChange(this, val)
            },
            deep: true
        }
    },
    data: () => {
        return {
            queryItemTemplateLocal: []
        }
    },
    async mounted() {
        this.queryItemTemplateLocal = JSON.parse(JSON.stringify(this.queryItemTemplate))
        this.$emit('ready')
    },
    methods: {

    },

})
</script>

<style scoped lang="scss">
.flexbox {
    display: flex;
    justify-content: space-between;

    .word {
        line-height: 32px;
        font-weight: 500;
    }
}
</style>