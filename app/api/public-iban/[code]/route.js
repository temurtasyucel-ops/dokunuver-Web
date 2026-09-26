export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { code } = await params;

    if (!code) {
      return Response.json(
        { error: "Kart kodu bulunamadı." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      console.error(
        "Public IBAN: Supabase environment variables missing."
      );

      return Response.json(
        { error: "Sunucu yapılandırma hatası." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
        code
      )}&active=eq.true&locked=eq.true&status=eq.locked&select=business_name,bank_name,account_holder,iban,locked_at`,
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

      console.error(
        "Public IBAN Supabase error:",
        errorText
      );

      return Response.json(
        { error: "Kart bilgileri alınamadı." },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return Response.json(
        { error: "Kart bulunamadı veya kullanım dışı." },
        { status: 404 }
      );
    }

    return Response.json(data[0]);
  } catch (error) {
    console.error(
      "Public IBAN API error:",
      error
    );

    return Response.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
