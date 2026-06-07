import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const exec = promisify(execFile);

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "Missing fileUrl" }, { status: 400 });
    }

    // 1. Download the PDF from Supabase Storage (public bucket)
    const pdfResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${fileUrl}`
    );

    if (!pdfResponse.ok) {
      return NextResponse.json(
        { error: "Failed to download PDF from Supabase" },
        { status: 500 }
      );
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    // 2. Save PDF to /tmp
    const flyerId = Date.now().toString();
    const tempPdfPath = `/tmp/flyer-${flyerId}.pdf`;
    fs.writeFileSync(tempPdfPath, pdfBuffer);

    // 3. Create output folder
    const outputDir = `/tmp/flyer-${flyerId}-pages`;
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    // 4. Convert PDF → PNG using MuPDF
    await exec("mutool", [
      "draw",
      "-o",
      `${outputDir}/page-%d.png`,
      tempPdfPath,
    ]);

    // 5. Read generated PNGs
    const pages = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith(".png"))
      .map((filename) => {
        const filePath = path.join(outputDir, filename);
        const imageBuffer = fs.readFileSync(filePath);

        return {
          pageNumber: parseInt(
            filename.replace("page-", "").replace(".png", "")
          ),
          imageBase64: imageBuffer.toString("base64"),
        };
      });

    // 6. Return PNGs to the frontend
    return NextResponse.json({ pages });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
