import { useEffect, useMemo, useRef } from "react"
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
}

type EditableNodeProps = {
  element: EditorElement
  selected: boolean
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

function EditableNode({ element, selected, onSelect, onElementChange }: EditableNodeProps) {
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
}: ImageEditorCanvasProps) {
  const image = useHtmlImage(imageAsset?.dataUrl)
  const imageRef = useRef<Konva.Image>(null)

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

  return (
    <div className="flex h-full min-h-[420px] items-center justify-center overflow-auto rounded-lg border bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] p-4">
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
              onSelect={onSelect}
              onElementChange={onElementChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
