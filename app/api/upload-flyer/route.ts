import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const store = formData.get("store") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create Supabase client with SERVICE ROLE KEY (server-side only)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // no RLS, no size limit
    );

    const filePath = `flyers/${Date.now()}-${file.name}`;

    // Upload using service role (no size limit)
    const { data, error } = await supabase.storage
      .from("flyers")
      .upload(filePath, file, {
        upsert: false,
      });

    if (error) {
      console.error("SERVER UPLOAD ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      filePath,
      store,
    });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
