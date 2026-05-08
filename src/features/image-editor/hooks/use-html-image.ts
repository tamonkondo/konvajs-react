import { useEffect, useState } from "react"

export function useHtmlImage(src?: string) {
  const [imageState, setImageState] = useState<{
    src: string
    image: HTMLImageElement
  } | null>(null)

  useEffect(() => {
    if (!src) return

    const nextImage = new Image()
    nextImage.onload = () => setImageState({ src, image: nextImage })
    nextImage.src = src
  }, [src])

  return imageState && imageState.src === src ? imageState.image : null
}
