import { AlignCenter, AlignLeft, AlignRight, Type } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

import type { TextAlign } from "../types"
import { PanelSection } from "./PanelSection"

type TextControlsProps = {
  textDraft: string
  textFill: string
  textSize: number
  textAlign: TextAlign
  disabled: boolean
  onTextChange: (value: string) => void
  onFillChange: (value: string) => void
  onSizeChange: (value: number) => void
  onAlignChange: (value: TextAlign) => void
  onAddText: () => void
}

const ALIGN_OPTIONS = [
  { value: "left", label: "Left", icon: AlignLeft },
  { value: "center", label: "Center", icon: AlignCenter },
  { value: "right", label: "Right", icon: AlignRight },
] satisfies Array<{ value: TextAlign; label: string; icon: typeof AlignLeft }>

export function TextControls({
  textDraft,
  textFill,
  textSize,
  textAlign,
  disabled,
  onTextChange,
  onFillChange,
  onSizeChange,
  onAlignChange,
  onAddText,
}: TextControlsProps) {
  return (
    <PanelSection title="Text">
      <div className="space-y-3">
        <Textarea
          value={textDraft}
          disabled={disabled}
          rows={3}
          onChange={(event) => onTextChange(event.target.value)}
        />
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
        <div className="grid grid-cols-3 gap-2">
          {ALIGN_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.value}
                type="button"
                variant={textAlign === option.value ? "default" : "outline"}
                size="sm"
                disabled={disabled}
                aria-label={option.label}
                onClick={() => onAlignChange(option.value)}
              >
                <Icon />
              </Button>
            )
          })}
        </div>
        <Button type="button" className="w-full" disabled={disabled} onClick={onAddText}>
          <Type />
          Add text
        </Button>
      </div>
    </PanelSection>
  )
}
