import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDaysInMonth } from "date-fns";

const querySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export async function GET(request: NextRequest) {
  // 1. Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse & validate query params
  const { searchParams } = request.nextUrl;
  const parsed = querySchema.safeParse({
    year: searchParams.get("year"),
    month: searchParams.get("month"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(", ") },
      { status: 400 }
    );
  }

  const { year, month } = parsed.data;
  const userId = session.user.id;

  // 3. Fetch expenses for the month and aggregate by day in JS
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: { date: true, amountCents: true },
  });

  const expenseMap = new Map<number, number>();
  for (const expense of expenses) {
    const day = expense.date.getDate();
    expenseMap.set(day, (expenseMap.get(day) ?? 0) + expense.amountCents);
  }

  // 4. Fetch monthly income record
  const incomeRecord = await prisma.monthlyIncome.findFirst({
    where: { userId, year, month },
  });

  // 5. Build daily array
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      day,
      totalExpenses: expenseMap.get(day) ?? 0,
      income: incomeRecord?.amountCents ?? 0,
    };
  });

  return NextResponse.json(days);
}
