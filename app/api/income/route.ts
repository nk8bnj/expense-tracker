import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  amountCents: z.number().int().nonnegative(),
});

export async function GET(request: NextRequest) {
  // 1. Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse & validate query params
  const { searchParams } = request.nextUrl;
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  const year = yearParam ? parseInt(yearParam, 10) : NaN;
  const month = monthParam ? parseInt(monthParam, 10) : NaN;

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json(
      { error: "year and month query params are required and must be valid" },
      { status: 400 }
    );
  }

  // 3. Query DB
  const record = await prisma.monthlyIncome.findUnique({
    where: { userId_year_month: { userId: session.user.id, year, month } },
  });

  return NextResponse.json(record); // null if not found – that's fine
}

export async function POST(request: NextRequest) {
  // 1. Auth check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse & validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { year, month, amountCents } = parsed.data;

  // 3. Upsert
  const record = await prisma.monthlyIncome.upsert({
    where: { userId_year_month: { userId: session.user.id, year, month } },
    update: { amountCents },
    create: { userId: session.user.id, year, month, amountCents },
  });

  return NextResponse.json(record);
}
