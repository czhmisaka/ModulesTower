<template>
  <div ref="layoutContainer" class="vue-grid-layout" :style="mergedStyle">
    <slot></slot>
    <GridItem v-show="isDragging" ref="gridItem" class="vue-grid-placeholder" :x="placeholder.x" :y="placeholder.y"
      :w="placeholder.w" :h="placeholder.h" :i="placeholder.i" />
  </div>
</template>
<script lang="ts" setup>
import mitt from "mitt";
import {
  bottom,
  cloneLayout,
  compact,
  getAllCollisions,
  getLayoutItem,
  moveElement,
  validateLayout,
  eventBusKey,
  parentRootKey,
  isDraggableKey,
  isResizableKey,
  rowHeightKey,
  maxRowsKey,
  colNumKey,
  containerWidthKey,
  marginKey,
  useCssTransformsKey,
  isMirroredKey,
} from "./helpers/utils";
import { Layout, LayoutItem } from "./types";
import {
  findOrGenerateResponsiveLayout,
  getBreakpointFromWidth,
  getColsFromBreakpoint,
} from "./helpers/responsiveUtils";
import GridItem from "./GridItem.vue";
import { useResizeObserver } from "@vueuse/core";
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  toRef,
  watch,
} from "vue";

import { layoutProps } from "./props";
const emit = defineEmits([
  "layout-created",
  "layout-mounted",
  "layout-before-mount",
  "layout-updated",
  "layout-ready",
  "update:layout",
  "breakpoint-changed",
]);

const props = defineProps(layoutProps);
const eventBus = mitt();
const layoutContainer = ref(null);

provide(eventBusKey, eventBus);
provide(parentRootKey, layoutContainer);
provide(isDraggableKey, toRef(props, "isDraggable"));
provide(isResizableKey, toRef(props, "isResizable"));
provide(isMirroredKey, toRef(props, "isMirrored"));
provide(rowHeightKey, toRef(props, "rowHeight"));
provide(maxRowsKey, toRef(props, "maxRows"));
provide(colNumKey, toRef(props, "colNum"));
provide(marginKey, toRef(props, "margin"));
provide(useCssTransformsKey, toRef(props, "useCssTransforms"));

const width = ref(100);
useResizeObserver(layoutContainer, (entries) => {
  const entry = entries[0];
  width.value = entry.contentRect.width;
  updateHeight();
});
provide(containerWidthKey, width);

const mergedStyle = ref({});
const isDragging = ref(false);
const placeholder = reactive<{
  x: number;
  y: number;
  w: number;
  h: number;
  i: number | string;
}>({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  i: -1,
});
let layouts: any = {};
let lastBreakpoint: string | null = null; // store last active breakpoint
let originalLayout: Layout; // store original Layout

const containerHeight = () => {
  if (!props.autoSize) return;
  const buffer = 15;
  return (
    bottom(props.layout!) * (props.rowHeight + props.margin[1]) +
    props.margin[1] +
    buffer +
    "px"
  );
};

const updateHeight = () => {
  mergedStyle.value = {
    height: containerHeight(),
  };
};

const findDifference = (layout: Layout, originalLayout: Layout) => {
  const uniqueResultOne = layout.filter((obj) => {
    return !originalLayout.some((obj2) => {
      return obj.i === obj2.i;
    });
  });

  const uniqueResultTwo = originalLayout.filter((obj) => {
    return !layout.some((obj2) => {
      return obj.i === obj2.i;
    });
  });

  return uniqueResultOne.concat(uniqueResultTwo);
};
const initResponsiveFeatures = () => {
  layouts = Object.assign({}, props.responsiveLayouts);
};
const layoutUpdate = () => {
  if (props.layout !== undefined && props.layout && props.layout.length) {
    if (!originalLayout) originalLayout = [];
    if (props.layout.length !== originalLayout.length) {
      const diff = findDifference(props.layout, originalLayout);
      if (diff.length > 0) {
        if (props.layout.length > originalLayout.length) {
          originalLayout = originalLayout.concat(diff);
        } else {
          originalLayout = originalLayout.filter((obj) => {
            return !diff.some((obj2) => {
              return obj.i === obj2.i;
            });
          });
        }
      }
      initResponsiveFeatures();
    }
    compact(props.layout, props.verticalCompact);
    updateHeight();
    emit("layout-updated", props.layout);
  }
};
watch([() => props.layout?.length, () => props.layout, () => props.margin], () => {
  layoutUpdate();
});

