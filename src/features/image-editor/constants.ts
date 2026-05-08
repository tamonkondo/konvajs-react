import type { FilterState, StageSize } from "./types"

export const DEFAULT_STAGE_SIZE: StageSize = {
  width: 920,
  height: 620,
}

export const MAX_EDIT_CANVAS_WIDTH = 920

export const DEFAULT_FILTERS: FilterState = {
  brightness: 0,
  contrast: 0,
  grayscale: false,
  blur: 0,
}
