import { NextRequest, NextResponse } from "next/server";

import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { getAllCompanies, searchCompanies } from "@/lib/services/companies";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const location = searchParams.get("location");

    let companies;

    if (search) {
      companies = await searchCompanies(search);
    } else {
      companies = await getAllCompanies(
        limit ? parseInt(limit, 10) : undefined,
        location ?? undefined
      );
    }

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error in companies API:", error);
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json(
          { error: DB_UNAVAILABLE.MESSAGE },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
