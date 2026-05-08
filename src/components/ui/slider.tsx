import * as React from "react"

import { cn } from "@/lib/utils"

type SliderProps = Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> & {
  value: number
  onValueChange: (value: number) => void
}

function Slider({ className, value, onValueChange, ...props }: SliderProps) {
  return (
    <input
      type="range"
      data-slot="slider"
      value={value}
      onChange={(event) => onValueChange(Number(event.target.value))}
      className={cn(
        "accent-primary h-8 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Slider }
