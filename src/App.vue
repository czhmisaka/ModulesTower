<!--
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-24 16:35:13
 * @FilePath: /configforpagedemo/src/App.vue
-->
<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
  </el-config-provider>
  <lineSlideExchange
    ref="lineSlideExchange"
    :linesNumber="linesNumber"
    :rotate="rotate"
    :start-color="sColor"
    :end-color="eColor"
    :speed="1.3"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import lineSlideExchange from "@/components/animate/lineSlideExchange.vue";

function getRandomColor(): string {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
}
export default defineComponent({
  components: { lineSlideExchange, [ElConfigProvider.name]: ElConfigProvider },
  data() {
    return {
      menu: [],
      sColor: getRandomColor(),
      eColor: getRandomColor(),
      rotate: Math.random() * 360,
      linesNumber: 60,
    };
  },
  computed: {
    meta() {
      return this.$route.meta;
    },
    currentLocale() {
      return zhCn;
    },
  },
  mounted() {
    this.$refs["lineSlideExchange"].start();
    this.$refs["lineSlideExchange"].finish();
  },
  methods: {},
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.wholePage {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  border: 0px;
}
</style>
