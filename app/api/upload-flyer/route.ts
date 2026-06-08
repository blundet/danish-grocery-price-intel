import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const store = formData.get("store") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Explicitly read both env vars
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
    const storeId = process.env.BLOB_STORE_ID;

    if (!token || !storeId) {
      console.error("Missing Blob credentials:", { token, storeId });
      return NextResponse.json({ error: "Blob credentials missing" }, { status: 500 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      token,
      storeId,
    });

    return NextResponse.json({
      url: blob.url,
      store,
    });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
