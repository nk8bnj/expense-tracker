import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

function d(year: number, month: number, day: number) {
  return new Date(year, month - 1, day);
}

async function main() {
  console.log("Seeding database...\n");

  // --- Step 1: Create demo user ---
  let userId: string;
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: "Demo User",
        email: "demo@example.com",
        password: "demo123456",
      },
    });
    userId = result.user.id;
    console.log(`✓ Created demo user: ${result.user.email} (${userId})`);
  } catch {
    const existing = await prisma.user.findUnique({
      where: { email: "demo@example.com" },
    });
    if (!existing) throw new Error("Failed to create or find demo user");
    userId = existing.id;
    console.log(`✓ Demo user already exists: ${existing.email} (${userId})`);
  }

  // --- Step 2: Seed MonthlyIncome ---
  const incomeRecords = [
    { year: 2025, month: 1,  amountCents: 520000 },
    { year: 2025, month: 2,  amountCents: 520000 },
    { year: 2025, month: 3,  amountCents: 550000 },
    { year: 2025, month: 4,  amountCents: 550000 },
    { year: 2025, month: 5,  amountCents: 600000 },
    { year: 2025, month: 6,  amountCents: 600000 },
    { year: 2025, month: 7,  amountCents: 620000 },
    { year: 2025, month: 8,  amountCents: 620000 },
    { year: 2025, month: 9,  amountCents: 650000 },
    { year: 2025, month: 10, amountCents: 650000 },
    { year: 2025, month: 11, amountCents: 700000 },
    { year: 2025, month: 12, amountCents: 700000 },
    { year: 2026, month: 1,  amountCents: 620000 },
    { year: 2026, month: 2,  amountCents: 650000 },
  ];

  for (const record of incomeRecords) {
    await prisma.monthlyIncome.upsert({
      where: { userId_year_month: { userId, year: record.year, month: record.month } },
      update: { amountCents: record.amountCents },
      create: { userId, ...record },
    });
  }
  console.log(`✓ Seeded ${incomeRecords.length} monthly income records`);

  // --- Step 3: Seed Expenses ---
  const existingCount = await prisma.expense.count({ where: { userId } });
  if (existingCount > 0) {
    console.log(`✓ Expenses already seeded (${existingCount} records). Skipping.`);
  } else {
    const expenses = [
      // January 2025
      { date: d(2025, 1,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 1,  5),  category: "Groceries",        description: "Weekly groceries",      amountCents: 12500  },
      { date: d(2025, 1,  8),  category: "Utilities",        description: "Electric bill",         amountCents:  8700  },
      { date: d(2025, 1, 12),  category: "Food & Dining",    description: "Restaurant dinner",     amountCents:  6800  },
      { date: d(2025, 1, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 1, 18),  category: "Transportation",   description: "Gas station",           amountCents:  5200  },
      { date: d(2025, 1, 22),  category: "Groceries",        description: "Grocery run",           amountCents:  9800  },
      // February 2025
      { date: d(2025, 2,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 2,  4),  category: "Groceries",        description: "Weekly groceries",      amountCents: 11200  },
      { date: d(2025, 2,  7),  category: "Utilities",        description: "Internet + electric",   amountCents: 12000  },
      { date: d(2025, 2, 10),  category: "Healthcare",       description: "Doctor visit",          amountCents: 15000  },
      { date: d(2025, 2, 14),  category: "Food & Dining",    description: "Valentine's dinner",    amountCents:  9500  },
      { date: d(2025, 2, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 2, 20),  category: "Shopping",         description: "Clothes",               amountCents:  8700  },
      // March 2025
      { date: d(2025, 3,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 3,  3),  category: "Groceries",        description: "Weekly groceries",      amountCents: 13400  },
      { date: d(2025, 3,  8),  category: "Utilities",        description: "Electric bill",         amountCents:  9100  },
      { date: d(2025, 3, 12),  category: "Transportation",   description: "Car service",           amountCents: 12000  },
      { date: d(2025, 3, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 3, 18),  category: "Entertainment",    description: "Concert tickets",       amountCents:  7500  },
      { date: d(2025, 3, 22),  category: "Groceries",        description: "Grocery run",           amountCents: 10500  },
      // April 2025
      { date: d(2025, 4,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 4,  5),  category: "Groceries",        description: "Weekly groceries",      amountCents: 11800  },
      { date: d(2025, 4,  9),  category: "Utilities",        description: "Internet + electric",   amountCents: 10200  },
      { date: d(2025, 4, 12),  category: "Food & Dining",    description: "Brunch with friends",   amountCents:  4500  },
      { date: d(2025, 4, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 4, 20),  category: "Shopping",         description: "Home decor",            amountCents: 15600  },
      { date: d(2025, 4, 25),  category: "Transportation",   description: "Uber rides",            amountCents:  3800  },
      // May 2025
      { date: d(2025, 5,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 5,  4),  category: "Groceries",        description: "Weekly groceries",      amountCents: 14200  },
      { date: d(2025, 5,  8),  category: "Utilities",        description: "Electric bill",         amountCents:  8800  },
      { date: d(2025, 5, 12),  category: "Entertainment",    description: "Movie night",           amountCents:  3200  },
      { date: d(2025, 5, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 5, 20),  category: "Travel",           description: "Weekend trip",          amountCents: 45000  },
      { date: d(2025, 5, 25),  category: "Food & Dining",    description: "Dinner out",            amountCents:  7200  },
      // June 2025
      { date: d(2025, 6,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 6,  3),  category: "Groceries",        description: "Weekly groceries",      amountCents: 12900  },
      { date: d(2025, 6,  8),  category: "Utilities",        description: "Internet + electric",   amountCents: 11500  },
      { date: d(2025, 6, 12),  category: "Healthcare",       description: "Dentist",               amountCents: 20000  },
      { date: d(2025, 6, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 6, 20),  category: "Shopping",         description: "Summer clothes",        amountCents: 22000  },
      { date: d(2025, 6, 25),  category: "Transportation",   description: "Gas station",           amountCents:  6100  },
      // July 2025
      { date: d(2025, 7,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 7,  4),  category: "Food & Dining",    description: "4th of July BBQ",       amountCents:  8900  },
      { date: d(2025, 7,  7),  category: "Groceries",        description: "Weekly groceries",      amountCents: 13700  },
      { date: d(2025, 7,  9),  category: "Utilities",        description: "AC + electric",         amountCents: 15800  },
      { date: d(2025, 7, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 7, 18),  category: "Travel",           description: "Summer vacation",       amountCents: 80000  },
      { date: d(2025, 7, 25),  category: "Entertainment",    description: "Concerts",              amountCents:  5500  },
      // August 2025
      { date: d(2025, 8,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 8,  5),  category: "Groceries",        description: "Weekly groceries",      amountCents: 12100  },
      { date: d(2025, 8,  8),  category: "Utilities",        description: "Electric bill",         amountCents: 14200  },
      { date: d(2025, 8, 12),  category: "Shopping",         description: "Back to school",        amountCents: 18500  },
      { date: d(2025, 8, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 8, 20),  category: "Transportation",   description: "Car insurance",         amountCents: 12000  },
      { date: d(2025, 8, 25),  category: "Food & Dining",    description: "Restaurant",            amountCents:  5500  },
      // September 2025
      { date: d(2025, 9,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 9,  4),  category: "Groceries",        description: "Weekly groceries",      amountCents: 11500  },
      { date: d(2025, 9,  8),  category: "Utilities",        description: "Internet + electric",   amountCents:  9800  },
      { date: d(2025, 9, 12),  category: "Healthcare",       description: "Annual checkup",        amountCents: 10000  },
      { date: d(2025, 9, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 9, 20),  category: "Entertainment",    description: "Sports tickets",        amountCents:  6500  },
      { date: d(2025, 9, 25),  category: "Shopping",         description: "Fall clothing",         amountCents: 17000  },
      // October 2025
      { date: d(2025, 10,  1), category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 10,  5), category: "Groceries",        description: "Weekly groceries",      amountCents: 13200  },
      { date: d(2025, 10,  8), category: "Utilities",        description: "Electric bill",         amountCents: 10500  },
      { date: d(2025, 10, 12), category: "Food & Dining",    description: "Dinner out",            amountCents:  7800  },
      { date: d(2025, 10, 15), category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 10, 20), category: "Transportation",   description: "Gas station",           amountCents:  5500  },
      { date: d(2025, 10, 25), category: "Entertainment",    description: "Halloween party",       amountCents:  4200  },
      // November 2025
      { date: d(2025, 11,  1), category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 11,  5), category: "Groceries",        description: "Weekly groceries",      amountCents: 14800  },
      { date: d(2025, 11,  8), category: "Utilities",        description: "Heating + electric",    amountCents: 13200  },
      { date: d(2025, 11, 15), category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 11, 22), category: "Shopping",         description: "Black Friday deals",    amountCents: 45000  },
      { date: d(2025, 11, 27), category: "Food & Dining",    description: "Thanksgiving dinner",   amountCents: 12000  },
      // December 2025
      { date: d(2025, 12,  1), category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2025, 12,  5), category: "Groceries",        description: "Weekly groceries",      amountCents: 13600  },
      { date: d(2025, 12,  8), category: "Utilities",        description: "Heating + electric",    amountCents: 14500  },
      { date: d(2025, 12, 10), category: "Shopping",         description: "Holiday gifts",         amountCents: 65000  },
      { date: d(2025, 12, 15), category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2025, 12, 20), category: "Travel",           description: "Holiday travel",        amountCents: 60000  },
      { date: d(2025, 12, 25), category: "Food & Dining",    description: "Christmas dinner",      amountCents: 15000  },
      // January 2026
      { date: d(2026, 1,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2026, 1,  5),  category: "Groceries",        description: "Weekly groceries",      amountCents: 12300  },
      { date: d(2026, 1,  8),  category: "Utilities",        description: "Heating + electric",    amountCents: 15600  },
      { date: d(2026, 1, 12),  category: "Healthcare",       description: "New year checkup",      amountCents:  8500  },
      { date: d(2026, 1, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2026, 1, 20),  category: "Transportation",   description: "Uber rides",            amountCents:  4200  },
      // February 2026
      { date: d(2026, 2,  1),  category: "Rent / Housing",  description: "Monthly rent",          amountCents: 150000 },
      { date: d(2026, 2,  5),  category: "Groceries",        description: "Weekly groceries",      amountCents: 11900  },
      { date: d(2026, 2,  8),  category: "Utilities",        description: "Electric + heating",    amountCents: 13800  },
      { date: d(2026, 2, 14),  category: "Food & Dining",    description: "Valentine's dinner",    amountCents: 10500  },
      { date: d(2026, 2, 15),  category: "Subscriptions",    description: "Netflix & Spotify",     amountCents:  2899  },
      { date: d(2026, 2, 20),  category: "Shopping",         description: "Online shopping",       amountCents:  9800  },
    ];

    await prisma.expense.createMany({
      data: expenses.map((e) => ({ ...e, userId })),
    });
    console.log(`✓ Seeded ${expenses.length} expense records`);
  }

  console.log("\nSeed complete! Sign in with:");
  console.log("  Email:    demo@example.com");
  console.log("  Password: demo123456");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
