import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

import type { EditorElement } from "../types"
import { PanelSection } from "./PanelSection"

type SelectedElementControlsProps = {
  selectedElement: EditorElement | null
  onChange: (id: string, updates: Partial<EditorElement>) => void
}

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
                <Input
                  value={selectedElement.text}
                  onChange={(event) => onChange(selectedElement.id, { text: event.target.value })}
                />
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
