import { PropType } from 'vue'
import { Layout } from './types'

export const layoutProps = {
  /**
   * Layout 容器是否自动调整大小，以容纳所有 Item
   */
  autoSize: {
    type: Boolean,
    default: true
  },
  /**
   * 定义栅格系统的列数
   */
  colNum: {
    type: Number,
    default: 12
  },
  /**
   * 栅格每行的高度，单位像素
   */
  rowHeight: {
    type: Number,
    default: 10
  },
  /**
   * 最大行数
   */
  maxRows: {
    type: Number,
    default: Infinity
  },
  /**
   * 定义栅格中的元素边距。值必须是包含两个 Number的数组，数组中第一个元素表示水平边距，第二个表示垂直边距，单位为像素。
   */
  margin: {
    type: Array as PropType<number[]>,
    default: () => {
      return [10, 10]
    }
  },
  /**
   * 栅格中的元素是否可拖拽
   */
  isDraggable: {
    type: Boolean,
    default: true
  },
  /**
   * 栅格中的元素是否可调整大小。
   */
  isResizable: {
    type: Boolean,
    default: true
  },
  /**
   * 栅格中的元素是否可镜像反转。
   */
  isMirrored: {
    type: Boolean,
    default: false
  },
  /**
   * 是否使用CSS属性 transition-property: transform;
   */
  useCssTransforms: {
    type: Boolean,
    default: true
  },
  /**
   * 布局是否垂直压缩。
   */
  verticalCompact: {
    type: Boolean,
    default: true
  },
  /**
   * 栅格的初始布局。值必须为 Array，其数据项为 Object。 每条数据项必须有 i, x, y, w 和 h 属性。
   */
  layout: {
    type: Array as PropType<Layout>,
    required: true
  },
  /**
   * 布局是否为响应式。
   */
  responsive: {
    type: Boolean,
    default: false
  },
  /**
   * 如果 responsive 设置为 true，该配置将作为栅格中每个断点的初始布局。
   * 键值是断点名称，每项的值都是类似 layout 属性定义的数据结构，值必须为 Array，其数据项为 Object。
   * 例如： {lg: [layout items], md: [layout items]}。需要注意的是，在创建栅格布局后设置该属性无效。
   * 在创建GridLayout之后设置prop无效。
   */
  responsiveLayouts: {
    type: Object,
    default: () => {
      return {}
    }
  },
  /**
   * 为响应式布局设置断点。
   */
  breakpoints: {
    type: Object,
    default: () => {
      return { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
    }
  },
  /**
   * 设置每个断点对应的列数。
   */
  responsiveCols: {
    type: Object,
    default: () => {
      return { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
    }
  },
  /**
   * 防止碰撞属性，值设置为 true 时，栅格只能拖动至空白处。
   */
  preventCollision: {
    type: Boolean,
    default: false
  }
}

export const gridItemProps = {
  isDraggable: {
    type: Boolean,
    default: null
  },
  isResizable: {
    type: Boolean,
    default: null
  },
  static: {
    type: Boolean,
    default: false
  },
  minH: {
    type: Number,
    default: 1
  },
  minW: {
    type: Number,
    default: 1
  },
  maxH: {
    type: Number,
    default: Infinity
  },
  maxW: {
    type: Number,
    default: Infinity
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  w: {
    type: Number,
    required: true
  },
  h: {
    type: Number,
    required: true
  },
  i: {
    type: [Number, String],
    required: true
  },
  dragIgnoreFrom: {
    type: String,
    default: 'a, button'
  },
  dragAllowFrom: {
    type: String,
    default: null
  },
  resizeIgnoreFrom: {
    type: String,
    default: 'a, button'
  }
}
