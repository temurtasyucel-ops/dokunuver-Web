import { requirePanelAdmin } from "../../../lib/admin-auth.mjs";
export const dynamic = "force-dynamic";
export async function GET(request) {
  const auth = await requirePanelAdmin(request);
  return Response.json(auth.ok ? { ok: true } : { error: auth.error }, {
    status: auth.ok ? 200 : auth.status, headers: { "Cache-Control": "no-store" }
  });
}
