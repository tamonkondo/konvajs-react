import type { ReactNode } from "react"

type PanelSectionProps = {
  title: string
  children: ReactNode
}

export function PanelSection({ title, children }: PanelSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}
