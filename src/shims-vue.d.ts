/*
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-11 09:39:05
 * @FilePath: /configforpagedemo/src/shims-vue.d.ts
 */
/* eslint-disable */

declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module 'vue-drag-resize' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module 'vue3-grid-layout' {
  import { VueGridLayout } from 'vue3-grid-layout'
  const Component: ReturnType<typeof VueGridLayout>
  export default Component
}  
declare module 'vue3markedcomponent' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

