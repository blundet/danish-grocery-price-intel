"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: number;
  name: string;
  brand?: string;
  size?: string | number;
  unit?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .then(({ data }) => {
        setProducts((data as Product[]) || []);
      });
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Products</h1>

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Brand</th>
              <th style={th}>Size</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.name}</td>
                <td style={td}>{p.brand || "-"}</td>
                <td style={td}>
                  {p.size ? `${p.size} ${p.unit || ""}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "12px 8px",
  borderBottom: "1px solid #ddd",
  fontWeight: 600,
  color: "#374151",
};

const td = {
  padding: "10px 8px",
  borderBottom: "1px solid #eee",
  color: "#4b5563",
};
