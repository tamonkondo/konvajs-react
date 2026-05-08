export type StampType = "star" | "heart" | "circle" | "arrow" | "label"
export type TextAlign = "left" | "center" | "right"

export type FilterState = {
  brightness: number
  contrast: number
  grayscale: boolean
  blur: number
}

export type BaseElement = {
  id: string
  x: number
  y: number
  rotation: number
  scaleX: number
  scaleY: number
}

export type TextElement = BaseElement & {
  type: "text"
  text: string
  fontSize: number
  fill: string
  width: number
  align: TextAlign
}

export type StampElement = BaseElement & {
  type: "stamp"
  stampType: StampType
  fill: string
}

export type EditorElement = TextElement | StampElement

export type ImageAsset = {
  dataUrl: string
  width: number
  height: number
  name: string
}

export type StageSize = {
  width: number
  height: number
}