watch(
  () => props.responsive,
  () => {
    if (!props.responsive) {
      emit("update:layout", originalLayout);
    }
  }
);
const responsiveGridLayout = () => {
  const newBreakpoint = getBreakpointFromWidth(props.breakpoints, width.value);
  const newCols = getColsFromBreakpoint(newBreakpoint, props.responsiveCols);

  if (lastBreakpoint !== null && !layouts[lastBreakpoint])
    layouts[lastBreakpoint] = cloneLayout(props.layout!);

  const layout = findOrGenerateResponsiveLayout(
    originalLayout,
    layouts,
    props.breakpoints,
    newBreakpoint,
    lastBreakpoint as string,
    newCols,
    props.verticalCompact
  );

  layouts[newBreakpoint] = layout;
  if (lastBreakpoint !== newBreakpoint) {
    emit("breakpoint-changed", newBreakpoint, layout);
  }

  emit("update:layout", layout);
  lastBreakpoint = newBreakpoint;
  eventBus.emit("setColNum", getColsFromBreakpoint(newBreakpoint, props.responsiveCols));
};

const resizeEvent = (
  eventName: string,
  id: string | number,
  x: number,
  y: number,
  h: number,
  w: number
) => {
  let l = getLayoutItem(props.layout!, id) as LayoutItem;

  if (l === undefined || l === null) {
    l = { h: 0, w: 0, x: 0, y: 0, i: id };
  }
  let hasCollisions = false;
  if (props.preventCollision) {
    const collisions = getAllCollisions(props.layout!, { ...l, w, h }).filter(
      (layoutItem) => layoutItem.i !== l.i
    );

    hasCollisions = collisions.length > 0;

    if (hasCollisions) {
      let leastX = Infinity;
      let leastY = Infinity;
      collisions.forEach((layoutItem) => {
        if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x);
        if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y);
      });
      if (Number.isFinite(leastX)) l.w = leastX - l.x;
      if (Number.isFinite(leastY)) l.h = leastY - l.y;
    }
  }
  if (!hasCollisions) {
    l.w = w;
    l.h = h;
  }
  if (eventName === "resizestart" || eventName === "resizemove") {
    placeholder.i = id;
    placeholder.x = x;
    placeholder.y = y;
    placeholder.w = l.w;
    placeholder.h = l.h;
    nextTick(() => {
      isDragging.value = true;
    });
  } else {
    nextTick(() => {
      isDragging.value = false;
    });
  }
  if (props.responsive) responsiveGridLayout();
  compact(props.layout!, props.verticalCompact);
  eventBus.emit("compact");
  updateHeight();
  if (eventName === "resizeend") emit("layout-updated", props.layout);
};

function resizeEventHandler({
  eventType,
  i,
  x,
  y,
  h,
  w,
}: {
  eventType: string;
  i: string | number;
  x: number;
  y: number;
  h: any;
  w: any;
}) {
  resizeEvent(eventType, i, x, y, h, w);
}
const dragEvent = (
  eventName: string,
  id: string | number,
  x: number,
  y: number,
  h: number,
  w: number
) => {
  let l = getLayoutItem(props.layout!, id);

  if (l === undefined || l === null) {
    l = { h: 0, w: 0, x: 0, y: 0, i: id };
  }
  if (eventName === "dragmove" || eventName === "dragstart") {
    placeholder.i = id;
    placeholder.x = l.x;
    placeholder.y = l.y;
    placeholder.w = w;
    placeholder.h = h;
    nextTick(() => {
      isDragging.value = true;
    });
  } else {
    nextTick(() => {
      isDragging.value = false;
    });
  }

  moveElement(props.layout!, l, x, y, true, props.preventCollision);
  compact(props.layout!, props.verticalCompact);
  eventBus.emit("compact");
  updateHeight();
  if (eventName === "dragend") emit("layout-updated", props.layout);
};
const dragEventHandler = ({
  eventType,
  i,
  x,
  y,
  h,
  w,
}: {
  eventType: string;
  i: string | number;
  x: number;
  y: number;
  h: any;
  w: any;
}) => {
  dragEvent(eventType, i, x, y, h, w);
};
// @ts-ignore
eventBus.on("resizeEvent", resizeEventHandler);
//@ts-ignore
eventBus.on("dragEvent", dragEventHandler);
emit("layout-created", props.layout);
emit("layout-before-mount", props.layout);

onBeforeUnmount(() => {
  // @ts-ignore
  eventBus.off("resizeEvent", resizeEventHandler);
  // @ts-ignore
  eventBus.off("dragEvent", dragEventHandler);
});

onMounted(() => {
  emit("layout-mounted", props.layout);
  nextTick(() => {
    validateLayout(props.layout!);
    originalLayout = props.layout!;
    nextTick(() => {
      initResponsiveFeatures();
      compact(props.layout!, props.verticalCompact);
      emit("layout-updated", props.layout);
      updateHeight();
    });
  });
});
</script>
<style scoped>
.vue-grid-layout {
  position: relative;
  transition: height 200ms ease;
}
</style>
