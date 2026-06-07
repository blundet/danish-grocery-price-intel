"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProcessedPage {
  pageNumber: number;
  imageBase64: string;
}

export default function UploadFlyer() {
  const [file, setFile] = useState<File | null>(null);
  const [store, setStore] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [pages, setPages] = useState<ProcessedPage[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setPages([]);

    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    if (!store) {
      setMessage("Please select a store");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("store", store);

    const uploadRes = await fetch("/api/upload-flyer", {
      method: "POST",
      body: formData,
    });

    const uploadJson = await uploadRes.json();

    if (uploadJson.error) {
      setMessage("Upload failed: " + uploadJson.error);
      return;
    }

    const filePath = uploadJson.filePath;

    const { error } = await supabase.from("flyers").insert([
      {
        store,
        file_url: filePath,
        valid_from: new Date().toISOString(),
        valid_to: new Date().toISOString(),
      },
    ]);

    if (error) {
      setMessage("Insert failed: " + error.message);
      return;
    }

    setMessage("Flyer uploaded! Processing pages…");
    setProcessing(true);

    const res = await fetch("/api/process-flyer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileUrl: filePath,
        store,
      }),
    });

    const result = await res.json();
    setPages(result.pages || []);
    setProcessing(false);
    setMessage("PDF processed successfully!");
  };

  return (
    <div style={{ maxWidth: 650, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Upload Flyer PDF</h1>

      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <form
          onSubmit={upload}
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontWeight: 600 }}>Store</label>
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 15,
              }}
            >
              <option value="">Select store</option>
              <option value="Rema 1000">Rema 1000</option>
              <option value="Netto">Netto</option>
              <option value="Føtex">Føtex</option>
              <option value="Bilka">Bilka</option>
              <option value="Lidl">Lidl</option>
            </select>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              padding: 30,
              borderRadius: 12,
              border: dragActive
                ? "2px dashed #4f46e5"
                : "2px dashed #cbd5e1",
              background: dragActive ? "#eef2ff" : "#f8fafc",
              textAlign: "center",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <p style={{ margin: 0, fontSize: 15, color: "#475569" }}>
              {file ? (
                <strong>{file.name}</strong>
              ) : (
                "Drag & drop a PDF here, or click to select"
              )}
            </p>
          </div>

          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "none" }}
          />

          <button
            type="submit"
            style={{
              padding: 14,
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              cursor: "pointer",
              fontWeight: 600,
              transition: "background 0.2s",
            }}
          >
            Upload PDF
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: 20,
              fontWeight: 600,
              color: message.includes("success") ? "green" : "black",
            }}
          >
            {message}
          </p>
        )}

        {processing && <p>Processing PDF pages…</p>}

        {pages.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <h2>Extracted Pages</h2>
            {pages.map((p) => (
              <div key={p.pageNumber} style={{ marginBottom: 20 }}>
                <p>Page {p.pageNumber}</p>
                <img
                  src={`data:image/png;base64,${p.imageBase64}`}
                  style={{ width: "300px", border: "1px solid #ccc" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
