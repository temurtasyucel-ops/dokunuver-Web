export const metadata = {
  title: "KVKK Aydınlatma Metni | DOKUNUVER",
  description:
    "DOKUNUVER tarafından gerçekleştirilen kişisel veri işleme faaliyetlerine ilişkin 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki aydınlatma metni.",
};

export default function KvkkPage() {
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
          KİŞİSEL VERİLERİN KORUNMASI
        </div>

        <h1
          style={{
            margin: "0 0 18px",
            fontSize: "clamp(36px, 6vw, 56px)",
            lineHeight: "1.05",
            letterSpacing: "-2px",
          }}
        >
          KVKK Aydınlatma Metni
        </h1>

        <p
          style={{
            margin: "0 0 14px",
            color: "#667085",
            fontSize: "15px",
            lineHeight: "1.7",
          }}
        >
          6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında
          Aydınlatma Metni
        </p>

        <p
          style={{
            margin: "0 0 50px",
            color: "#98a2b3",
            fontSize: "14px",
          }}
        >
          Son güncelleme: 27 Eylül 2026
        </p>

        {/* VERİ SORUMLUSU */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #eaecf0",
            borderRadius: "20px",
            padding: "26px",
            marginBottom: "42px",
          }}
        >
          <div
            style={{
              color: "#087cf0",
              fontSize: "12px",
              fontWeight: "800",
              marginBottom: "14px",
            }}
          >
            VERİ SORUMLUSU
          </div>

          <div
            style={{
              display: "grid",
              gap: "10px",
              color: "#475467",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            <div>
              <strong style={{ color: "#101828" }}>Ad Soyad:</strong>{" "}
              Yücel Temurtaş
            </div>

            <div>
              <strong style={{ color: "#101828" }}>Proje / Marka:</strong>{" "}
              DOKUNUVER
            </div>

            <div>
              <strong style={{ color: "#101828" }}>Yer:</strong>{" "}
              Manisa, Türkiye
            </div>

            <div>
              <strong style={{ color: "#101828" }}>E-posta:</strong>{" "}
              <a
                href="mailto:dokunuver@gmail.com"
                style={{
                  color: "#087cf0",
                  textDecoration: "none",
                  fontWeight: "700",
                }}
              >
                dokunuver@gmail.com
              </a>
            </div>
          </div>
        </div>

        <ContentSection title="1. Veri Sorumlusu">
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında,
          DOKUNUVER projesi çerçevesinde gerçekleştirilen kişisel veri
          işleme faaliyetleri bakımından veri sorumlusu Yücel
          Temurtaş&apos;tır.
        </ContentSection>

        <ContentSection title="2. İşlenebilecek Kişisel Veriler">
          DOKUNUVER ile iletişim kurulması, ürün hakkında bilgi alınması
          veya sipariş sürecinin yürütülmesi sırasında tarafınızca
          paylaşılan ad ve soyad, telefon numarası, işletme adı,
          iletişim bilgileri, teslimat bilgileri ve tercih edilen ürüne
          ilişkin bilgiler işlenebilir. Ürünün niteliğine göre Google,
          Instagram, WhatsApp veya ilan bağlantıları ile banka adı,
          hesap sahibi ve IBAN gibi ürünün hazırlanması için gerekli
          bilgiler de işlenebilir.
        </ContentSection>

        <ContentSection title="3. Kişisel Verilerin İşlenme Amaçları">
          Kişisel verileriniz; ürün ve hizmet taleplerinizin alınması,
          tarafınızla iletişim kurulması, siparişin oluşturulması,
          işletmenize özel NFC ve QR bağlantılarının hazırlanması,
          ürünün teslimata hazırlanması, satış ve satış sonrası destek
          süreçlerinin yürütülmesi, teknik sorunların giderilmesi ve
          hukuki yükümlülüklerin yerine getirilmesi amaçlarıyla
          işlenebilir.
        </ContentSection>

        <ContentSection title="4. Kişisel Verilerin Toplanma Yöntemi">
          Kişisel veriler; DOKUNUVER internet sitesi, WhatsApp,
          e-posta, tarafınızca iletilen dijital bağlantılar ve sipariş
          sürecinde kullanılan diğer iletişim kanalları aracılığıyla
          elektronik ortamda toplanabilir. Teslimat sürecinde gerekli
          olması halinde teslimat bilgileri ayrıca tarafınızdan
          alınabilir.
        </ContentSection>

        <ContentSection title="5. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri">
          Kişisel veriler, 6698 sayılı Kanun&apos;un 5. maddesinde
          düzenlenen kişisel veri işleme şartları kapsamında;
          bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya
          ilgili olması, veri sorumlusunun hukuki yükümlülüğünü yerine
          getirebilmesi için zorunlu olması ve ilgili kişinin temel hak
          ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun
          meşru menfaatleri için veri işlenmesinin zorunlu olması gibi
          ilgili işleme faaliyetine uygun hukuki sebeplere dayanılarak
          işlenebilir.
        </ContentSection>

        <ContentSection title="6. Ürün Bağlantıları ve Smart Link Sistemi">
          Google Yorum, Instagram, WhatsApp ve İlan gibi DOKUNUVER
          ürünlerinde tarafınızca verilen hedef bağlantılar ürünün
          çalışabilmesi amacıyla DOKUNUVER sistemlerinde
          ilişkilendirilebilir. Bu ürünlerde fiziksel NFC veya QR
          bağlantısı aynı kalırken hedef bağlantı gerektiğinde
          güncellenebilir.
        </ContentSection>

        <ContentSection title="7. IBAN Ürünlerinde İşlenen Bilgiler">
          IBAN NFC Kartı kapsamında tarafınızca sağlanan banka adı,
          hesap sahibi ve IBAN bilgileri ürünün oluşturulması ve
          ödeme bilgilerinin kullanıcıya gösterilmesi amacıyla
          işlenebilir. IBAN bilgileri kontrol edilip doğrulandıktan
          sonra sistemde kilitlenir ve normal yönetim işlemleriyle
          değiştirilmesi sınırlandırılır.
        </ContentSection>

        <ContentSection title="8. Kişisel Verilerin Aktarılması">
          Kişisel veriler; hizmetin yürütülmesi için gerekli olduğu
          ölçüde internet sitesi barındırma ve veri altyapısı hizmeti
          sağlayıcılarına, iletişim hizmeti sağlayıcılarına, ürünün
          gönderilmesi halinde kargo veya teslimat hizmeti
          sağlayıcılarına ve hukuki bir yükümlülüğün bulunması halinde
          yetkili kamu kurum ve kuruluşlarına ilgili amaçla sınırlı
          olarak aktarılabilir.
        </ContentSection>

        <ContentSection title="9. Üçüncü Taraf Dijital Hizmetler">
          WhatsApp, Google, Instagram ve benzeri üçüncü taraf
          hizmetlere yönlendirme yapılması veya bu hizmetler üzerinden
          iletişim kurulması halinde ilgili hizmet sağlayıcıların kendi
          veri işleme ve gizlilik uygulamaları da geçerli olabilir.
          DOKUNUVER, üçüncü taraf hizmetlerin bağımsız veri işleme
          faaliyetlerinden sorumlu değildir.
        </ContentSection>

        <ContentSection title="10. Yurt Dışı Hizmet Sağlayıcıları">
          İnternet sitesi, iletişim ve teknik altyapıda kullanılan bazı
          hizmet sağlayıcıların sistemlerinin yurt dışında bulunması
          veya kişisel verilerin yurt dışındaki sistemler üzerinden
          işlenmesi söz konusu olabilir. Yurt dışına kişisel veri
          aktarımının gerçekleştiği durumlarda ilgili aktarımın 6698
          sayılı Kanun&apos;un yurt dışına veri aktarımına ilişkin
          hükümlerine uygun şekilde yürütülmesi esas alınır.
        </ContentSection>

        <ContentSection title="11. Kişisel Verilerin Saklanması">
          Kişisel veriler, işlenme amaçlarının gerektirdiği süre ve
          uygulanabilir hukuki yükümlülükler kapsamında gerekli olan
          süre boyunca saklanabilir. Kişisel verilerin işlenmesini
          gerektiren sebeplerin ortadan kalkması halinde ilgili veriler
          mevzuata uygun şekilde silinebilir, yok edilebilir veya anonim
          hale getirilebilir.
        </ContentSection>

        <ContentSection title="12. Veri Güvenliği">
          Kişisel verilerin hukuka aykırı olarak işlenmesini ve
          erişilmesini önlemek, verilerin güvenli şekilde muhafaza
          edilmesini sağlamak ve yetkisiz değişikliklerin önüne geçmek
          amacıyla uygun teknik ve idari tedbirlerin uygulanmasına önem
          verilmektedir.
        </ContentSection>

        <ContentSection title="13. İlgili Kişinin Hakları">
          6698 sayılı Kanun&apos;un 11. maddesi kapsamında kişisel
          verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi
          talep etme, işlenme amacını ve amacına uygun kullanılıp
          kullanılmadığını öğrenme, verilerin aktarıldığı üçüncü
          kişileri bilme, eksik veya yanlış işlenmiş verilerin
          düzeltilmesini isteme, mevzuattaki şartların oluşması halinde
          verilerin silinmesini veya yok edilmesini isteme ve Kanun
          kapsamında tanınan diğer haklarınızı kullanabilirsiniz.
        </ContentSection>

        <ContentSection title="14. Başvuru ve İletişim">
          Kişisel verilerinizin işlenmesine ilişkin bilgi talepleriniz
          ve sorularınız için DOKUNUVER ile iletişime geçebilirsiniz.
          6698 sayılı Kanun kapsamındaki hakların kullanılmasına
          ilişkin resmi başvurular, Kanun&apos;un 13. maddesi ve ilgili
          başvuru usul ve esaslarına uygun şekilde veri sorumlusuna
          iletilmelidir.
        </ContentSection>

        {/* İLETİŞİM KUTUSU */}
        <div
          style={{
            marginTop: "50px",
            background: "#ffffff",
            border: "1px solid #eaecf0",
            borderRadius: "20px",
            padding: "28px",
          }}
        >
          <div
            style={{
              color: "#087cf0",
              fontSize: "12px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            KVKK İLETİŞİM
          </div>

          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "23px",
            }}
          >
            Sorularınız için bize ulaşın.
          </h2>

          <p
            style={{
              margin: "0 0 18px",
              color: "#667085",
              fontSize: "14px",
              lineHeight: "1.7",
            }}
          >
            Kişisel verilerinizin kullanımı veya bu aydınlatma metni
            hakkında bilgi almak için bizimle iletişime
            geçebilirsiniz.
          </p>

          <a
            href="mailto:dokunuver@gmail.com"
            style={{
              display: "inline-block",
              color: "#087cf0",
              fontWeight: "800",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            dokunuver@gmail.com →
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
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/iletisim"
              style={footerLinkStyle}
            >
              İletişim
            </a>

            <a
              href="/gizlilik"
              style={footerLinkStyle}
            >
              Gizlilik
            </a>

            <a
              href="/kvkk"
              style={footerLinkStyle}
            >
              KVKK
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

const footerLinkStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#475467",
  textDecoration: "none",
};

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
