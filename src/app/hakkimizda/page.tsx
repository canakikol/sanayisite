"use client";

import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import { useSiteContent } from "@/context/SiteContentContext";

export default function HakkimizdaPage() {
  const { aboutPage, aboutSection, missionVision } = useSiteContent();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-eyebrow">{aboutPage.heroEyebrow}</div>
          <h1 className="section-h2">
            {aboutPage.heroTitle} <i>{aboutPage.heroHighlight}</i>
          </h1>
          <p className="section-lead">{aboutPage.heroLead}</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="about-grid">
            <div className="about-visual reveal">
              <div
                className="about-img"
                style={{
                  backgroundImage: `url(${aboutSection.image})`,
                  backgroundPosition: aboutSection.imagePosition || "center top",
                }}
              />
            </div>
            <div className="about-text">
              <div className="section-eyebrow reveal">
                {aboutPage.bodyEyebrow}
              </div>
              <h2 className="section-h2 reveal">
                {aboutPage.bodyTitle} <i>{aboutPage.bodyHighlight}</i>
              </h2>
              <p className="section-lead reveal">{aboutPage.paragraph1}</p>
              <p className="section-lead reveal" style={{ marginTop: "1rem" }}>
                {aboutPage.paragraph2}
              </p>
              <Link
                href="/yonetim-kurulumuz"
                className="btn-pill glass reveal"
                style={{ marginTop: "2rem" }}
              >
                Yönetim Kurulumuz →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "rgba(237, 228, 220, 0.25)" }}>
        <div className="container">
          <div className="featured-head">
            <div className="section-eyebrow reveal">
              {missionVision.eyebrow}
            </div>
            <h2 className="section-h2 reveal">
              {missionVision.title} <i>{missionVision.titleHighlight}</i>
            </h2>
          </div>

          <div className="comm-grid">
            <div className="award-card reveal" style={{ padding: "2.5rem" }}>
              <div className="section-eyebrow">
                01 · {missionVision.mission.title}
              </div>
              <div className="award-title" style={{ fontSize: "1.5rem" }}>
                {missionVision.mission.eyebrow}
              </div>
              <div className="award-desc" style={{ marginTop: "0.75rem" }}>
                {missionVision.mission.description}
              </div>
            </div>

            <div className="award-card reveal" style={{ padding: "2.5rem" }}>
              <div className="section-eyebrow">
                02 · {missionVision.vision.title}
              </div>
              <div className="award-title" style={{ fontSize: "1.5rem" }}>
                {missionVision.vision.eyebrow}
              </div>
              <div className="award-desc" style={{ marginTop: "0.75rem" }}>
                {missionVision.vision.description}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
