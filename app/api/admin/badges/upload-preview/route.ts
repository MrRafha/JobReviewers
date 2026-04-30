import { NextRequest, NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

import { auth } from "@/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { iconBase64 } = await request.json();
  if (!iconBase64) return NextResponse.json({ error: "iconBase64 obrigatório" }, { status: 400 });

  const result = await cloudinary.uploader.upload(iconBase64, {
    folder: "badges_preview",
    colors: true,
    overwrite: true,
  });

  const dominantColors: string[] = (
    (result.colors as [string, number][] | undefined) ?? []
  )
    .slice(0, 6)
    .map(([hex]) => hex);

  return NextResponse.json({ dominantColors });
}
