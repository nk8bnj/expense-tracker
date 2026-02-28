import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(2100)
    .default(new Date().getFullYear()),
});

export async function GET(request: NextRequest) {
  // 1. Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse & validate query params
  const { searchParams } = request.nextUrl;
  const parsed = querySchema.safeParse({ year: searchParams.get("year") ?? undefined });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(", ") },
      { status: 400 }
    );
  }

  const { year } = parsed.data;
  const userId = session.user.id;

  // 3. Fetch all expenses for the year and aggregate by month in JS
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
    select: { date: true, amountCents: true },
  });

  const expenseMap = new Map<number, number>();
  for (const expense of expenses) {
    const month = expense.date.getMonth() + 1;
    expenseMap.set(month, (expenseMap.get(month) ?? 0) + expense.amountCents);
  }

  // 4. Fetch monthly income records for the year
  const incomeRows = await prisma.monthlyIncome.findMany({
    where: { userId, year },
    select: { month: true, amountCents: true },
  });

  const incomeMap = new Map<number, number>();
  for (const row of incomeRows) {
    incomeMap.set(row.month, row.amountCents);
  }

  // 5. Produce fixed 12-month array
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const totalExpenses = expenseMap.get(month) ?? 0;
    const income = incomeMap.get(month) ?? 0;
    return { month, totalExpenses, income, balance: income - totalExpenses };
  });

  return NextResponse.json(months);
}
