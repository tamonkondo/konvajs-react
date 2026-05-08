import { Type } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

import { PanelSection } from "./PanelSection"

type TextControlsProps = {
  textDraft: string
  textFill: string
  textSize: number
  disabled: boolean
  onTextChange: (value: string) => void
  onFillChange: (value: string) => void
  onSizeChange: (value: number) => void
  onAddText: () => void
}

export function TextControls({
  textDraft,
  textFill,
  textSize,
  disabled,
  onTextChange,
  onFillChange,
  onSizeChange,
  onAddText,
}: TextControlsProps) {
  return (
    <PanelSection title="Text">
      <div className="space-y-3">
        <Input value={textDraft} disabled={disabled} onChange={(event) => onTextChange(event.target.value)} />
        <div className="grid grid-cols-[1fr_52px] items-end gap-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Size</Label>
              <span className="tabular-nums text-xs text-muted-foreground">{textSize}px</span>
            </div>
            <Slider min={16} max={96} step={1} value={textSize} disabled={disabled} onValueChange={onSizeChange} />
          </div>
          <Input type="color" value={textFill} disabled={disabled} onChange={(event) => onFillChange(event.target.value)} />
        </div>
        <Button type="button" className="w-full" disabled={disabled} onClick={onAddText}>
          <Type />
          Add text
        </Button>
      </div>
    </PanelSection>
  )
}
