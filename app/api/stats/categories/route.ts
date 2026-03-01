import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
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
    year: searchParams.get("year") ?? undefined,
    month: searchParams.get("month") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(", ") },
      { status: 400 }
    );
  }

  const { year, month } = parsed.data;
  const userId = session.user.id;

  // 3. Compute date range
  const start = year
    ? month ? startOfMonth(new Date(year, month - 1)) : new Date(year, 0, 1)
    : undefined;
  const end = year
    ? month ? endOfMonth(new Date(year, month - 1)) : new Date(year, 11, 31, 23, 59, 59, 999)
    : undefined;

  // 4. Aggregate expenses by category
  const rows = await prisma.expense.groupBy({
    by: ["category"],
    where: { userId, ...(start && end ? { date: { gte: start, lte: end } } : {}) },
    _sum: { amountCents: true },
    orderBy: { _sum: { amountCents: "desc" } },
  });

  // 5. Calculate percentages
  const grandTotal = rows.reduce((sum, r) => sum + (r._sum.amountCents ?? 0), 0);
  const result = rows.map((r) => {
    const totalCents = r._sum.amountCents ?? 0;
    const percentage =
      grandTotal > 0 ? Math.round((totalCents / grandTotal) * 10000) / 100 : 0;
    return { category: r.category, totalCents, percentage };
  });

  return NextResponse.json(result);
}
