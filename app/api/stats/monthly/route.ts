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

  // 3. Aggregate expenses per month via raw SQL (Prisma groupBy cannot extract date parts)
  const expenseRows = await prisma.$queryRaw<{ month: number; total: bigint }[]>`
    SELECT EXTRACT(MONTH FROM date)::int AS month, SUM(amount_cents)::bigint AS total
    FROM expense
    WHERE user_id = ${userId} AND EXTRACT(YEAR FROM date) = ${year}
    GROUP BY month
  `;

  // 4. Fetch monthly income records for the year
  const incomeRows = await prisma.monthlyIncome.findMany({
    where: { userId, year },
    select: { month: true, amountCents: true },
  });

  // 5. Build lookup maps
  const expenseMap = new Map<number, number>();
  for (const row of expenseRows) {
    expenseMap.set(row.month, Number(row.total));
  }

  const incomeMap = new Map<number, number>();
  for (const row of incomeRows) {
    incomeMap.set(row.month, row.amountCents);
  }

  // 6. Produce fixed 12-month array
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const totalExpenses = expenseMap.get(month) ?? 0;
    const income = incomeMap.get(month) ?? 0;
    return { month, totalExpenses, income, balance: income - totalExpenses };
  });

  return NextResponse.json(months);
}
