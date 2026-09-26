import { redirect, notFound } from "next/navigation";

export default async function SmartLinkPage({ params }) {
  const { code } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
  code
)}&status=eq.assigned&active=eq.true&select=target_url`,
    {
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const data = await response.json();

  if (!data || data.length === 0 || !data[0].target_url) {
    notFound();
  }

  redirect(data[0].target_url);
}
