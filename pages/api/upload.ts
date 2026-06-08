export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "500mb",
  },
};

import type { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const blob = await put(file.name, file, { access: "public" });

    return res.status(200).json({ url: blob.url });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
