import { useMemo, useState } from "react"

import { DEFAULT_FILTERS } from "../constants"
import type { EditorElement, FilterState, ImageAsset, StampElement, StampType, TextAlign, TextElement } from "../types"
import { createElementId, getExportPixelRatio, getImageStageSize, readImageFile } from "../utils"

type UpdateElementPayload = Partial<Omit<TextElement, "id" | "type"> & Omit<StampElement, "id" | "type">>

const DEFAULT_TEXT = {
  text: "New text",
  fontSize: 42,
  fill: "#111827",
  width: 280,
  align: "left" as TextAlign,
}

export function useImageEditor() {
  const [imageAsset, setImageAsset] = useState<ImageAsset | null>(null)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [elements, setElements] = useState<EditorElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [textDraft, setTextDraft] = useState(DEFAULT_TEXT.text)
  const [textFill, setTextFill] = useState(DEFAULT_TEXT.fill)
  const [textSize, setTextSize] = useState(DEFAULT_TEXT.fontSize)
  const [textAlign, setTextAlign] = useState<TextAlign>(DEFAULT_TEXT.align)
  const [stampFill, setStampFill] = useState("#ef4444")
  const [error, setError] = useState<string | null>(null)

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedId) ?? null,
    [elements, selectedId]
  )
  const stageSize = useMemo(() => getImageStageSize(imageAsset), [imageAsset])
  const exportPixelRatio = useMemo(() => getExportPixelRatio(imageAsset, stageSize), [imageAsset, stageSize])

  async function uploadImage(file: File) {
    setError(null)
    try {
      const loadedImage = await readImageFile(file)
      setImageAsset(loadedImage)
      setSelectedId(null)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "画像を読み込めませんでした。")
    }
  }

  function updateFilters(nextFilters: Partial<FilterState>) {
    setFilters((current) => ({ ...current, ...nextFilters }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  function addTextElement() {
    const id = createElementId("text")
    const width = Math.max(Math.min(DEFAULT_TEXT.width, stageSize.width - 48), 80)
    setElements((current) => [
      ...current,
      {
        id,
        type: "text",
        text: textDraft.trim() || DEFAULT_TEXT.text,
        x: stageSize.width / 2 - width / 2,
        y: stageSize.height / 2 - textSize / 2,
        fontSize: textSize,
        fill: textFill,
        width,
        align: textAlign,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
    ])
    setSelectedId(id)
  }

  function addStampElement(stampType: StampType) {
    const id = createElementId("stamp")
    setElements((current) => [
      ...current,
      {
        id,
        type: "stamp",
        stampType,
        fill: stampFill,
        x: stageSize.width / 2 - 36,
        y: stageSize.height / 2 - 36,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
    ])
    setSelectedId(id)
  }

  function updateElement(id: string, updates: UpdateElementPayload) {
    setElements((current) =>
      current.map((element) => (element.id === id ? ({ ...element, ...updates } as EditorElement) : element))
    )
  }

  function deleteSelectedElement() {
    if (!selectedId) return
    setElements((current) => current.filter((element) => element.id !== selectedId))
    setSelectedId(null)
  }

  function duplicateSelectedElement() {
    if (!selectedElement) return
    const id = createElementId(selectedElement.type)
    setElements((current) => [
      ...current,
      {
        ...selectedElement,
        id,
        x: selectedElement.x + 24,
        y: selectedElement.y + 24,
      },
    ])
    setSelectedId(id)
  }

  function moveSelectedElement(direction: "front" | "back") {
    if (!selectedId) return

    setElements((current) => {
      const index = current.findIndex((element) => element.id === selectedId)
      if (index < 0) return current
      const nextElements = [...current]
      const [element] = nextElements.splice(index, 1)
      if (!element) return current
      if (direction === "front") {
        nextElements.push(element)
      } else {
        nextElements.unshift(element)
      }
      return nextElements
    })
  }

  function clearCanvas() {
    setImageAsset(null)
    setElements([])
    setSelectedId(null)
    setFilters(DEFAULT_FILTERS)
  }

  return {
    error,
    imageAsset,
    filters,
    elements,
    selectedId,
    selectedElement,
    stageSize,
    exportPixelRatio,
    textDraft,
    textFill,
    textSize,
    textAlign,
    stampFill,
    setSelectedId,
    setTextDraft,
    setTextFill,
    setTextSize,
    setTextAlign,
    setStampFill,
    uploadImage,
    updateFilters,
    resetFilters,
    addTextElement,
    addStampElement,
    updateElement,
    deleteSelectedElement,
    duplicateSelectedElement,
    moveSelectedElement,
    clearCanvas,
  }
}
