import { useRef } from "react"
import type Konva from "konva"

import { Separator } from "@/components/ui/separator"

import { DownloadControls } from "../../features/image-editor/components/DownloadControls"
import { FilterControls } from "../../features/image-editor/components/FilterControls"
import { ImageEditorCanvas } from "../../features/image-editor/components/ImageEditorCanvas"
import { LayerControls } from "../../features/image-editor/components/LayerControls"
import { SelectedElementControls } from "../../features/image-editor/components/SelectedElementControls"
import { StampControls } from "../../features/image-editor/components/StampControls"
import { TextControls } from "../../features/image-editor/components/TextControls"
import { UploadControls } from "../../features/image-editor/components/UploadControls"
import { useImageEditor } from "../../features/image-editor/hooks/use-image-editor"

export function EditorPage() {
  const stageRef = useRef<Konva.Stage>(null)
  const editor = useImageEditor()
  const hasImage = Boolean(editor.imageAsset)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-4 py-4">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b pb-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Konva Image Editor</h1>
            <p className="text-sm text-muted-foreground">Upload an image, compose text and stamps, then export a PNG.</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>Canvas {Math.round(editor.stageSize.width)} x {Math.round(editor.stageSize.height)}</div>
            {editor.imageAsset ? <div>Export {editor.imageAsset.width} x {editor.imageAsset.height}</div> : null}
            <div>{editor.elements.length} editable layers</div>
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
          <aside className="space-y-5 rounded-lg border bg-card p-4 text-card-foreground">
            <UploadControls
              imageName={editor.imageAsset?.name}
              error={editor.error}
              onUpload={editor.uploadImage}
              onClear={editor.clearCanvas}
            />
            <Separator />
            <FilterControls
              filters={editor.filters}
              disabled={!hasImage}
              onChange={editor.updateFilters}
              onReset={editor.resetFilters}
            />
            <Separator />
            <TextControls
              textDraft={editor.textDraft}
              textFill={editor.textFill}
              textSize={editor.textSize}
              textAlign={editor.textAlign}
              disabled={!hasImage}
              onTextChange={editor.setTextDraft}
              onFillChange={editor.setTextFill}
              onSizeChange={editor.setTextSize}
              onAlignChange={editor.setTextAlign}
              onAddText={editor.addTextElement}
            />
            <Separator />
            <StampControls
              stampFill={editor.stampFill}
              disabled={!hasImage}
              onFillChange={editor.setStampFill}
              onAddStamp={editor.addStampElement}
            />
          </aside>

          <section className="min-w-0">
            <ImageEditorCanvas
              stageRef={stageRef}
              imageAsset={editor.imageAsset}
              filters={editor.filters}
              elements={editor.elements}
              selectedId={editor.selectedId}
              stageSize={editor.stageSize}
              onSelect={editor.setSelectedId}
              onElementChange={editor.updateElement}
              onImageDrop={editor.uploadImage}
            />
          </section>

          <aside className="space-y-5 rounded-lg border bg-card p-4 text-card-foreground">
            <SelectedElementControls selectedElement={editor.selectedElement} onChange={editor.updateElement} />
            <Separator />
            <LayerControls
              elements={editor.elements}
              selectedElement={editor.selectedElement}
              selectedId={editor.selectedId}
              onSelect={editor.setSelectedId}
              onDelete={editor.deleteSelectedElement}
              onDuplicate={editor.duplicateSelectedElement}
              onMove={editor.moveSelectedElement}
            />
            <Separator />
            <DownloadControls stageRef={stageRef} disabled={!hasImage} pixelRatio={editor.exportPixelRatio} />
          </aside>
        </div>
      </div>
    </main>
  )
}
