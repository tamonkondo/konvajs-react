import type { FilterState, StageSize } from "./types"

export const STAGE_SIZE: StageSize = {
  width: 920,
  height: 620,
}

export const DEFAULT_FILTERS: FilterState = {
  brightness: 0,
  contrast: 0,
  grayscale: false,
  blur: 0,
}
