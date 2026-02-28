"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid dollar amount"),
})

type FormValues = z.infer<typeof schema>

type Props = {
  year: number
  month: number
  currentAmountCents?: number
  onSuccess?: () => void
}

export function IncomeForm({ year, month, currentAmountCents, onSuccess }: Props) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: currentAmountCents != null ? (currentAmountCents / 100).toFixed(2) : "",
    },
  })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (amountCents: number) => {
      const res = await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month, amountCents }),
      })
      if (!res.ok) throw new Error("Failed to save income")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats", "monthly", year] })
      onSuccess?.()
    },
  })

  function onSubmit(values: FormValues) {
    mutate(Math.round(parseFloat(values.amount) * 100))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="income-amount">Amount (USD)</FieldLabel>
        <Input
          id="income-amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register("amount")}
        />
        {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
      </Field>
      {isError && (
        <FieldError>
          {error instanceof Error ? error.message : "Failed to save income"}
        </FieldError>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Income"}
      </Button>
    </form>
  )
}
