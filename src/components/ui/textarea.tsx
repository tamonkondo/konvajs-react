import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-20 w-full rounded-md border px-2.5 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
