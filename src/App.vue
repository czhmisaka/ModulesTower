<!--
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-28 19:55:00
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
    :speed="1.5"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import lineSlideExchange from "@/components/animate/lineSlideExchange.vue";
import { useUserStoreHook } from "./store/modules/user";
import { useLoading } from "@/store/modules/loading";
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
  watch: {},
  computed: {
    meta() {
      return this.$route.meta;
    },
    currentLocale() {
      return zhCn;
    },
  },
  async created() {},
  mounted() {
    // const that = this;
    // setInterval(() => {
    //   console.log(that.$router.getRoutes());
    // }, 3000);
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

*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
*::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 3px;
}
*::-webkit-scrollbar-thumb {
  background: #e6e8eb;
  border-radius: 3px;
}
</style>
