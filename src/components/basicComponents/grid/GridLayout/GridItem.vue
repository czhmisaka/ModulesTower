<template>
  <div ref="itemContainer" class="vue-grid-item" :class="classObj" :style="style.data">
    <slot></slot>
    <span v-if="resizableAndNotStatic" ref="handle" :class="resizableHandleClass"></span>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, nextTick, onMounted, reactive, ref, toRef, watch } from "vue";
import type { Interactable } from "@interactjs/core/Interactable";
import interact from "interactjs";
import {
  setTopLeft,
  setTopRight,
  setTransform,
  setTransformRtl,
  eventBusKey,
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
import { gridItemProps } from "./props";
import { createCoreData, getControlPosition } from "./helpers/draggableUtils";
import { Emitter, EventType } from "mitt";
const eventBus = inject(eventBusKey) as Emitter<Record<EventType, unknown>>;

const emit = defineEmits(["container-resized", "resize", "resized", "move", "moved"]);
const props = defineProps(gridItemProps);

const containerWidth = inject(containerWidthKey, ref(100));
const rowHeight = inject(rowHeightKey, ref(10));
const margin = inject(marginKey, ref([10, 10]));
const maxRows = inject(maxRowsKey, ref(Infinity));
const cols = inject(colNumKey, ref(12));
const useCssTransforms = inject(useCssTransformsKey, ref(true));

const dragEventSet = ref(false);
const resizeEventSet = ref(false);

const previousW = ref(0);
const previousH = ref(0);
const previousX = ref(0);
const previousY = ref(0);
const innerX = ref(props.x);
const innerY = ref(props.y);
const innerW = ref(props.w);
const innerH = ref(props.h);

const rtl = ref(false);
const style = reactive({ data: { width: "0px", height: "0px" } });
const lastX = ref(0);
const lastY = ref(0);
const lastW = ref(0);
const lastH = ref(0);
const resizing = reactive({ data: { width: 0, height: 0 } });
const dragging = reactive({ data: { top: 0, left: 0 } });

const itemContainer = ref<HTMLElement | null>(null);
let interactObj: Interactable;
/**
 * 拖拽设置函数
 */
function tryMakeDraggable() {
  try {
    interactObj = interactObj ?? interact(itemContainer.value as HTMLElement);
  } catch {
    return;
  }
  if (draggable.value && !props.static) {
    const opts = {
      ignoreFrom: props.dragIgnoreFrom,
      allowFrom: props.dragAllowFrom,
    };
    interactObj.draggable(opts);
    /* this.interactObj.draggable({allowFrom: '.vue-draggable-handle'});*/
    if (!dragEventSet.value) {
      dragEventSet.value = true;
      interactObj.on("dragstart dragmove dragend", (event) => {
        handleDrag(event);
      });
    }
  } else {
    interactObj.draggable({
      enabled: false,
    });
  }
}
/**
 * 是否正在拖拽状态
 */
const isDragging = ref(false);
/**
 * 是否可拖拽
 */
const draggable = toRef(props, "isDraggable").value
  ? toRef(props, "isDraggable")
  : inject(isDraggableKey, ref(true));
nextTick(() => {
  watch(
    draggable,
    () => {
      tryMakeDraggable();
    },
    { immediate: true }
  );
});

/**
 * 缩放设置函数
 */
function tryMakeResizable() {
  try {
    interactObj = interactObj ?? interact(itemContainer.value as HTMLElement);
  } catch {
    return;
  }
  if (draggable.value && !props.static) {
    const maximum = calcPosition(0, 0, props.maxW, props.maxH);
    const minimum = calcPosition(0, 0, props.minW, props.minH);
    const opts = {
      preserveAspectRatio: true,
      edges: {
        left:
          renderRtl.value && "." + resizableHandleClass.value.trim().replace(" ", "."),
        right: renderRtl.value
          ? false
          : "." + resizableHandleClass.value.trim().replace(" ", "."),
        bottom: "." + resizableHandleClass.value.trim().replace(" ", "."),
        top: false,
      },
      ignoreFrom: props.resizeIgnoreFrom,
      restrictSize: {
        min: {
          height: minimum.height,
          width: minimum.width,
        },
        max: {
          height: maximum.height,
          width: maximum.width,
        },
      },
    };
    interactObj.resizable(opts);
    if (!resizeEventSet.value) {
      resizeEventSet.value = true;
      interactObj.on("resizestart resizemove resizeend", (event: MouseEvent) => {
        handleResize(event);
      });
    }
  } else {
    interactObj.resizable({
      enabled: false,
    });
  }
}

const isResizing = ref(false);

const resizable = toRef(props, "isResizable").value
  ? toRef(props, "isResizable")
  : inject(isResizableKey, ref(true));
nextTick(() => {
  watch(
    resizable,
    () => {
      tryMakeResizable();
    },
    { immediate: true }
  );
});

watch(
  () => props.static,
  () => {
    tryMakeDraggable();
    tryMakeResizable();
  }
);

const createStyle = () => {
  if (props.x! + props.w! > cols.value) {
    innerX.value = 0;
    innerW.value = props.w! > cols.value ? cols.value : props.w!;
  } else {
    innerX.value = props.x as number;
    innerW.value = props.w as number;
  }
  const pos = calcPosition(innerX.value, innerY.value!, innerW.value, innerH.value!);
  if (isDragging.value) {
    pos.top = dragging.data.top;

    if (renderRtl.value) {
      pos.right = dragging.data.left;
    } else {
      pos.left = dragging.data.left;
    }
  }
  if (isResizing.value) {
    pos.width = resizing.data.width;
    pos.height = resizing.data.height;
  }
  let _style = null;

  if (useCssTransforms) {
    if (renderRtl.value) {
      _style = setTransformRtl(pos.top, pos.right as number, pos.width, pos.height);
    } else {
      _style = setTransform(pos.top, pos.left as number, pos.width, pos.height);
    }
  } else {
    if (renderRtl.value) {
      _style = setTopRight(pos.top, pos.right as number, pos.width, pos.height);
    } else {
      _style = setTopLeft(pos.top, pos.left as number, pos.width, pos.height);
    }
  }
  style.data = _style;
};
onMounted(() => {
  createStyle();
  const compact = () => {
    createStyle();
  };
  const compactHandler = () => {
    compact();
  };
  eventBus.on("compact", compactHandler);
});

const resizableAndNotStatic = computed(() => {
  return resizable.value && !props.static;
});

const isMirrored = inject(isMirroredKey, ref(false));
const renderRtl = computed(() => {
  return isMirrored.value ? !rtl.value : rtl.value;
});
watch(
  () => renderRtl.value,
  () => {
    tryMakeResizable();
    createStyle();
  }
);
watch([containerWidth, cols], () => {
  tryMakeResizable();
  createStyle();
  emitContainerResized();
});

watch([() => props.minH, () => props.maxH, () => props.minW, () => props.maxW], () => {
  tryMakeResizable();
});
const isAndroid = computed(() => {
  return navigator.userAgent.toLowerCase().indexOf("android") !== -1;
});
const draggableOrResizableAndNotStatic = computed(() => {
  return (draggable.value || resizable.value) && !props.static;
});
const classObj = computed(() => {
  return {
    "vue-resizable": resizableAndNotStatic.value,
    static: props.static,
    resizing: isResizing.value,
    "vue-draggable-dragging": isDragging.value,
    cssTransforms: useCssTransforms.value,
    "render-rtl": renderRtl.value,
    "disable-userselect": isDragging.value,
    "no-touch": isAndroid.value && draggableOrResizableAndNotStatic.value,
  };
});
const resizableHandleClass = computed(() => {
  if (renderRtl.value) {
    return "vue-resizable-handle vue-rtl-resizable-handle";
  }
  return "vue-resizable-handle";
});

const calcColWidth = () => {
  return (containerWidth.value - (margin.value[0] || 10) * (cols.value + 1)) / cols.value;
};
const calcXY = (top: number, left: number) => {
  const colWidth = calcColWidth();
  let x = Math.round((left - margin.value[0]) / (colWidth + margin.value[0]));
  let y = Math.round((top - margin.value[1]) / (rowHeight.value + margin.value[1]));

  x = Math.max(Math.min(x, cols.value - innerW.value!), 0);
  y = Math.max(Math.min(y, maxRows.value - innerH.value!), 0);
  return { x, y };
};
const handleDrag = (event: any) => {
  if (props.static) return;
  if (isResizing.value) return;
  const position = getControlPosition(event);

  if (position === null) return;
  const { x, y } = position;
  const newPosition = { top: 0, left: 0 };
  switch (event.type) {
    case "dragstart": {
      previousX.value = innerX.value!;
      previousY.value = innerY.value!;
      const parentRect = event.target.offsetParent.getBoundingClientRect();
      const clientRect = event.target.getBoundingClientRect();
      if (renderRtl.value) {
        newPosition.left = (clientRect.right - parentRect.right) * -1;
      } else {
        newPosition.left = clientRect.left - parentRect.left;
      }
      newPosition.top = clientRect.top - parentRect.top;
      dragging.data = newPosition;
      isDragging.value = true;
      break;
    }
    case "dragend": {
      if (!isDragging.value) return;
      const parentRect = event.target.offsetParent.getBoundingClientRect();
      const clientRect = event.target.getBoundingClientRect();

      if (renderRtl.value) {
        newPosition.left = (clientRect.right - parentRect.right) * -1;
      } else {
        newPosition.left = clientRect.left - parentRect.left;
      }
      newPosition.top = clientRect.top - parentRect.top;
      dragging.data = { top: 0, left: 0 };
      isDragging.value = false;
      break;
    }
    case "dragmove": {
      const coreEvent = createCoreData(lastX.value, lastY.value, x, y);
      if (renderRtl.value) {
        newPosition.left = dragging.data.left - coreEvent.deltaX;
      } else {
        newPosition.left = dragging.data.left + coreEvent.deltaX;
      }
      newPosition.top = dragging.data.top + coreEvent.deltaY;
      dragging.data = newPosition;
      break;
    }
    default:
  }

  let pos = null;
  if (renderRtl.value) {
    pos = calcXY(newPosition.top, newPosition.left);
  } else {
    pos = calcXY(newPosition.top, newPosition.left);
  }
  lastX.value = x;
  lastY.value = y;
  if (innerX.value !== pos.x || innerY.value !== pos.y) {
    emit("move", props.i, pos.x, pos.y);
  }
  if (
    event.type === "dragend" &&
    (previousX.value !== innerX.value || previousY.value !== innerY.value)
  ) {
    emit("moved", props.i, pos.x, pos.y);
  }
  eventBus.emit("dragEvent", {
    eventType: event.type,
    i: props.i,
    x: pos.x,
    y: pos.y,
    h: innerH.value,
    w: innerW.value,
  });
};

function calcPosition(x: number, y: number, w: number, h: number, Rtl = renderRtl.value) {
  const colWidth = calcColWidth();
  let out;
  if (Rtl) {
    out = {
      right: Math.round(colWidth * x + (x + 1) * margin.value[0]),
      top: Math.round(rowHeight.value * y + (y + 1) * margin.value[1]),
      width:
        w === Infinity
          ? w
          : Math.round(colWidth * w + Math.max(0, w - 1) * margin.value[0]),
      height:
        h === Infinity
          ? h
          : Math.round(rowHeight.value * h + Math.max(0, h - 1) * margin.value[1]),
    };
  } else {
    out = {
      left: Math.round(colWidth * x + (x + 1) * margin.value[0]),
      top: Math.round(rowHeight.value * y + (y + 1) * margin.value[1]),
      width:
        w === Infinity
          ? w
          : Math.round(colWidth * w + Math.max(0, w - 1) * margin.value[0]),
      height:
        h === Infinity
          ? h
          : Math.round(rowHeight.value * h + Math.max(0, h - 1) * margin.value[1]),
    };
  }
  return out;
}
/**
 * Given a height and width in pixel values, calculate grid units.
 * @param  {Number} height Height in pixels.
 * @param  {Number} width  Width in pixels.
 * @param  {Boolean} autoSizeFlag  function autoSize identifier.
 * @return {Object} w, h as grid units.
 */
const calcWH = (height: number, width: number, autoSizeFlag = false) => {
  const colWidth = calcColWidth();
  let w = Math.round((width + margin.value[0]) / (colWidth + margin.value[0]));
  let h = 0;
  if (!autoSizeFlag) {
    h = Math.round((height + margin.value[1]) / (rowHeight.value + margin.value[1]));
  } else {
    h = Math.ceil((height + margin.value[1]) / (rowHeight.value + margin.value[1]));
  }

  w = Math.max(Math.min(w, cols.value - innerX.value!), 0);
  h = Math.max(Math.min(h, maxRows.value - innerY.value!), 0);
  return { w, h };
};
const handleResize = (event: MouseEvent) => {
  if (props.static) return;
  const position = getControlPosition(event);
  if (position === null) return;
  const { x, y } = position;
  const newSize = { width: 0, height: 0 };
  let pos = null;
  switch (event.type) {
    case "resizestart": {
      previousW.value = innerW.value!;
      previousH.value = innerH.value!;
      pos = calcPosition(innerX.value!, innerY.value!, innerW.value!, innerH.value!);
      newSize.width = pos.width;
      newSize.height = pos.height;
      resizing.data = newSize;
      isResizing.value = true;
      break;
    }
    case "resizemove": {
      const coreEvent = createCoreData(lastW.value, lastH.value, x, y);
      if (renderRtl.value) {
        newSize.width = resizing.data.width - coreEvent.deltaX;
      } else {
        newSize.width = resizing.data.width + coreEvent.deltaX;
      }
      newSize.height = resizing.data.height + coreEvent.deltaY;
      resizing.data = newSize;
      break;
    }
    case "resizeend": {
      pos = calcPosition(innerX.value!, innerY.value!, innerW.value!, innerH.value!);
      newSize.width = pos.width;
      newSize.height = pos.height;
      resizing.data = { width: 0, height: 0 };
      isResizing.value = false;
      break;
    }
    default:
  }
  pos = calcWH(newSize.height, newSize.width);
  if (pos.w < props.minW) {
    pos.w = props.minW;
  }
  if (pos.w > props.maxW) {
    pos.w = props.maxW;
  }
  if (pos.h < props.minH) {
    pos.h = props.minH;
  }
  if (pos.h > props.maxH) {
    pos.h = props.maxH;
  }
  if (pos.h < 1) {
    pos.h = 1;
  }
  if (pos.w < 1) {
    pos.w = 1;
  }
  lastW.value = x;
  lastH.value = y;
  if (innerW.value !== pos.w || innerH.value !== pos.h) {
    emit("resize", props.i, pos.h, pos.w, newSize.height, newSize.width);
  }
  if (
    event.type === "resizeend" &&
    (previousW.value !== innerW.value || previousH.value !== innerH.value)
  ) {
    emit("resized", props.i, pos.h, pos.w, newSize.height, newSize.width);
  }
  eventBus.emit("resizeEvent", {
    eventType: event.type,
    i: props.i,
    x: innerX.value,
    y: innerY.value,
    h: pos.h,
    w: pos.w,
  });
};

const emitContainerResized = () => {
  const styleProps: {
    height: string;
    width: string;
  } = { height: "0px", width: "0px" };
  const arr: ["width", "height"] = ["width", "height"];
  for (const prop of arr) {
    const val = style.data[prop];
    const matches = val.match(/^(\d+)px$/);
    if (!matches) return;
    styleProps[prop] = matches[1];
  }
  emit(
    "container-resized",
    props.i,
    props.h,
    props.w,
    styleProps.height,
    styleProps.width
  );
};
watch(rowHeight, () => {
  createStyle();
  emitContainerResized();
});

watch(
  () => props.x,
  (newVal) => {
    innerX.value = newVal;
    createStyle();
  }
);
watch(
  () => props.y,
  (newVal) => {
    innerY.value = newVal;
    createStyle();
  }
);
watch(
  () => props.h,
  (newVal) => {
    innerH.value = newVal;
    createStyle();
  }
);
watch(
  () => props.w,
  (newVal) => {
    innerW.value = newVal;
    createStyle();
  }
);
</script>

<style scoped>
.vue-grid-item {
  transition: all 200ms ease;
  transition-property: left top, right;
}

.vue-grid-item.no-touch {
  touch-action: none;
}

.vue-grid-item.cssTransforms {
  right: auto;
  left: 0;
  transition-property: transform;
}

.vue-grid-item.cssTransforms.render-rtl {
  right: 0;
  left: auto;
}

.vue-grid-item.resizing {
  z-index: 3;
  opacity: 0.6;
}

.vue-grid-item.vue-draggable-dragging {
  z-index: 3;
  transition: none;
}

.vue-grid-item.vue-grid-placeholder {
  z-index: 2;
  user-select: none;
  background: pink;
  transition-duration: 100ms;
}

.vue-grid-item > .vue-resizable-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  padding: 0 3px 3px 0;
  cursor: se-resize;
  background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=");
  background-repeat: no-repeat;
  background-position: bottom right;
  background-origin: content-box;
}

