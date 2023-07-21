<!--
 * @Date: 2023-01-26 09:47:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-22 01:35:47
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/imageInfo/lazyImage.vue
-->

<script lang="ts">
import { defineComponent, h, ref, onMounted, computed } from "vue";
import { useDark } from "@pureadmin/utils";
import { ElImage, ElLoading } from "element-plus";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";

export default defineComponent({
  name: "lazyImage",
  props: [
    "baseData",
    "gridList",
    "sizeUnit",
    "detail",
    "cusStyle",
    "item",
    "clickFunc",
    "testProps",
  ],

  propsDetail: {
    cusStyle: { label: "自定义样式", type: inputType.text },
    item: { label: "piwigo图片对象", type: inputType.obj },
    clickFunc: {
      label: "点击事件",
      type: inputType.functionEditor,
    },
  } as propInfo,

  componentInfo: {
    labelNameCn: "懒加载图片",
    key: "lazyImages",
    description: "懒加载图片,如果处于桌面模式，则鼠标悬浮时展示详细信息。",
    gridInfo: {
      middle: gridSizeMaker(1, 1),
    },
  } as componentInfo,

  setup(props, context) {
    const { isDark } = useDark();
    const isLoading = ref(true);
    const randomClass = "asd" + Math.floor(Math.random() * 100000000000000) + "_";
    let load = ref(null);
    const sizeMap = ["xxlarge", "large", "medium", "small", "2small"];
    const rate = computed({
      get: () => {
        return (
          (props.detail.gridInfo.default.size.width +
            props.detail.gridInfo.default.size.height) /
          (props.sizeUnit.colNum * 2)
        );
      },
      set: () => {},
    });
    const url = computed({
      get: () => {
        const rate =
          (props.detail.gridInfo.default.size.width +
            props.detail.gridInfo.default.size.height) /
          (props.sizeUnit.colNum * 2);
        let a = 4;
        if (rate > 0) a = 4;
        if (rate > 0.1) a = 3;
        if (rate > 0.2) a = 2;
        if (rate > 0.3) a = 1;
        if (rate > 0.4) a = 0;
        let url = "";
        // try {
        url = props.item[sizeMap[a]]?.url;
        if (!url) url = `/imageserver/${props.item["path"].replace("./", "/")}`;
        // } catch (e) {}
        console.log("fuck", props.item, url);
        return url;
      },
      set: () => {},
    });

    onMounted(() => {
      context.emit("ready");
      load.value = ElLoading.service({
        target: "." + randomClass,
      });
    });
    return () =>
      h(
        cardBg,
        {
          onClick: (e: any) => {
            if (props.clickFunc) props.clickFunc({ props, context });
          },
          cusStyle: {
            transform: props.testProps
              ? `rotateX(10deg) skew(327deg) translate(calc(100 / 24 / 3.3 * ${props.detail.gridInfo.default.size.width}vh), 0%)`
              : "",
          },
          onmouseover: (e: any) => {
            console.log(e, "onmouseover");
          },
          onmouseleave: (e: any) => {
            console.log(e, "onmouseleave");
          },
          class: "transform",
        },
        () => [
          h(ElImage, {
            class: randomClass,
            style: { width: "100%", height: "100%" },
            src: url.value,
            fit: rate.value > 0.5 ? "contain" : "cover",
            onLoad: (e) => {
              isLoading.value = false;
              if (load.value) {
                load.value.close();
              }
            },
          }),
        ]
      );
  },
});
</script>

<style scoped>
.transform {
  transition: all 0.5s;
}
.transform:hover {
  z-index: 10000;
}
</style>
