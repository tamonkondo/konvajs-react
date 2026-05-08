import { ArrowRight, Circle, Heart, Star, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { StampType } from "../types"
import { PanelSection } from "./PanelSection"

const STAMPS: Array<{ type: StampType; label: string; icon: typeof Star }> = [
  { type: "star", label: "Star", icon: Star },
  { type: "heart", label: "Heart", icon: Heart },
  { type: "circle", label: "Circle", icon: Circle },
  { type: "arrow", label: "Arrow", icon: ArrowRight },
  { type: "label", label: "Label", icon: Tag },
]

type StampControlsProps = {
  stampFill: string
  disabled: boolean
  onFillChange: (value: string) => void
  onAddStamp: (stampType: StampType) => void
}

export function StampControls({ stampFill, disabled, onFillChange, onAddStamp }: StampControlsProps) {
  return (
    <PanelSection title="Stamps">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input type="color" value={stampFill} disabled={disabled} onChange={(event) => onFillChange(event.target.value)} />
          <span className="text-xs text-muted-foreground">Stamp color</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {STAMPS.map((stamp) => {
            const Icon = stamp.icon
            return (
              <Button
                key={stamp.type}
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => onAddStamp(stamp.type)}
              >
                <Icon />
                {stamp.label}
              </Button>
            )
          })}
        </div>
      </div>
    </PanelSection>
  )
}
