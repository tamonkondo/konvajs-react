import { BringToFront, Copy, SendToBack, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { EditorElement } from "../types"
import { PanelSection } from "./PanelSection"

type LayerControlsProps = {
  elements: EditorElement[]
  selectedElement: EditorElement | null
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (direction: "front" | "back") => void
}

function elementLabel(element: EditorElement) {
  if (element.type === "text") return element.text
  return element.stampType
}

export function LayerControls({
  elements,
  selectedElement,
  selectedId,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
}: LayerControlsProps) {
  return (
    <PanelSection title="Layers">
      <div className="space-y-3">
        <div className="max-h-48 space-y-1 overflow-auto rounded-md border p-1">
          {elements.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">No text or stamps</p>
          ) : (
            [...elements].reverse().map((element) => (
              <button
                key={element.id}
                type="button"
                onClick={() => onSelect(element.id)}
                className={`flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm ${
                  selectedId === element.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <span className="min-w-0 truncate capitalize">{elementLabel(element)}</span>
                <span className="text-xs opacity-70">{element.type}</span>
              </button>
            ))
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" size="sm" disabled={!selectedElement} onClick={() => onMove("front")}>
            <BringToFront />
            Front
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={!selectedElement} onClick={() => onMove("back")}>
            <SendToBack />
            Back
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={!selectedElement} onClick={onDuplicate}>
            <Copy />
            Copy
          </Button>
          <Button type="button" variant="destructive" size="sm" disabled={!selectedElement} onClick={onDelete}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>
    </PanelSection>
  )
}
