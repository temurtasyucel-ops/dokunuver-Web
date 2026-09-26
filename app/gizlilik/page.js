export const metadata = {
  title: "Gizlilik Politikası | DOKUNUVER",
  description:
    "DOKUNUVER internet sitesi gizlilik politikası, kişisel verilerin kullanımı ve üçüncü taraf hizmetlere ilişkin bilgiler.",
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
      {/* HEADER */}
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
            textDecoration: "none",
            color: "#101828",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "900",
              letterSpacing: "-0.7px",
            }}
          >
            DOKUNUVER
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#087cf0",
              fontWeight: "700",
              marginTop: "2px",
            }}
          >
            Dokun. Bağlan.
          </div>
        </a>

        <a
          href="/"
          style={{
            color: "#475467",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          ← Ana Sayfaya Dön
        </a>
      </header>

      {/* CONTENT */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "70px 24px 100px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#eaf4ff",
            color: "#087cf0",
            padding: "8px 14px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: "800",
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
            margin: "0 0 50px",
            color: "#667085",
            fontSize: "15px",
            lineHeight: "1.7",
          }}
        >
          Son güncelleme: 27 Eylül 2026
        </p>

        <ContentSection title="1. Genel Bilgilendirme">
          DOKUNUVER olarak internet sitemizi ziyaret eden kullanıcıların
          gizliliğine önem veriyoruz. Bu politika, dokunuver.com.tr internet
          sitesinin kullanımı ve DOKUNUVER ile iletişim kurulması sırasında
          elde edilebilecek bilgilerin hangi amaçlarla kullanılabileceği
          hakkında genel bilgilendirme sunar.
        </ContentSection>

        <ContentSection title="2. Doğrudan Paylaşılan Bilgiler">
          İnternet sitemizde kullanıcı hesabı oluşturmanızı veya yalnızca
          siteyi ziyaret etmek için ad, soyad, telefon numarası ya da e-posta
          adresi girmenizi zorunlu tutan bir üyelik sistemi bulunmamaktadır.
          WhatsApp veya diğer iletişim kanalları üzerinden bizimle iletişime
          geçtiğinizde ise paylaşmayı tercih ettiğiniz iletişim, işletme,
          sipariş ve ürün bilgileri talebinizi karşılamak amacıyla
          kullanılabilir.
        </ContentSection>

        <ContentSection title="3. Teknik Bilgiler">
          İnternet sitesinin çalıştırılması, güvenliğinin sağlanması ve teknik
          sorunların tespit edilmesi kapsamında IP adresi, tarayıcı türü,
          cihaz bilgisi, erişim zamanı ve benzeri teknik kayıtlar altyapı ve
          hizmet sağlayıcıları tarafından otomatik olarak işlenebilir. Bu
          bilgiler sitenin güvenli ve kararlı şekilde çalışmasının sağlanması
          amacıyla kullanılabilir.
        </ContentSection>

        <ContentSection title="4. Bilgilerin Kullanım Amaçları">
          Bizimle paylaşılan bilgiler; ürünler hakkında bilgi verilmesi,
          taleplerin yanıtlanması, siparişlerin hazırlanması, NFC ve QR
          bağlantılarının oluşturulması, ürün ve teslimat süreçlerinin
          yürütülmesi, destek sağlanması ve kullanıcılarla iletişim kurulması
          amaçlarıyla kullanılabilir.
        </ContentSection>

        <ContentSection title="5. DOKUNUVER Ürünlerinde Kullanılan Bilgiler">
          DOKUNUVER ürünleri; Google, Instagram, WhatsApp, ilan bağlantıları
          veya IBAN gibi kullanıcı tarafından sağlanan bilgi ve bağlantılarla
          hazırlanabilir. Ürünün çalışabilmesi için gerekli olan bilgiler,
          ilgili ürünün işlevi kapsamında DOKUNUVER sistemlerinde
          işlenebilir.
        </ContentSection>

        <ContentSection title="6. IBAN Ürünleri">
          IBAN ürünlerinde banka adı, hesap sahibi ve IBAN bilgileri ürünün
          işlevi kapsamında kullanılabilir. Bilgiler kontrol ve doğrulama
          işlemi sonrasında sistemde kilitlenebilir ve normal yönetim
          işlemleriyle değiştirilmesi sınırlandırılabilir.
        </ContentSection>

        <ContentSection title="7. Üçüncü Taraf Hizmetler">
          DOKUNUVER internet sitesi ve ürünleri; WhatsApp, Google, Instagram
          ve diğer üçüncü taraf internet hizmetlerine yönlendiren bağlantılar
          içerebilir. Kullanıcı ilgili üçüncü taraf hizmete geçiş yaptığında,
          o hizmet sağlayıcının kendi gizlilik politikaları ve kullanım
          koşulları geçerli olabilir.
        </ContentSection>

        <ContentSection title="8. Teknik Hizmet Sağlayıcıları">
          İnternet sitesinin barındırılması, veri altyapısının işletilmesi,
          güvenliğin sağlanması ve teknik hizmetlerin sunulması amacıyla
          üçüncü taraf teknoloji ve altyapı hizmetlerinden yararlanılabilir.
          Bu hizmetler kapsamında teknik veriler ve hizmetin sağlanması için
          gerekli sınırlı bilgiler ilgili hizmet sağlayıcılar tarafından
          işlenebilir.
        </ContentSection>

        <ContentSection title="9. Çerezler ve Benzeri Teknolojiler">
          İnternet sitesinde teknik olarak gerekli çerezler veya benzeri
          teknolojiler kullanılabilir. İleride analiz, reklam,
          kişiselleştirme veya benzeri amaçlarla zorunlu olmayan teknolojiler
          kullanılması halinde gerekli bilgilendirme ve tercih mekanizmaları
          ayrıca sunulabilir.
        </ContentSection>

        <ContentSection title="10. Veri Güvenliği">
          Kullanıcı ve müşteri bilgilerinin yetkisiz erişim, kayıp,
          değiştirilme veya kötüye kullanıma karşı korunması amacıyla makul
          teknik ve idari güvenlik önlemlerinin uygulanmasına önem
          verilmektedir.
        </ContentSection>

        <ContentSection title="11. Verilerin Saklanması">
          Bizimle paylaşılan bilgiler, ilgili hizmet veya sipariş sürecinin
          yürütülmesi ve uygulanabilir yükümlülüklerin yerine getirilmesi için
          gerekli olduğu süre boyunca saklanabilir. Saklama ihtiyacının sona
          ermesi halinde bilgiler uygulanabilir süreçlere uygun şekilde
          silinebilir, yok edilebilir veya anonim hale getirilebilir.
        </ContentSection>

        <ContentSection title="12. Politika Değişiklikleri">
          Bu gizlilik politikası; DOKUNUVER hizmetlerinde, internet sitesinde,
          kullanılan teknolojilerde veya uygulanabilir düzenlemelerde meydana
          gelebilecek değişikliklere bağlı olarak güncellenebilir. Güncel
          metin her zaman bu sayfada yayımlanır.
        </ContentSection>

        <ContentSection title="13. İletişim">
          Gizlilik politikası, DOKUNUVER ürünleri veya bilgilerinizin
          kullanımıyla ilgili sorularınız için iletişim sayfamız üzerinden
          bizimle iletişime geçebilirsiniz.
        </ContentSection>

        {/* BİLGİ NOTU */}
        <div
          style={{
            marginTop: "48px",
            padding: "24px",
            borderRadius: "18px",
            background: "#ffffff",
            border: "1px solid #eaecf0",
          }}
        >
          <div
            style={{
              color: "#087cf0",
              fontSize: "12px",
              fontWeight: "800",
              marginBottom: "8px",
            }}
          >
            İLETİŞİM
          </div>

          <p
            style={{
              margin: "0 0 16px",
              color: "#667085",
              fontSize: "14px",
              lineHeight: "1.7",
            }}
          >
            Gizlilik konusunda bir sorunuz varsa DOKUNUVER ile doğrudan
            iletişime geçebilirsiniz.
          </p>

          <a
            href="/iletisim"
            style={{
              color: "#087cf0",
              fontWeight: "800",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            İletişim →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#ffffff",
          borderTop: "1px solid #eaecf0",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "900",
                color: "#101828",
              }}
            >
              DOKUNUVER
            </div>

            <div
              style={{
                marginTop: "4px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#087cf0",
              }}
            >
              Dokun. Bağlan.
            </div>
          </a>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/iletisim"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#475467",
                textDecoration: "none",
              }}
            >
              İletişim
            </a>

            <a
              href="/gizlilik"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#475467",
                textDecoration: "none",
              }}
            >
              Gizlilik
            </a>
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#667085",
            }}
          >
            © 2026 DOKUNUVER. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
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
          color: "#101828",
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
