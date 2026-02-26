import { InputHTMLAttributes, forwardRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  shown: boolean
  onToggle: () => void
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ shown, onToggle, ...props }, ref) {
    return (
      <div className="relative">
        <Input
          type={shown ? "text" : "password"}
          className="pr-9 rounded-xl"
          ref={ref}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
          aria-label={shown ? "Hide password" : "Show password"}
        >
          {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    )
  }
)
