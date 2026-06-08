import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge"; // ⭐ Required to bypass body size limits

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ⭐ Upload directly to Blob (Edge runtime supports large files)
    const blob = await put(file.name, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
