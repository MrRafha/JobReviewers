import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(companies);
}
