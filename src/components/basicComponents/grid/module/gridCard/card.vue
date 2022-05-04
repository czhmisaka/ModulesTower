<!--
 * @Date: 2022-04-29 15:02:20
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-29 15:02:21
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/card.vue
-->
<script lang="ts">
import { h, defineComponent } from "vue";
export default defineComponent({
  name: "gridCardBox",
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {},
  setup(props) {
    return () => h(props.detail.component, { ...props.detail.options.props });
  },
});
</script>
