"use client"

import { UseFormRegister } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { type EmailFormValues } from "@/lib/auth-schemas"

interface EmailStepProps {
  onSubmit: React.SubmitEventHandler<HTMLFormElement>
  register: UseFormRegister<EmailFormValues>
  error: { message?: string } | undefined
  submitLabel: string
}

export function EmailStep({ onSubmit, register, error, submitLabel }: EmailStepProps) {
  const { t } = useLocale()
  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor="email">{t("auth.common.email")}</FieldLabel>
          <Input
            id="email"
            type="email"
            aria-invalid={!!error}
            placeholder="jane@example.com"
            className="rounded-xl"
            {...register("email")}
          />
          <FieldError errors={error ? [error] : []} />
        </Field>

        <Button
          type="submit"
          className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90"
        >
          {submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}