.vue-grid-item > .vue-rtl-resizable-handle {
  right: auto;
  bottom: 0;
  left: 0;
  padding-left: 3px;
  cursor: sw-resize;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAuMDAwMDAwMDAwMDAwMDAyIiBoZWlnaHQ9IjEwLjAwMDAwMDAwMDAwMDAwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB5PSItMSIgeD0iLTEiLz4KICA8ZyBkaXNwbGF5PSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9ImNhbnZhc0dyaWQiPgogICA8cmVjdCBmaWxsPSJ1cmwoI2dyaWRwYXR0ZXJuKSIgc3Ryb2tlLXdpZHRoPSIwIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxsaW5lIGNhbnZhcz0iI2ZmZmZmZiIgY2FudmFzLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzEiIHkyPSItNzAuMTc4NDA3IiB4Mj0iMTI0LjQ2NDE3NSIgeTE9Ii0zOC4zOTI3MzciIHgxPSIxNDQuODIxMjg5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+CiAgPGxpbmUgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z181IiB5Mj0iOS4xMDY5NTciIHgyPSIwLjk0NzI0NyIgeTE9Ii0wLjAxODEyOCIgeDE9IjAuOTQ3MjQ3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z183IiB5Mj0iOSIgeDI9IjEwLjA3MzUyOSIgeTE9IjkiIHgxPSItMC42NTU2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM2NjY2NjYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+");
  background-repeat: no-repeat;
  background-position: bottom left;
  background-origin: content-box;
}

.vue-grid-item.disable-userselect {
  user-select: none;
}
</style>
