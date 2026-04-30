import { NextResponse } from "next/server";

import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { getAvailableLocations } from "@/lib/services/companies";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

export async function GET() {
  try {
    const locations = await getAvailableLocations();
    return NextResponse.json(locations);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json({ error: DB_UNAVAILABLE.MESSAGE }, { status: 503 });
    }
    return NextResponse.json({ error: "Falha ao buscar localizações" }, { status: 500 });
  }
}
