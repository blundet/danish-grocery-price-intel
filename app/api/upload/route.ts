import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// ⭐ Use Edge runtime to bypass body‑size limits
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ⭐ Upload directly to Vercel Blob
    const blob = await put(file.name, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
