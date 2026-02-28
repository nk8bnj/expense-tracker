"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"

import { CATEGORIES } from "@/lib/categories"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Expense = {
  id: string
  amountCents: number
  category: string
  description?: string | null
  date: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  year: number
  month: number
  expense?: Expense
}

const categoryValues = CATEGORIES.map(c => c.value) as [string, ...string[]]

const schema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid dollar amount"),
  category: z.enum(categoryValues, { error: "Category is required" }),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
})

type FormValues = z.infer<typeof schema>

export function ExpenseFormDialog({ open, onOpenChange, year, month, expense }: Props) {
  const queryClient = useQueryClient()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: expense ? (expense.amountCents / 100).toFixed(2) : "",
      category: expense ? expense.category : undefined,
      description: expense ? (expense.description ?? "") : "",
      date: expense
        ? format(new Date(expense.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    },
  })

  const { mutate, isPending, isError, error, reset: resetMutation } = useMutation({
    mutationFn: async (values: FormValues) => {
      const body = {
        amountCents: Math.round(parseFloat(values.amount) * 100),
        category: values.category,
        description: values.description || undefined,
        date: values.date,
      }

      const url = expense ? `/api/expenses/${expense.id}` : "/api/expenses"
      const method = expense ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ? JSON.stringify(data.error) : "Failed to save expense")
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", year, month] })
      onOpenChange(false)
      reset()
      resetMutation()
    },
  })

  function onSubmit(values: FormValues) {
    mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (!nextOpen) {
        reset()
        resetMutation()
      }
      onOpenChange(nextOpen)
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Amount ($)</FieldLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("amount")}
            />
            {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <FieldError>{errors.category.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Description (optional)</FieldLabel>
            <Input
              type="text"
              placeholder="What was this for?"
              {...register("description")}
            />
          </Field>

          <Field>
            <FieldLabel>Date</FieldLabel>
            <Input type="date" {...register("date")} />
            {errors.date && <FieldError>{errors.date.message}</FieldError>}
          </Field>

          {isError && (
            <p className="text-destructive text-sm">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : expense ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
