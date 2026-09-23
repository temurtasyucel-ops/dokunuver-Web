export const dynamic = "force-dynamic";

async function verifyAdmin(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.replace("Bearer ", "");

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return response.ok;
}

export async function GET(request) {
  try {
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return Response.json(
        { error: "Yetkisiz erişim." },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?select=id,code,product_type,business_name,target_url,active,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Smart Links Supabase error:", errorText);

      return Response.json(
        { error: "Smart Link kayıtları alınamadı." },
        { status: 500 }
      );
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Smart Links GET error:", error);

    return Response.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
