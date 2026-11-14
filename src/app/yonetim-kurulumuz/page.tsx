"use client";

import ContactSection from "@/components/ContactSection";
import { useSiteContent } from "@/context/SiteContentContext";

export default function YonetimKurulumuzPage() {
  const { boardSection } = useSiteContent();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-eyebrow">{boardSection.eyebrow}</div>
          <h1 className="section-h2">
            {boardSection.title} <i>{boardSection.titleHighlight}</i>
          </h1>
          <p className="section-lead">{boardSection.subtitle}</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="media-grid">
            {boardSection.members.map((m) => (
              <div key={m.slug} className="prop-card reveal">
                <div className="prop-img-wrap">
                  <div
                    className="prop-img"
                    style={{
                      backgroundImage: `url(${m.image})`,
                      backgroundPosition: "center top",
                    }}
                  />
                </div>
                <div className="prop-info">
                  <div className="prop-loc">{m.role}</div>
                  <div className="prop-name">{m.name}</div>
                  <div className="prop-desc">{m.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
