interface EmailBadgeProps {
  email: string
}

export function EmailBadge({ email }: EmailBadgeProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
      {email}
    </div>
  )
}
