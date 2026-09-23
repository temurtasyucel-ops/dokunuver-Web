export default async function SmartLinkPage({ params }) {
  const { code } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
      code
    )}&active=eq.true&select=target_url`,
    {
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    }
  );

  const responseText = await response.text();

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>DOKUNUVER Smart Link Test</h1>

      <p>
        <strong>Kod:</strong> {code}
      </p>

      <p>
        <strong>Supabase URL var mı:</strong>{" "}
        {supabaseUrl ? "EVET" : "HAYIR"}
      </p>

      <p>
        <strong>Secret Key var mı:</strong>{" "}
        {secretKey ? "EVET" : "HAYIR"}
      </p>

      <p>
        <strong>HTTP Status:</strong> {response.status}
      </p>

      <p>
        <strong>Supabase cevabı:</strong>
      </p>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#f2f4f7",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        {responseText}
      </pre>
    </main>
  );
}
