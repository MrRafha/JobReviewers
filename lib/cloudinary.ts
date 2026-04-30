import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadBadgeIcon(
  base64Data: string
): Promise<{ url: string; dominantColors: string[] }> {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder: "badges",
    transformation: [
      { effect: "trim:10" },
      { width: 128, height: 128, crop: "pad", gravity: "center", background: "none" },
    ],
    colors: true,
  });

  const dominantColors: string[] = (
    (result.colors as [string, number][] | undefined) ?? []
  )
    .slice(0, 5)
    .map(([hex]) => hex);

  return { url: result.secure_url, dominantColors };
}

export default cloudinary;
