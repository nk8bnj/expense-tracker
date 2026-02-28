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

  // 2. Fetch all expenses and aggregate by year in JS
  //    (avoids $queryRaw which has compatibility issues with Prisma 7 + pg adapter)
  const expenses = await prisma.expense.findMany({
    where: { userId },
    select: { date: true, amountCents: true },
  });

  const expenseMap = new Map<number, number>();
  for (const expense of expenses) {
    const year = expense.date.getFullYear();
    expenseMap.set(year, (expenseMap.get(year) ?? 0) + expense.amountCents);
  }

  // 3. Aggregate income per year using Prisma groupBy (MonthlyIncome has an explicit year field)
  const incomeRows = await prisma.monthlyIncome.groupBy({
    by: ["year"],
    _sum: { amountCents: true },
    where: { userId },
  });

  const incomeMap = new Map<number, number>();
  for (const row of incomeRows) {
    incomeMap.set(row.year, row._sum.amountCents ?? 0);
  }

  // 4. Collect all years from both datasets
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
