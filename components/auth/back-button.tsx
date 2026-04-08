import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
    >
      <ArrowLeft className="size-3.5" />
      {label}
    </button>
  )
}
