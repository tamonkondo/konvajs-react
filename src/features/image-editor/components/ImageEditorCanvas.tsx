import { useEffect, useMemo, useRef, useState } from "react"
import Konva from "konva"
import { Arrow, Circle, Group, Image, Layer, Rect, Stage, Star, Text, Transformer } from "react-konva"
import type { KonvaEventObject } from "konva/lib/Node"

import type { EditorElement, FilterState, ImageAsset, StageSize, StampElement } from "../types"
import { getContainedImageRect } from "../utils"
import { useHtmlImage } from "../hooks/use-html-image"

type ImageEditorCanvasProps = {
  stageRef: React.RefObject<Konva.Stage | null>
  imageAsset: ImageAsset | null
  filters: FilterState
  elements: EditorElement[]
  selectedId: string | null
  stageSize: StageSize
  onSelect: (id: string | null) => void
  onElementChange: (id: string, updates: Partial<EditorElement>) => void
  onImageDrop: (file: File) => void
}

type EditableNodeProps = {
  element: EditorElement
  selected: boolean
  overlayRootRef: React.RefObject<HTMLDivElement | null>
  onSelect: (id: string) => void
  onElementChange: (id: string, updates: Partial<EditorElement>) => void
}

function StampShape({ element }: { element: StampElement }) {
  if (element.stampType === "star") {
    return <Star x={36} y={36} numPoints={5} innerRadius={18} outerRadius={36} fill={element.fill} />
  }

  if (element.stampType === "heart") {
    return <Text text="♥" x={0} y={-5} width={72} height={72} align="center" fontSize={64} fill={element.fill} />
  }

  if (element.stampType === "circle") {
    return <Circle x={36} y={36} radius={34} fill={element.fill} />
  }

  if (element.stampType === "arrow") {
    return <Arrow points={[0, 36, 84, 36]} pointerLength={18} pointerWidth={18} stroke={element.fill} fill={element.fill} strokeWidth={10} />
  }

  return (
    <>
      <Rect x={0} y={8} width={116} height={52} cornerRadius={8} fill={element.fill} />
      <Text text="LABEL" x={0} y={23} width={116} align="center" fontSize={18} fontStyle="bold" fill="#ffffff" />
    </>
  )
}

