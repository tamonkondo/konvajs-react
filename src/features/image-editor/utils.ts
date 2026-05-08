import type { ImageAsset, StageSize } from "./types"

export function createElementId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function readImageFile(file: File): Promise<ImageAsset> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("画像ファイルを選択してください。"))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error("画像を読み込めませんでした。"))
    reader.onload = () => {
      const dataUrl = String(reader.result)
      const image = new Image()
      image.onload = () => {
        resolve({
          dataUrl,
          width: image.naturalWidth,
          height: image.naturalHeight,
          name: file.name,
        })
      }
      image.onerror = () => reject(new Error("画像を読み込めませんでした。"))
      image.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

export function getContainedImageRect(image: ImageAsset, stage: StageSize) {
  const maxWidth = stage.width - 56
  const maxHeight = stage.height - 56
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
  const width = image.width * scale
  const height = image.height * scale

  return {
    x: (stage.width - width) / 2,
    y: (stage.height - height) / 2,
    width,
    height,
  }
}
