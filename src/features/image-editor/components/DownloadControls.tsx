import type Konva from "konva"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

import { PanelSection } from "./PanelSection"

type DownloadControlsProps = {
  stageRef: React.RefObject<Konva.Stage | null>
  disabled: boolean
  pixelRatio: number
}

export function DownloadControls({ stageRef, disabled, pixelRatio }: DownloadControlsProps) {
  function downloadImage() {
    const stage = stageRef.current
    if (!stage) return

    const uri = stage.toDataURL({ pixelRatio, mimeType: "image/png" })
    const link = document.createElement("a")
    link.download = "edited-image.png"
    link.href = uri
    link.click()
  }

  return (
    <PanelSection title="Export">
      <Button type="button" className="w-full" disabled={disabled} onClick={downloadImage}>
        <Download />
        Download PNG
      </Button>
    </PanelSection>
  )
}
