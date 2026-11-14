"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ContactSection from "@/components/ContactSection";
import { useSiteContent } from "@/context/SiteContentContext";

export default function HomePage() {
  const router = useRouter();
  const content = useSiteContent();
  const {
    brand,
    hero,
    aboutSection,
    presidentSection,
    boardSection,
    missionVision,
    statsSection,
    membershipSection,
    newsSection,
  } = content;

  return (
    <>
      {/* 1. HERO */}
      <section className="hero" id="home">
        <div
          className="hero-img"
          style={{
            backgroundImage: `url(${hero.image})`,
            backgroundPosition: hero.imagePosition || "center top",
          }}
        />
        <div className="hero-content">
          <h1 className="hero-title">
            {hero.titleLine1}
            <br />
            <span>{hero.titleLine2}</span>
          </h1>
          <p className="hero-sub">{hero.subtitle}</p>
        </div>
        <div className="hero-scroll" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* 2. BİZ KİMİZ (ABOUT) */}
      <section id="about">
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
              <div className="section-eyebrow reveal">{aboutSection.eyebrow}</div>
              <h2 className="section-h2 reveal">
                {aboutSection.titleLine1}
                <br />
                <i>{aboutSection.titleHighlight}</i>
              </h2>
              <p className="section-lead reveal">{aboutSection.description}</p>
              <Link
                href="/hakkimizda"
                className="btn-pill glass reveal"
                style={{ marginTop: "2rem" }}
              >
                {aboutSection.buttonLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BAŞKANIMIZDAN (FEATURED SHOWCASE) */}
      <section className="featured-project" id="baskan">
        <div
          className="fp-img"
          style={{ backgroundImage: `url(${presidentSection.image})` }}
        />
        <div className="fp-panel reveal">
          <div className="fp-eyebrow">{presidentSection.eyebrow}</div>
          <img
            src={brand.logoLight}
            alt={brand.siteTitle}
            className="fp-logo-img"
            style={{ height: "48px", width: "auto" }}
          />
          <div className="fp-loc">{presidentSection.nameAndRole}</div>
          <div className="fp-line" />
          <p className="fp-desc">{presidentSection.message}</p>
          <Link href="/yonetim-kurulumuz" className="btn-pill light">
            {presidentSection.buttonLabel}{" "}
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 4. YÖNETİM KURULUMUZ */}
      <section id="yonetim" className="featured">
        <div className="container">
          <div className="featured-head">
            <div className="section-eyebrow reveal">{boardSection.eyebrow}</div>
            <h2 className="section-h2 reveal">
              {boardSection.title} <i>{boardSection.titleHighlight}</i>
            </h2>
            <p className="section-lead reveal">{boardSection.subtitle}</p>
          </div>

          <div
            className="amwaj-slider is-focus reveal"
            data-slider="always"
            data-focus="1"
          >
            <div className="amwaj-viewport">
              <div className="amwaj-track">
                {boardSection.members.map((m) => (
                  <div className="amwaj-slide" key={m.slug}>
                    <div
                      className="prop-card"
                      onClick={() => router.push("/yonetim-kurulumuz")}
                      role="link"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          router.push("/yonetim-kurulumuz");
                      }}
                    >
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
                  </div>
                ))}

                <div className="amwaj-slide">
                  <Link href="/yonetim-kurulumuz" className="prop-card is-all">
                    <div className="prop-all-inner">
                      <span className="prop-all-arrow">→</span>
                      <div className="prop-all-title">
                        Tüm Yönetim Kurulunu İncele
                      </div>
                      <div className="prop-all-desc">
                        Derneğimizin kurumsal yönetim kadrosu ve görev dağılımı.
                      </div>
                      <span className="btn-pill glass">
                        Yönetim Kurulumuz
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="amwaj-nav">
              <button
                type="button"
                className="amwaj-arrow amwaj-prev"
                aria-label="Önceki"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <div className="amwaj-dots" />
              <button
                type="button"
                className="amwaj-arrow amwaj-next"
                aria-label="Sonraki"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MİSYON & VİZYON */}
      <section id="misyon" className="communities-sec">
        <div className="container">
          <div className="featured-head">
            <div className="section-eyebrow reveal">
              {missionVision.eyebrow}
            </div>
            <h2 className="section-h2 reveal">
              {missionVision.title} <i>{missionVision.titleHighlight}</i>
            </h2>
            <p className="section-lead reveal">{missionVision.subtitle}</p>
          </div>

          <div className="comm-grid">
            <Link
              className="comm-card reveal"
              href="/hakkimizda"
              aria-label={missionVision.mission.title}
            >
              <div
                className="comm-img"
                style={{
                  backgroundImage: `url(${missionVision.mission.image})`,
                  backgroundPosition:
                    missionVision.mission.imagePosition || "center top",
                }}
              />
              <div className="comm-overlay" />
              <div className="comm-body">
                <div className="comm-loc">{missionVision.mission.eyebrow}</div>
                <div className="comm-name">{missionVision.mission.title}</div>
                <div className="comm-meta">
                  <div className="comm-count" style={{ maxWidth: "72%" }}>
                    {missionVision.mission.description}
                  </div>
                  <span className="comm-go" style={{ flexShrink: 0 }}>
                    Detaylı Bilgi{" "}
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            <Link
              className="comm-card reveal"
              href="/hakkimizda"
              aria-label={missionVision.vision.title}
            >
              <div
                className="comm-img"
                style={{
                  backgroundImage: `url(${missionVision.vision.image})`,
                  backgroundPosition:
                    missionVision.vision.imagePosition || "center center",
                }}
              />
              <div className="comm-overlay" />
              <div className="comm-body">
                <div className="comm-loc">{missionVision.vision.eyebrow}</div>
                <div className="comm-name">{missionVision.vision.title}</div>
                <div className="comm-meta">
                  <div className="comm-count" style={{ maxWidth: "72%" }}>
                    {missionVision.vision.description}
                  </div>
                  <span className="comm-go" style={{ flexShrink: 0 }}>
                    Detaylı Bilgi{" "}
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. RAKAMLARLA SEKTÖRÜMÜZ */}
      <section id="awards">
        <div className="container">
          <div className="awards-head">
            <div className="section-eyebrow reveal">{statsSection.eyebrow}</div>
            <h2 className="section-h2 reveal">
              {statsSection.title} <i>{statsSection.titleHighlight}</i>
            </h2>
          </div>

          <div
            className="amwaj-slider is-mobile-only reveal"
            data-slider="mobile"
          >
            <div className="amwaj-viewport">
              <div className="amwaj-track">
                {statsSection.items.map((s, idx) => (
                  <div className="amwaj-slide" key={idx}>
                    <div className="award-card">
                      <div className="award-title">{s.title}</div>
                      <div className="award-desc">{s.desc}</div>
                      <div className="award-year">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="amwaj-nav">
              <button
                type="button"
                className="amwaj-arrow amwaj-prev"
                aria-label="Önceki"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <div className="amwaj-dots" />
              <button
                type="button"
                className="amwaj-arrow amwaj-next"
                aria-label="Sonraki"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ÜYELİK BAŞVURU SÜRECİ */}
      <section className="waves" id="uyelik">
        <div className="wave-lines" aria-hidden="true">
          <svg
            viewBox="0 0 1800 620"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="wl-drift">
              <path d="M-100,120 C150,40 350,200 600,120 S1050,40 1300,120 S1750,200 1900,120" />
              <path d="M-100,190 C150,110 350,270 600,190 S1050,110 1300,190 S1750,270 1900,190" />
              <path d="M-100,260 C150,180 350,340 600,260 S1050,180 1300,260 S1750,340 1900,260" />
            </g>
            <g className="wl-drift-2">
              <path d="M-100,360 C200,270 400,450 700,360 S1150,270 1400,360 S1800,450 1900,360" />
              <path d="M-100,430 C200,340 400,520 700,430 S1150,340 1400,430 S1800,520 1900,430" />
              <path d="M-100,500 C200,410 400,590 700,500 S1150,410 1400,500 S1800,590 1900,500" />
            </g>
          </svg>
        </div>

        <div className="container">
          <div className="waves-head">
            <div className="section-eyebrow reveal">
              {membershipSection.eyebrow}
            </div>
            <h2 className="section-h2 reveal">
              {membershipSection.title}{" "}
              <i>{membershipSection.titleHighlight}</i>
            </h2>
          </div>

          <div
            className="amwaj-slider is-per-3 reveal"
            data-slider="always"
            data-waves="1"
            data-loop="1"
          >
            <div className="amwaj-viewport">
              <div className="amwaj-track">
                {membershipSection.steps.map((st, idx) => (
                  <div className="amwaj-slide" key={idx}>
                    <div className="wave-card">
                      <div
                        className="wave-img"
                        style={{ backgroundImage: `url(${st.image})` }}
                      />
                      <div className="wave-body">
                        <div className="section-eyebrow">{st.step}</div>
                        <div className="wave-title">{st.title}</div>
                        <div className="wave-desc">{st.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="amwaj-nav">
              <button
                type="button"
                className="amwaj-arrow amwaj-prev"
                aria-label="Önceki"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <div className="amwaj-dots" />
              <button
                type="button"
                className="amwaj-arrow amwaj-next"
                aria-label="Sonraki"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MTSD BLOG & BİLGİLENDİRME */}
      <section id="media">
        <div className="container">
          <div className="media-head">
            <div className="reveal">
              <div className="section-eyebrow">{newsSection.eyebrow}</div>
              <h2 className="section-h2">
                {newsSection.title} <i>{newsSection.titleHighlight}</i>
              </h2>
            </div>
            <Link className="btn-pill glass reveal" href="/haberler">
              Tüm Yazılar →
            </Link>
          </div>

          <div className="media-grid">
            {newsSection.articles.map((m) => (
              <div
                key={m.slug}
                className="media-card reveal"
                onClick={() => router.push("/haberler")}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push("/haberler");
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

      {/* 9. CONTACT */}
      <ContactSection />
    </>
  );
}
