



import { defineAsyncComponent } from 'vue';
export const componentLists: { [key: string]: any } = {
    'iconCell': defineAsyncComponent(() => import('@/components/basicComponents/cell/icon/iconCell.vue')),
    'cardCell': defineAsyncComponent(() => import('@/components/basicComponents/cell/card/cardCell.vue'))
}