<script lang="ts">
import { ElCard } from "element-plus";
import { defineComponent, h } from "vue";
export default defineComponent({
  name: "cardCell",
  setup(props, { slots }) {
    return () =>
      h(
        ElCard,
        {
          class: "wholeBox",
        },
        slots.default
      );
  },
});
</script>

<style lang="scss" scoped>
.wholeBox {
  width: 100%;
  height: 100%;
}
</style>
