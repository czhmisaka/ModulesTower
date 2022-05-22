import { defineAsyncComponent, defineComponent, h } from 'vue';
import { cardComponentMaker, inputType } from './../../dataTemplate'
export const componentLists: { [key: string]: any } = {
    'iconCell': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/icon/iconCell.vue')), {
        icon: {
            type: inputType.text,
        }
    }, {}),
    'cardCell': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/card/cardCell.vue')), {}, {}),
    'setting_editable': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/grid/module/baseToolComponents/editable.vue')), {}, {}),
    'elcard': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/info/infoCard.vue')), {}, {}),
    'iframe': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/info/iframe.vue')), {}, {}),    
}