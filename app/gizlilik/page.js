export const metadata = {
  title: "Gizlilik Politikası",
  description:
    "DOKUNUVER internet sitesi gizlilik politikası ve kişisel verilerin kullanımına ilişkin bilgiler.",
};

export default function GizlilikPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        color: "#101828",
      }}
    >
      <header
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "22px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <a
          href="/"
          style={{
            color: "#101828",
            textDecoration: "none",
            fontSize: "20px",
            fontWeight: "800",
          }}
        >
          DOKUNUVER
        </a>

        <a
          href="/"
          style={{
            color: "#475467",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          ← Ana Sayfaya Dön
        </a>
      </header>

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "70px 24px 120px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#eef4ff",
            color: "#3538cd",
            padding: "8px 14px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "22px",
          }}
        >
          GİZLİLİK
        </div>

        <h1
          style={{
            margin: "0 0 18px",
            fontSize: "clamp(36px, 6vw, 56px)",
            lineHeight: "1.05",
            letterSpacing: "-2px",
          }}
        >
          Gizlilik Politikası
        </h1>

        <p
          style={{
            margin: "0 0 48px",
            color: "#667085",
            fontSize: "16px",
            lineHeight: "1.7",
          }}
        >
          Son güncelleme: 23 Eylül 2026
        </p>

        <ContentSection title="1. Genel Bilgilendirme">
          DOKUNUVER olarak internet sitemizi ziyaret eden kullanıcıların
          gizliliğine önem veriyoruz. Bu politika, dokunuver.com.tr internet
          sitesinin kullanımı sırasında elde edilebilecek bilgilerin hangi
          amaçlarla kullanılabileceğine ilişkin genel bilgilendirme sunar.
        </ContentSection>

        <ContentSection title="2. Toplanabilecek Bilgiler">
          İnternet sitemizi yalnızca ziyaret etmeniz sırasında doğrudan ad,
          soyad, telefon numarası veya e-posta adresi girmenizi zorunlu tutan
          bir üyelik sistemi bulunmamaktadır. WhatsApp üzerinden bizimle
          iletişime geçmeniz halinde ise paylaşmayı tercih ettiğiniz bilgiler,
          talebinize yanıt verebilmek ve iletişimi sürdürebilmek amacıyla
          kullanılabilir.
        </ContentSection>

        <ContentSection title="3. Bilgilerin Kullanım Amaçları">
          Bizimle paylaşılan bilgiler; ürünler hakkında bilgi verilmesi,
          taleplerin yanıtlanması, sipariş veya ürün süreçlerinin yürütülmesi
          ve kullanıcılarla iletişim kurulması amacıyla kullanılabilir.
        </ContentSection>

        <ContentSection title="4. Üçüncü Taraf Hizmetler">
          DOKUNUVER ürünleri ve internet sitesi; WhatsApp, Google, Instagram
          ve benzeri üçüncü taraf hizmetlere bağlantılar içerebilir. Bu
          hizmetlere geçiş yaptıktan sonra ilgili platformların kendi
          gizlilik politikaları ve kullanım koşulları geçerlidir.
        </ContentSection>

        <ContentSection title="5. Güvenlik">
          Kullanıcı bilgilerinin yetkisiz erişim, kayıp veya kötüye kullanıma
          karşı korunması için makul teknik ve idari önlemlerin uygulanmasına
          önem verilmektedir.
        </ContentSection>

        <ContentSection title="6. Politika Değişiklikleri">
          Bu gizlilik politikası, DOKUNUVER hizmetlerinde veya ilgili
          uygulamalarda meydana gelebilecek değişikliklere bağlı olarak
          güncellenebilir. Güncel metin bu sayfada yayımlanır.
        </ContentSection>

        <ContentSection title="7. İletişim">
          Gizlilik politikasıyla ilgili sorularınız için DOKUNUVER iletişim
          kanalı üzerinden bizimle iletişime geçebilirsiniz.
        </ContentSection>

        <div
          style={{
            marginTop: "48px",
            paddingTop: "28px",
            borderTop: "1px solid #eaecf0",
          }}
        >
          <a
            href="/iletisim"
            style={{
              color: "#087cf0",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            İletişim →
          </a>
        </div>
      </section>
    </main>
  );
}

function ContentSection({ title, children }) {
  return (
    <section
      style={{
        marginBottom: "36px",
      }}
    >
      <h2
        style={{
          margin: "0 0 12px",
          fontSize: "21px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: 0,
          color: "#475467",
          fontSize: "15px",
          lineHeight: "1.8",
        }}
      >
        {children}
      </p>
    </section>
  );
}
