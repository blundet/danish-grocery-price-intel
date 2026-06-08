export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  return new Response("Admin route active", { status: 200 });
}
