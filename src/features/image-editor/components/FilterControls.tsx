import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

import type { FilterState } from "../types"
import { PanelSection } from "./PanelSection"

type FilterControlsProps = {
  filters: FilterState
  disabled: boolean
  onChange: (filters: Partial<FilterState>) => void
  onReset: () => void
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  disabled: boolean
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <span className="tabular-nums text-xs text-muted-foreground">{value}</span>
      </div>
      <Slider min={min} max={max} step={step} value={value} disabled={disabled} onValueChange={onChange} />
    </div>
  )
}

export function FilterControls({ filters, disabled, onChange, onReset }: FilterControlsProps) {
  return (
    <PanelSection title="Filters">
      <div className="space-y-3">
        <SliderRow
          label="Brightness"
          min={-1}
          max={1}
          step={0.05}
          value={filters.brightness}
          disabled={disabled}
          onChange={(brightness) => onChange({ brightness })}
        />
        <SliderRow
          label="Contrast"
          min={-100}
          max={100}
          step={5}
          value={filters.contrast}
          disabled={disabled}
          onChange={(contrast) => onChange({ contrast })}
        />
        <SliderRow
          label="Blur"
          min={0}
          max={20}
          step={1}
          value={filters.blur}
          disabled={disabled}
          onChange={(blur) => onChange({ blur })}
        />
        <label className="flex items-center justify-between rounded-md border px-2.5 py-2 text-sm">
          <span>Grayscale</span>
          <input
            type="checkbox"
            checked={filters.grayscale}
            disabled={disabled}
            onChange={(event) => onChange({ grayscale: event.target.checked })}
            className="size-4 accent-primary"
          />
        </label>
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={onReset}>
          <SlidersHorizontal />
          Reset filters
        </Button>
      </div>
    </PanelSection>
  )
}
