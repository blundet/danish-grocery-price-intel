import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const store = formData.get("store") as string;
    const token = formData.get("token") as string;
    const storeId = formData.get("storeId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!token || !storeId) {
      return NextResponse.json(
        { error: "Missing Blob credentials" },
        { status: 500 }
      );
    }

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
