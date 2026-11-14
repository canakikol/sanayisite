"use client";

import ContactSection from "@/components/ContactSection";
import { useSiteContent } from "@/context/SiteContentContext";

export default function IletisimPage() {
  const { brand } = useSiteContent();
  const telHref = `tel:${brand.phone.replace(/\s+/g, "")}`;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-eyebrow">İletişim</div>
          <h1 className="section-h2">
            Bize <i>ulaşın</i>
          </h1>
          <p className="section-lead">
            Dernek üyeliği, 6. Bölge yatırım teşvikleri ve sektörel iş
            birlikleri için ofisimizle iletişime geçebilirsiniz.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
              marginBottom: "4rem",
            }}
          >
            <div className="award-card reveal" style={{ padding: "2rem" }}>
              <div className="section-eyebrow">Telefon</div>
              <div className="award-title" style={{ marginTop: "0.5rem" }}>
                <a
                  href={telHref}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {brand.phone}
                </a>
              </div>
              <div className="award-desc">Dernek İletişim Hattı</div>
            </div>

            <div className="award-card reveal" style={{ padding: "2rem" }}>
              <div className="section-eyebrow">E-posta</div>
              <div
                className="award-title"
                style={{ marginTop: "0.5rem", fontSize: "1.2rem" }}
              >
                <a
                  href={`mailto:${brand.email}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {brand.email}
                </a>
              </div>
              <div className="award-desc">Kurumsal İletişim &amp; Üyelik</div>
            </div>

            <div className="award-card reveal" style={{ padding: "2rem" }}>
              <div className="section-eyebrow">Adres</div>
              <div className="award-title" style={{ marginTop: "0.5rem" }}>
                Artuklu / Mardin
              </div>
              <div className="award-desc">{brand.address}</div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
