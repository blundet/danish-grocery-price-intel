"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FlyersPage() {
  const [flyers, setFlyers] = useState([]);

  useEffect(() => {
    supabase.from("flyers").select("*").then(({ data }) => {
      setFlyers(data || []);
    });
  }, []);

  return (
    <div>
      <h1>Flyers</h1>

      <ul>
        {flyers.map((f) => (
          <li key={f.id}>
            {f.store} — {f.valid_from} → {f.valid_to}
          </li>
        ))}
      </ul>
    </div>
  );
}
