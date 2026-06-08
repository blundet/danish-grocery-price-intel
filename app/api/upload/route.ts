// ⭐ Allow large uploads (up to 500MB)
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "500mb",
  },
};

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ⭐ Upload to Vercel Blob
    const blob = await put(file.name, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
