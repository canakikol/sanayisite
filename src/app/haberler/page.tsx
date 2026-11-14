"use client";

import { useState } from "react";
import ContactSection from "@/components/ContactSection";
import { useSiteContent } from "@/context/SiteContentContext";

export default function HaberlerPage() {
  const { newsSection } = useSiteContent();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = newsSection.articles.find((a) => a.slug === selectedSlug);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-eyebrow">{newsSection.eyebrow}</div>
          <h1 className="section-h2">
            {newsSection.title} <i>{newsSection.titleHighlight}</i>
          </h1>
          <p className="section-lead">
            Derneğimizin sektörel ziyaretleri, sosyal sorumluluk projeleri ve
            güncel duyuruları.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          {selected && (
            <div
              className="award-card"
              style={{ padding: "2.5rem", marginBottom: "3rem" }}
            >
              <div className="section-eyebrow">
                {selected.date} · {selected.category}
              </div>
              <h2
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "2rem",
                  margin: "0.75rem 0 1rem",
                }}
              >
                {selected.title}
              </h2>
              <p style={{ color: "var(--ink-2)", lineHeight: 1.8 }}>
                {selected.content}
              </p>
              <button
                type="button"
                className="btn-pill glass"
                style={{ marginTop: "1.5rem" }}
                onClick={() => setSelectedSlug(null)}
              >
                ← Tüm Haberlere Dön
              </button>
            </div>
          )}

          <div className="media-grid">
            {newsSection.articles.map((m) => (
              <div
                key={m.slug}
                className="media-card reveal is-visible"
                onClick={() => setSelectedSlug(m.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedSlug(m.slug);
                }}
              >
                <div
                  className="media-img"
                  style={{ backgroundImage: `url(${m.image})` }}
                />
                <div className="media-body">
                  <div
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--accent-dk)",
                      fontWeight: 600,
                      marginBottom: "0.45rem",
                    }}
                  >
                    {m.date} · {m.category}
                  </div>
                  <div className="media-title">{m.title}</div>
                  <div className="media-excerpt">{m.excerpt}</div>
                  <span className="media-link">Devamını Oku</span>
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
