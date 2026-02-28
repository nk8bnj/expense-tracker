"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { CATEGORIES } from "@/lib/categories"
import { centsToDisplay } from "@/lib/money"
import { ExpenseFormDialog } from "@/components/expense-form-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type Expense = {
  id: string
  userId: string
  amountCents: number
  category: string
  description?: string | null
  date: string
  createdAt: string
  updatedAt: string
}

const TABLE_HEADERS = ["Date", "Category", "Description", "Amount", ""]

function TableSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {TABLE_HEADERS.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide last:w-10"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="px-4 py-3">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-28 rounded bg-muted animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-40 rounded bg-muted animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 rounded bg-muted animate-pulse ml-auto" />
              </td>
              <td className="px-4 py-3 w-10" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ExpensesTable({ year, month }: { year: number; month: number }) {
  const queryClient = useQueryClient()
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)

  const { data: expenses, isLoading, isError } = useQuery<Expense[]>({
    queryKey: ["expenses", year, month],
    queryFn: () =>
      fetch(`/api/expenses?year=${year}&month=${month}`).then(r => r.json()),
  })

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/expenses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", year, month] })
      setDeletingExpense(null)
    },
  })

  if (isLoading) return <TableSkeleton />

  if (isError) {
    return (
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {TABLE_HEADERS.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide last:w-10"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <p className="px-4 py-6 text-sm text-muted-foreground">Failed to load expenses.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {TABLE_HEADERS.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide last:w-10"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!expenses || expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No expenses yet.
                </td>
              </tr>
            ) : (
              expenses.map(expense => {
                const cat = CATEGORIES.find(c => c.value === expense.category)
                return (
                  <tr
                    key={expense.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {format(new Date(expense.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat?.color ?? "#B0B0B0" }}
                        />
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {expense.description ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums whitespace-nowrap">
                      {centsToDisplay(expense.amountCents)}
                    </td>
                    <td className="px-4 py-3 w-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingExpense(expense)}
                          >
                            <Pencil />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeletingExpense(expense)}
                          >
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <ExpenseFormDialog
        open={!!editingExpense}
        onOpenChange={open => !open && setEditingExpense(null)}
        year={year}
        month={month}
        expense={editingExpense ?? undefined}
      />

      <AlertDialog
        open={!!deletingExpense}
        onOpenChange={open => !open && setDeletingExpense(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deletingExpense && deleteExpense(deletingExpense.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
