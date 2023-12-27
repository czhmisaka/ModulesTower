<!--
 * @Date: 2023-12-25 21:55:38
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-25 22:05:22
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/component/iotCard.vue
-->
<template>
    <cardBg>
    </cardBg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import cardBg from '@/components/basicComponents/cell/card/cardBg.vue';

export default defineComponent({
    components:{cardBg},
    props:['baseData','detail','sizeUnit',''],
    setup () {
        return {}
    }
})
</script>

<style scoped>

</style>