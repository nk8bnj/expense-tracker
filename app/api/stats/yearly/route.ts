import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 2. Aggregate expenses per year via raw SQL (Prisma groupBy cannot extract date parts)
  const expenseRows = await prisma.$queryRaw<{ year: number; total: bigint }[]>`
    SELECT EXTRACT(YEAR FROM date)::int AS year, SUM(amount_cents)::bigint AS total
    FROM expense
    WHERE user_id = ${userId}
    GROUP BY year
  `;

  // 3. Aggregate income per year using Prisma groupBy (MonthlyIncome has an explicit year field)
  const incomeRows = await prisma.monthlyIncome.groupBy({
    by: ["year"],
    _sum: { amountCents: true },
    where: { userId },
  });

  // 4. Build lookup maps
  const expenseMap = new Map<number, number>();
  for (const row of expenseRows) {
    expenseMap.set(row.year, Number(row.total));
  }

  const incomeMap = new Map<number, number>();
  for (const row of incomeRows) {
    incomeMap.set(row.year, row._sum.amountCents ?? 0);
  }

  // 5. Collect all years from both datasets
  const allYears = new Set([...expenseMap.keys(), ...incomeMap.keys()]);

  const years = Array.from(allYears)
    .sort((a, b) => a - b)
    .map((year) => {
      const totalExpenses = expenseMap.get(year) ?? 0;
      const totalIncome = incomeMap.get(year) ?? 0;
      return { year, totalExpenses, totalIncome, balance: totalIncome - totalExpenses };
    });

  return NextResponse.json(years);
}
