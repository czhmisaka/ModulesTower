<!--
 * @Date: 2022-08-11 20:17:17
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-14 12:07:37
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/propInputDeal.vue
-->

<script lang="ts">
import { defineComponent, ref, h } from "vue";
import { inputType } from "./../dataTemplate";
import { ElInput, ElSlider, ElInputNumber, ElSwitch } from "element-plus";

const inputComponentsMap = {
  text: {
    component: ElInput,
    props: {},
  },

  numberSlider: {
    component: ElSlider,
    props: {},
  },

  number: {
    component: ElInputNumber,
    props: {},
  },

  boolean: {
    component: ElSwitch,
    props: {},
  },
} as {
  [key: string]: any;
};

export default defineComponent({
  props: {
    inputType: {
      type: String,
      default: () => {
        return "" as inputType;
      },
    },
  },
  setup(props, content) {
    if (props.inputType && Object.keys(inputComponentsMap).indexOf(props.inputType))
      return () => [h(inputComponentsMap[props.inputType].component, {})];
  },
});
</script>
