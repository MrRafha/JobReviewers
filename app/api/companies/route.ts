import { NextRequest, NextResponse } from "next/server";

import { getAllCompanies, searchCompanies } from "@/lib/services/companies";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    let companies;

    if (search) {
      companies = await searchCompanies(search);
    } else {
      companies = await getAllCompanies(
        limit ? parseInt(limit, 10) : undefined
      );
    }

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error in companies API:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
