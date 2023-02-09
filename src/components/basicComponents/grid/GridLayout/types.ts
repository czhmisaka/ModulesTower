export type LayoutItem = {
  i: string | number
  x: number
  y: number
  h: number
  w: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
  moved?: boolean
  isDraggable?: boolean
  isResizable?: boolean
}
export type Layout = Array<LayoutItem>
