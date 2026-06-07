"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Flyer {
  id: number;
  store: string;
  file_url: string;
  valid_from: string;
  valid_to: string;
}

export default function FlyersPage() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);

  useEffect(() => {
    supabase
      .from("flyers")
      .select("*")
      .then(({ data }) => {
        setFlyers((data as Flyer[]) || []);
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
