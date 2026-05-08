import { ImageUp, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { PanelSection } from "./PanelSection"

type UploadControlsProps = {
  imageName?: string
  error: string | null
  onUpload: (file: File) => void
  onClear: () => void
}

export function UploadControls({ imageName, error, onUpload, onClear }: UploadControlsProps) {
  return (
    <PanelSection title="Image">
      <div className="space-y-2">
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onUpload(file)
          }}
        />
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">{imageName ?? "No image selected"}</span>
          <Button type="button" variant="outline" size="sm" onClick={onClear}>
            <RotateCcw />
            Reset
          </Button>
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-2 text-xs text-muted-foreground">
          <ImageUp className="size-4" />
          <span>PNG, JPEG, WebP</span>
        </div>
      </div>
    </PanelSection>
  )
}
