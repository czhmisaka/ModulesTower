<!--
 * @Date: 2022-02-02 00:33:54
 * @LastEditors: CZH
 * @LastEditTime: 2022-02-02 20:46:23
 * @FilePath: /configforpagedemo/src/views/customPersonalPreview/Index.vue
-->
<script lang="tsx">
import { defineComponent, h } from "vue";
export default defineComponent({
  name: "custonPersonalPreview",
  data() {
    return {};
  },
  async onload() {},
  async mounted() {
    await this.getPersonData();
  },
  methods: {
    async getPersonalData() {},
  },
});
</script>
