import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

import type { EditorElement, TextAlign } from "../types"
import { PanelSection } from "./PanelSection"

type SelectedElementControlsProps = {
  selectedElement: EditorElement | null
  onChange: (id: string, updates: Partial<EditorElement>) => void
}

const ALIGN_OPTIONS = [
  { value: "left", label: "Left", icon: AlignLeft },
  { value: "center", label: "Center", icon: AlignCenter },
  { value: "right", label: "Right", icon: AlignRight },
] satisfies Array<{ value: TextAlign; label: string; icon: typeof AlignLeft }>

export function SelectedElementControls({ selectedElement, onChange }: SelectedElementControlsProps) {
  return (
    <PanelSection title="Selection">
      {!selectedElement ? (
        <p className="rounded-md border bg-muted/40 px-2.5 py-3 text-xs text-muted-foreground">
          Select text or a stamp on the canvas.
        </p>
      ) : (
        <div className="space-y-3">
          {selectedElement.type === "text" ? (
            <>
              <div className="space-y-1.5">
                <Label>Text</Label>
                <Textarea
                  value={selectedElement.text}
                  rows={3}
                  onChange={(event) => onChange(selectedElement.id, { text: event.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ALIGN_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedElement.align === option.value ? "default" : "outline"}
                      size="sm"
                      aria-label={option.label}
                      onClick={() => onChange(selectedElement.id, { align: option.value })}
                    >
                      <Icon />
                    </Button>
                  )
                })}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Font size</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">{selectedElement.fontSize}px</span>
                </div>
                <Slider
                  min={12}
                  max={120}
                  step={1}
                  value={selectedElement.fontSize}
                  onValueChange={(fontSize) => onChange(selectedElement.id, { fontSize })}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Line width</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">{Math.round(selectedElement.width)}px</span>
                </div>
                <Slider
                  min={40}
                  max={920}
                  step={1}
                  value={selectedElement.width}
                  onValueChange={(width) => onChange(selectedElement.id, { width })}
                />
              </div>
            </>
          ) : null}
          <div className="space-y-1.5">
            <Label>Color</Label>
            <Input
              type="color"
              value={selectedElement.fill}
              onChange={(event) => onChange(selectedElement.id, { fill: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Rotation</Label>
              <span className="text-xs tabular-nums text-muted-foreground">{Math.round(selectedElement.rotation)}°</span>
            </div>
            <Slider
              min={-180}
              max={180}
              step={1}
              value={selectedElement.rotation}
              onValueChange={(rotation) => onChange(selectedElement.id, { rotation })}
            />
          </div>
        </div>
      )}
    </PanelSection>
  )
}