function EditableNode({ element, selected, overlayRootRef, onSelect, onElementChange }: EditableNodeProps) {
  const nodeRef = useRef<Konva.Node | null>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (!selected || !nodeRef.current || !transformerRef.current) return
    transformerRef.current.nodes([nodeRef.current])
    transformerRef.current.getLayer()?.batchDraw()
  }, [selected])

  function handleTransformEnd() {
    const node = nodeRef.current
    if (!node) return
    onElementChange(element.id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    })
  }

  function handleTextEdit() {
    if (element.type !== "text") return

    const textNode = nodeRef.current
    const transformerNode = transformerRef.current
    const overlayRoot = overlayRootRef.current
    if (!textNode || !(textNode instanceof Konva.Text) || !overlayRoot) return

    onSelect(element.id)
    textNode.hide()
    transformerNode?.hide()

    const textPosition = textNode.absolutePosition()
    const textarea = document.createElement("textarea")
    overlayRoot.appendChild(textarea)

    textarea.value = textNode.text()
    textarea.style.position = "absolute"
    textarea.style.top = `${textPosition.y}px`
    textarea.style.left = `${textPosition.x}px`
    textarea.style.width = `${Math.max(textNode.width() * textNode.scaleX(), 40)}px`
    textarea.style.height = `${Math.max(textNode.height() * textNode.scaleY(), 24)}px`
    textarea.style.fontSize = `${textNode.fontSize() * textNode.scaleY()}px`
    textarea.style.fontFamily = textNode.fontFamily()
    textarea.style.fontWeight = textNode.fontStyle().includes("bold") ? "700" : "400"
    textarea.style.lineHeight = String(textNode.lineHeight())
    textarea.style.color = String(textNode.fill())
    textarea.style.textAlign = textNode.align()
    textarea.style.border = "1px solid hsl(0 0% 75%)"
    textarea.style.borderRadius = "4px"
    textarea.style.padding = "2px"
    textarea.style.margin = "0"
    textarea.style.overflow = "hidden"
    textarea.style.background = "white"
    textarea.style.outline = "none"
    textarea.style.pointerEvents = "auto"
    textarea.style.resize = "none"
    textarea.style.transformOrigin = "left top"
    textarea.style.transform = textNode.rotation() ? `rotateZ(${textNode.rotation()}deg)` : ""
    textarea.style.zIndex = "50"

    const resizeTextarea = () => {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight + 4}px`
    }

    const closeTextarea = (save: boolean) => {
      if (save) {
        onElementChange(element.id, { text: textarea.value })
      }
      textarea.remove()
      window.removeEventListener("click", handleOutsideClick)
      textarea.removeEventListener("keydown", handleKeyDown)
      textarea.removeEventListener("input", resizeTextarea)
      textarea.removeEventListener("click", handleTextareaClick)
      textNode.show()
      transformerNode?.show()
      transformerNode?.forceUpdate()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        closeTextarea(true)
      }
      if (event.key === "Escape") {
        closeTextarea(false)
      }
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target !== textarea) {
        closeTextarea(true)
      }
    }

    const handleTextareaClick = (event: MouseEvent) => {
      event.stopPropagation()
    }

    textarea.addEventListener("keydown", handleKeyDown)
    textarea.addEventListener("input", resizeTextarea)
    textarea.addEventListener("click", handleTextareaClick)
    resizeTextarea()
    textarea.focus()
    textarea.select()

    window.setTimeout(() => {
      window.addEventListener("click", handleOutsideClick)
    })
  }

  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    scaleX: element.scaleX,
    scaleY: element.scaleY,
    draggable: true,
    onClick: () => onSelect(element.id),
    onTap: () => onSelect(element.id),
    onDragEnd: (event: KonvaEventObject<DragEvent>) => {
      onElementChange(element.id, {
        x: event.target.x(),
        y: event.target.y(),
      })
    },
    onTransformEnd: handleTransformEnd,
  }

  return (
    <>
      {element.type === "text" ? (
        <Text
          {...commonProps}
          ref={(node) => {
            nodeRef.current = node
          }}
          onDblClick={handleTextEdit}
          onDblTap={handleTextEdit}
          text={element.text}
          fontSize={element.fontSize}
          fill={element.fill}
          fontStyle="bold"
          padding={4}
        />
      ) : (
        <Group
          {...commonProps}
          ref={(node) => {
            nodeRef.current = node
          }}
        >
          <StampShape element={element} />
        </Group>
      )}
      {selected ? (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 12 || newBox.height < 12) return oldBox
            return newBox
          }}
        />
      ) : null}
    </>
  )
}

export function ImageEditorCanvas({
  stageRef,
  imageAsset,
  filters,
  elements,
  selectedId,
  stageSize,
  onSelect,
  onElementChange,
  onImageDrop,
}: ImageEditorCanvasProps) {
  const image = useHtmlImage(imageAsset?.dataUrl)
  const imageRef = useRef<Konva.Image>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const overlayRootRef = useRef<HTMLDivElement>(null)
  const [displayScale, setDisplayScale] = useState(1)
  const [isDraggingImage, setIsDraggingImage] = useState(false)

  const imageRect = useMemo(() => {
    if (!imageAsset) return null
    return getContainedImageRect(imageAsset, stageSize)
  }, [imageAsset, stageSize])

  const activeFilters = useMemo(() => {
    const nextFilters = []
    if (filters.brightness !== 0) nextFilters.push(Konva.Filters.Brighten)
    if (filters.contrast !== 0) nextFilters.push(Konva.Filters.Contrast)
    if (filters.grayscale) nextFilters.push(Konva.Filters.Grayscale)
    if (filters.blur > 0) nextFilters.push(Konva.Filters.Blur)
    return nextFilters
  }, [filters])

  useEffect(() => {
    const node = imageRef.current
    if (!node || !image) return
    if (activeFilters.length > 0) {
      node.cache()
    } else {
      node.clearCache()
    }
    node.getLayer()?.batchDraw()
  }, [activeFilters, filters, image])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? stageSize.width
      const height = entry?.contentRect.height ?? stageSize.height
      const nextScale = Math.min((width - 32) / stageSize.width, (height - 32) / stageSize.height, 1)
      setDisplayScale(Math.max(nextScale, 0.35))
    })

    observer.observe(viewport)
    return () => observer.disconnect()
  }, [stageSize.height, stageSize.width])

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDraggingImage(false)

    const file = Array.from(event.dataTransfer.files).find((droppedFile) => droppedFile.type.startsWith("image/"))
    if (file) onImageDrop(file)
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (Array.from(event.dataTransfer.items).some((item) => item.type.startsWith("image/"))) {
      setIsDraggingImage(true)
    }
  }

  return (
    <div
      ref={viewportRef}
      className={`relative flex h-full min-h-[420px] items-center justify-center overflow-auto rounded-lg border bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] p-4 ${
        isDraggingImage ? "ring-3 ring-primary/40" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDraggingImage(false)}
    >
      {isDraggingImage ? (
        <div className="pointer-events-none absolute inset-4 z-10 grid place-items-center rounded-lg border-2 border-dashed border-primary bg-background/80 text-sm font-medium text-foreground">
          Drop image to replace canvas image
        </div>
      ) : null}
      <div
        style={{
          width: stageSize.width * displayScale,
          height: stageSize.height * displayScale,
        }}
      >
        <div
          style={{
            position: "relative",
            width: stageSize.width,
            height: stageSize.height,
            transform: `scale(${displayScale})`,
            transformOrigin: "top left",
          }}
        >
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            className="overflow-hidden rounded-md bg-white shadow-sm"
            onMouseDown={(event) => {
              if (event.target === event.target.getStage()) onSelect(null)
            }}
            onTouchStart={(event) => {
              if (event.target === event.target.getStage()) onSelect(null)
            }}
          >
            <Layer>
              <Rect width={stageSize.width} height={stageSize.height} fill="#ffffff" />
              {image && imageRect ? (
                <Image
                  ref={imageRef}
                  image={image}
                  x={imageRect.x}
                  y={imageRect.y}
                  width={imageRect.width}
                  height={imageRect.height}
                  filters={activeFilters}
                  brightness={filters.brightness}
                  contrast={filters.contrast}
                  blurRadius={filters.blur}
                />
              ) : (
                <Text
                  text="画像をアップロード"
                  x={0}
                  y={stageSize.height / 2 - 12}
                  width={stageSize.width}
                  align="center"
                  fill="#6b7280"
                  fontSize={22}
                  fontStyle="bold"
                />
              )}
              {elements.map((element) => (
                <EditableNode
                  key={element.id}
                  element={element}
                  selected={element.id === selectedId}
                  overlayRootRef={overlayRootRef}
                  onSelect={onSelect}
                  onElementChange={onElementChange}
                />
              ))}
            </Layer>
          </Stage>
          <div
            ref={overlayRootRef}
            className="pointer-events-none absolute inset-0"
          />
        </div>
      </div>
    </div>
  )
}
