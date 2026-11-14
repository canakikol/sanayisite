"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { ContactSubmission, SiteContent } from "@/types/content";
import ImageField from "./ImageField";
import "@/styles/admin.css";

type TabKey =
  | "brand"
  | "hero"
  | "about"
  | "board"
  | "mission"
  | "stats"
  | "news"
  | "pages"
  | "submissions";

const TABS: { key: TabKey; label: string }[] = [
  { key: "brand", label: "Genel & Marka" },
  { key: "hero", label: "Hero (Ana Sayfa Üst)" },
  { key: "about", label: "Biz Kimiz & Başkan" },
  { key: "board", label: "Yönetim Kurulu" },
  { key: "mission", label: "Misyon & Vizyon" },
  { key: "stats", label: "Rakamlar & Üyelik" },
  { key: "news", label: "Haberler & Duyurular" },
  { key: "pages", label: "Hakkımızda & İletişim" },
  { key: "submissions", label: "Gelen Başvurular" },
];

export default function AdminDashboard({
  initialAuthenticated,
  initialContent,
}: {
  initialAuthenticated: boolean;
  initialContent: SiteContent;
}) {
  const [authed, setAuthed] = useState(initialAuthenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<TabKey>("brand");
  const [data, setData] = useState<SiteContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(
    null
  );
  const [dirty, setDirty] = useState(false);

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  const updateData = (updater: (prev: SiteContent) => SiteContent) => {
    setData((prev) => updater(prev));
    setDirty(true);
  };

  useEffect(() => {
    if (!authed) return;
    fetch("/api/submissions")
      .then((r) => (r.ok ? r.json() : { submissions: [] }))
      .then((d) => setSubmissions(d.submissions || []))
      .catch(() => {});
  }, [authed]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginErr("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLoginErr(json.error || "Giriş başarısız.");
        return;
      }
      setAuthed(true);
    } catch {
      setLoginErr("Bağlantı hatası.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kaydedilemedi.");
      setDirty(false);
      setToast({ msg: "Tüm değişiklikler kaydedildi." });
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      setToast({
        msg: err instanceof Error ? err.message : "Hata oluştu.",
        err: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSubmissionRead = async (id: string, read: boolean) => {
    await fetch("/api/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read } : s))
    );
  };

  const deleteSubmission = async (id: string) => {
    await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  if (!authed) {
    return (
      <div className="adm-login-wrap">
        <form className="adm-login-card" onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <img
              src={data.brand.logoDark}
              alt="MTSD"
              style={{ height: "42px", width: "auto", marginBottom: "0.75rem" }}
            />
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.65rem",
                fontWeight: 400,
                margin: 0,
              }}
            >
              Yönetim Paneli
            </h1>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#8b7f73",
                marginTop: "0.35rem",
              }}
            >
              İçerik ve görselleri düzenlemek için giriş yapın
            </p>
          </div>

          <div className="adm-field">
            <label htmlFor="adm_user">Kullanıcı Adı</label>
            <input
              id="adm_user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div className="adm-field">
            <label htmlFor="adm_pass">Şifre</label>
            <input
              id="adm_pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {loginErr && (
            <p
              style={{
                color: "#9c3b3b",
                fontSize: "0.84rem",
                marginBottom: "1rem",
              }}
            >
              {loginErr}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="adm-btn primary"
            style={{ width: "100%", padding: "0.8rem" }}
          >
            {loggingIn ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          <div
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.76rem",
              color: "#8b7f73",
            }}
          >
            Varsayılan giriş: <code>admin</code> / <code>mtsd2026</code>
          </div>
        </form>
      </div>
    );
  }

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <img src={data.brand.logoDark} alt="MTSD" />
          <span>CMS</span>
        </div>

        <div className="adm-nav" role="navigation" aria-label="Admin Menü">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`adm-nav-btn${tab === t.key ? " is-active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <span>{t.label}</span>
              {t.key === "submissions" && unreadCount > 0 && (
                <span className="adm-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="adm-sidebar-foot">
          <Link href="/" target="_blank" className="adm-btn">
            Siteyi Görüntüle ↗
          </Link>
          <button
            type="button"
            className="adm-btn danger"
            onClick={handleLogout}
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <h1>{TABS.find((t) => t.key === tab)?.label}</h1>
          <div className="adm-topbar-actions">
            {toast && (
              <span className={`adm-toast${toast.err ? " err" : ""}`}>
                {toast.msg}
              </span>
            )}
            {dirty && !toast && (
              <span style={{ fontSize: "0.8rem", color: "#8b7565" }}>
                Kaydedilmemiş değişiklikler var
              </span>
            )}
            <button
              type="button"
              className="adm-btn primary"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </header>

        <div className="adm-body">
          {/* 1. BRAND */}
          {tab === "brand" && (
            <>
              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">Site Kimliği &amp; Logolar</h2>
                </div>
                <div className="adm-field">
                  <label>Site Başlığı (Tarayıcı Sekmesi)</label>
                  <input
                    type="text"
                    value={data.brand.siteTitle}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        brand: { ...p.brand, siteTitle: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="adm-field">
                  <label>Site Meta Açıklaması</label>
                  <textarea
                    value={data.brand.siteDescription}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        brand: { ...p.brand, siteDescription: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="adm-grid">
                  <ImageField
                    label="Ana Logo (Koyu / Navbar & Footer)"
                    value={data.brand.logoDark}
                    onChange={(url) =>
                      updateData((p) => ({
                        ...p,
                        brand: { ...p.brand, logoDark: url },
                      }))
                    }
                  />
                  <ImageField
                    label="Açık Logo (Başkan Mesajı Kartı)"
                    value={data.brand.logoLight}
                    onChange={(url) =>
                      updateData((p) => ({
                        ...p,
                        brand: { ...p.brand, logoLight: url },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">İletişim &amp; Footer</h2>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Telefon</label>
                    <input
                      type="text"
                      value={data.brand.phone}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          brand: { ...p.brand, phone: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>E-posta</label>
                    <input
                      type="text"
                      value={data.brand.email}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          brand: { ...p.brand, email: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Üst Menü Sağ Buton Metni</label>
                    <input
                      type="text"
                      value={data.brand.ctaLabel}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          brand: { ...p.brand, ctaLabel: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Telif Hakkı Metni</label>
                    <input
                      type="text"
                      value={data.brand.copyright}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          brand: { ...p.brand, copyright: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Adres</label>
                  <input
                    type="text"
                    value={data.brand.address}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        brand: { ...p.brand, address: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="adm-field">
                  <label>Footer Açıklama Metni</label>
                  <textarea
                    value={data.brand.footerDesc}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        brand: { ...p.brand, footerDesc: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* 2. HERO */}
          {tab === "hero" && (
            <div className="adm-card">
              <div className="adm-card-head">
                <h2 className="adm-card-title">Ana Sayfa Hero Bölümü</h2>
              </div>
              <div className="adm-grid">
                <div className="adm-field">
                  <label>Başlık 1. Satır</label>
                  <input
                    type="text"
                    value={data.hero.titleLine1}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        hero: { ...p.hero, titleLine1: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="adm-field">
                  <label>Başlık 2. Satır (Vurgulu)</label>
                  <input
                    type="text"
                    value={data.hero.titleLine2}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        hero: { ...p.hero, titleLine2: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="adm-field">
                <label>Alt Açıklama</label>
                <textarea
                  value={data.hero.subtitle}
                  onChange={(e) =>
                    updateData((p) => ({
                      ...p,
                      hero: { ...p.hero, subtitle: e.target.value },
                    }))
                  }
                />
              </div>
              <ImageField
                label="Hero Arka Plan Fotoğrafı"
                value={data.hero.image}
                onChange={(url) =>
                  updateData((p) => ({
                    ...p,
                    hero: { ...p.hero, image: url },
                  }))
                }
              />
              <div className="adm-field">
                <label>Fotoğraf Konumu</label>
                <select
                  value={data.hero.imagePosition}
                  onChange={(e) =>
                    updateData((p) => ({
                      ...p,
                      hero: { ...p.hero, imagePosition: e.target.value },
                    }))
                  }
                >
                  <option value="center top">Üstten Hizalı (center top)</option>
                  <option value="center center">Ortalı (center center)</option>
                  <option value="center bottom">Alttan Hizalı (center bottom)</option>
                </select>
              </div>
            </div>
          )}

          {/* 3. BİZ KİMİZ & BAŞKAN */}
          {tab === "about" && (
            <>
              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">Biz Kimiz Bölümü</h2>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Üst Etiket</label>
                    <input
                      type="text"
                      value={data.aboutSection.eyebrow}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          aboutSection: {
                            ...p.aboutSection,
                            eyebrow: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Buton Metni</label>
                    <input
                      type="text"
                      value={data.aboutSection.buttonLabel}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          aboutSection: {
                            ...p.aboutSection,
                            buttonLabel: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={data.aboutSection.titleLine1}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          aboutSection: {
                            ...p.aboutSection,
                            titleLine1: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Başlık (Vurgulu İtalik)</label>
                    <input
                      type="text"
                      value={data.aboutSection.titleHighlight}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          aboutSection: {
                            ...p.aboutSection,
                            titleHighlight: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Açıklama Metni</label>
                  <textarea
                    value={data.aboutSection.description}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        aboutSection: {
                          ...p.aboutSection,
                          description: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <ImageField
                  label="Sol Görsel"
                  value={data.aboutSection.image}
                  onChange={(url) =>
                    updateData((p) => ({
                      ...p,
                      aboutSection: { ...p.aboutSection, image: url },
                    }))
                  }
                />
              </div>

              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">Başkanımızdan Bölümü</h2>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Üst Etiket</label>
                    <input
                      type="text"
                      value={data.presidentSection.eyebrow}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          presidentSection: {
                            ...p.presidentSection,
                            eyebrow: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Başkan Adı &amp; Unvanı</label>
                    <input
                      type="text"
                      value={data.presidentSection.nameAndRole}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          presidentSection: {
                            ...p.presidentSection,
                            nameAndRole: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Başkanın Mesajı</label>
                  <textarea
                    value={data.presidentSection.message}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        presidentSection: {
                          ...p.presidentSection,
                          message: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="adm-field">
                  <label>Buton Metni</label>
                  <input
                    type="text"
                    value={data.presidentSection.buttonLabel}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        presidentSection: {
                          ...p.presidentSection,
                          buttonLabel: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <ImageField
                  label="Arka Plan Görseli"
                  value={data.presidentSection.image}
                  onChange={(url) =>
                    updateData((p) => ({
                      ...p,
                      presidentSection: { ...p.presidentSection, image: url },
                    }))
                  }
                />
              </div>
            </>
          )}

          {/* 4. YÖNETİM KURULU */}
          {tab === "board" && (
            <>
              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">Bölüm Başlıkları</h2>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Üst Etiket</label>
                    <input
                      type="text"
                      value={data.boardSection.eyebrow}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          boardSection: {
                            ...p.boardSection,
                            eyebrow: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={data.boardSection.title}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          boardSection: {
                            ...p.boardSection,
                            title: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Vurgulu Kelime</label>
                    <input
                      type="text"
                      value={data.boardSection.titleHighlight}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          boardSection: {
                            ...p.boardSection,
                            titleHighlight: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Alt Açıklama</label>
                    <input
                      type="text"
                      value={data.boardSection.subtitle}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          boardSection: {
                            ...p.boardSection,
                            subtitle: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">
                    Üyeler ({data.boardSection.members.length})
                  </h2>
                  <button
                    type="button"
                    className="adm-btn accent"
                    onClick={() =>
                      updateData((p) => ({
                        ...p,
                        boardSection: {
                          ...p.boardSection,
                          members: [
                            ...p.boardSection.members,
                            {
                              slug: `uye-${Date.now()}`,
                              name: "Yeni Üye",
                              role: "Yönetim Kurulu Üyesi",
                              bio: "",
                              image: "/mtsd/board-1.jpeg",
                            },
                          ],
                        },
                      }))
                    }
                  >
                    + Yeni Üye Ekle
                  </button>
                </div>

                {data.boardSection.members.map((m, idx) => (
                  <div className="adm-list-item" key={m.slug + idx}>
                    <div className="adm-list-head">
                      <span className="adm-list-title">
                        {idx + 1}. {m.name}
                      </span>
                      <button
                        type="button"
                        className="adm-btn danger"
                        onClick={() =>
                          updateData((p) => ({
                            ...p,
                            boardSection: {
                              ...p.boardSection,
                              members: p.boardSection.members.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }
                      >
                        Sil
                      </button>
                    </div>
                    <div className="adm-grid">
                      <div className="adm-field">
                        <label>Ad Soyad</label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              boardSection: {
                                ...p.boardSection,
                                members: p.boardSection.members.map((x, i) =>
                                  i === idx ? { ...x, name: e.target.value } : x
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="adm-field">
                        <label>Görev / Unvan</label>
                        <input
                          type="text"
                          value={m.role}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              boardSection: {
                                ...p.boardSection,
                                members: p.boardSection.members.map((x, i) =>
                                  i === idx ? { ...x, role: e.target.value } : x
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="adm-field">
                      <label>Kısa Biyografi</label>
                      <textarea
                        value={m.bio}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            boardSection: {
                              ...p.boardSection,
                              members: p.boardSection.members.map((x, i) =>
                                i === idx ? { ...x, bio: e.target.value } : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <ImageField
                      label="Üye Fotoğrafı"
                      value={m.image}
                      onChange={(url) =>
                        updateData((p) => ({
                          ...p,
                          boardSection: {
                            ...p.boardSection,
                            members: p.boardSection.members.map((x, i) =>
                              i === idx ? { ...x, image: url } : x
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 5. MİSYON & VİZYON */}
          {tab === "mission" && (
            <>
              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">Bölüm Başlığı</h2>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Üst Etiket</label>
                    <input
                      type="text"
                      value={data.missionVision.eyebrow}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          missionVision: {
                            ...p.missionVision,
                            eyebrow: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={data.missionVision.title}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          missionVision: {
                            ...p.missionVision,
                            title: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Vurgulu Kelime</label>
                    <input
                      type="text"
                      value={data.missionVision.titleHighlight}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          missionVision: {
                            ...p.missionVision,
                            titleHighlight: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Alt Açıklama</label>
                    <input
                      type="text"
                      value={data.missionVision.subtitle}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          missionVision: {
                            ...p.missionVision,
                            subtitle: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {(["mission", "vision"] as const).map((key) => {
                const item = data.missionVision[key];
                return (
                  <div className="adm-card" key={key}>
                    <div className="adm-card-head">
                      <h2 className="adm-card-title">
                        {key === "mission" ? "Misyonumuz Kartı" : "Vizyonumuz Kartı"}
                      </h2>
                    </div>
                    <div className="adm-grid">
                      <div className="adm-field">
                        <label>Üst Etiket</label>
                        <input
                          type="text"
                          value={item.eyebrow}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              missionVision: {
                                ...p.missionVision,
                                [key]: { ...item, eyebrow: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="adm-field">
                        <label>Kart Başlığı</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              missionVision: {
                                ...p.missionVision,
                                [key]: { ...item, title: e.target.value },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="adm-field">
                      <label>Açıklama</label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            missionVision: {
                              ...p.missionVision,
                              [key]: { ...item, description: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <ImageField
                      label="Kart Fotoğrafı"
                      value={item.image}
                      onChange={(url) =>
                        updateData((p) => ({
                          ...p,
                          missionVision: {
                            ...p.missionVision,
                            [key]: { ...item, image: url },
                          },
                        }))
                      }
                    />
                  </div>
                );
              })}
            </>
          )}

          {/* 6. RAKAMLAR & ÜYELİK */}
          {tab === "stats" && (
            <>
              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">Rakamlarla Sektörümüz</h2>
                  <button
                    type="button"
                    className="adm-btn accent"
                    onClick={() =>
                      updateData((p) => ({
                        ...p,
                        statsSection: {
                          ...p.statsSection,
                          items: [
                            ...p.statsSection.items,
                            { title: "Yeni Başlık", desc: "", value: "100+" },
                          ],
                        },
                      }))
                    }
                  >
                    + Kalem Ekle
                  </button>
                </div>
                {data.statsSection.items.map((st, idx) => (
                  <div className="adm-list-item" key={idx}>
                    <div className="adm-list-head">
                      <span className="adm-list-title">{st.title}</span>
                      <button
                        type="button"
                        className="adm-btn danger"
                        onClick={() =>
                          updateData((p) => ({
                            ...p,
                            statsSection: {
                              ...p.statsSection,
                              items: p.statsSection.items.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }
                      >
                        Sil
                      </button>
                    </div>
                    <div className="adm-grid">
                      <div className="adm-field">
                        <label>Başlık</label>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              statsSection: {
                                ...p.statsSection,
                                items: p.statsSection.items.map((x, i) =>
                                  i === idx ? { ...x, title: e.target.value } : x
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="adm-field">
                        <label>Değer / Vurgu</label>
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              statsSection: {
                                ...p.statsSection,
                                items: p.statsSection.items.map((x, i) =>
                                  i === idx ? { ...x, value: e.target.value } : x
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="adm-field">
                      <label>Açıklama</label>
                      <input
                        type="text"
                        value={st.desc}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            statsSection: {
                              ...p.statsSection,
                              items: p.statsSection.items.map((x, i) =>
                                i === idx ? { ...x, desc: e.target.value } : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">Üyelik Başvuru Adımları</h2>
                  <button
                    type="button"
                    className="adm-btn accent"
                    onClick={() =>
                      updateData((p) => ({
                        ...p,
                        membershipSection: {
                          ...p.membershipSection,
                          steps: [
                            ...p.membershipSection.steps,
                            {
                              step: `0${p.membershipSection.steps.length + 1}`,
                              title: "Yeni Adım",
                              desc: "",
                              image: "/mtsd/mardin-hero.webp",
                            },
                          ],
                        },
                      }))
                    }
                  >
                    + Adım Ekle
                  </button>
                </div>

                {data.membershipSection.steps.map((st, idx) => (
                  <div className="adm-list-item" key={idx}>
                    <div className="adm-list-head">
                      <span className="adm-list-title">
                        {st.step} — {st.title}
                      </span>
                      <button
                        type="button"
                        className="adm-btn danger"
                        onClick={() =>
                          updateData((p) => ({
                            ...p,
                            membershipSection: {
                              ...p.membershipSection,
                              steps: p.membershipSection.steps.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }
                      >
                        Sil
                      </button>
                    </div>
                    <div className="adm-grid">
                      <div className="adm-field">
                        <label>Adım No</label>
                        <input
                          type="text"
                          value={st.step}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              membershipSection: {
                                ...p.membershipSection,
                                steps: p.membershipSection.steps.map((x, i) =>
                                  i === idx ? { ...x, step: e.target.value } : x
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="adm-field">
                        <label>Başlık</label>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) =>
                            updateData((p) => ({
                              ...p,
                              membershipSection: {
                                ...p.membershipSection,
                                steps: p.membershipSection.steps.map((x, i) =>
                                  i === idx ? { ...x, title: e.target.value } : x
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="adm-field">
                      <label>Açıklama</label>
                      <textarea
                        value={st.desc}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            membershipSection: {
                              ...p.membershipSection,
                              steps: p.membershipSection.steps.map((x, i) =>
                                i === idx ? { ...x, desc: e.target.value } : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <ImageField
                      label="Adım Fotoğrafı"
                      value={st.image}
                      onChange={(url) =>
                        updateData((p) => ({
                          ...p,
                          membershipSection: {
                            ...p.membershipSection,
                            steps: p.membershipSection.steps.map((x, i) =>
                              i === idx ? { ...x, image: url } : x
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 7. HABERLER */}
          {tab === "news" && (
            <div className="adm-card">
              <div className="adm-card-head">
                <h2 className="adm-card-title">
                  Haberler &amp; Duyurular ({data.newsSection.articles.length})
                </h2>
                <button
                  type="button"
                  className="adm-btn accent"
                  onClick={() =>
                    updateData((p) => ({
                      ...p,
                      newsSection: {
                        ...p.newsSection,
                        articles: [
                          {
                            slug: `haber-${Date.now()}`,
                            title: "Yeni Haber Başlığı",
                            excerpt: "Kısa özet metni...",
                            content: "Haberin tam metni...",
                            category: "Genel",
                            date: "15 Kasım 2026",
                            image: "/mtsd/news-ramazan.jpg",
                          },
                          ...p.newsSection.articles,
                        ],
                      },
                    }))
                  }
                >
                  + Yeni Haber Ekle
                </button>
              </div>

              {data.newsSection.articles.map((art, idx) => (
                <div className="adm-list-item" key={art.slug + idx}>
                  <div className="adm-list-head">
                    <span className="adm-list-title">{art.title}</span>
                    <button
                      type="button"
                      className="adm-btn danger"
                      onClick={() =>
                        updateData((p) => ({
                          ...p,
                          newsSection: {
                            ...p.newsSection,
                            articles: p.newsSection.articles.filter(
                              (_, i) => i !== idx
                            ),
                          },
                        }))
                      }
                    >
                      Haberi Sil
                    </button>
                  </div>
                  <div className="adm-field">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={art.title}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          newsSection: {
                            ...p.newsSection,
                            articles: p.newsSection.articles.map((x, i) =>
                              i === idx ? { ...x, title: e.target.value } : x
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-grid">
                    <div className="adm-field">
                      <label>Tarih</label>
                      <input
                        type="text"
                        value={art.date}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            newsSection: {
                              ...p.newsSection,
                              articles: p.newsSection.articles.map((x, i) =>
                                i === idx ? { ...x, date: e.target.value } : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="adm-field">
                      <label>Kategori</label>
                      <input
                        type="text"
                        value={art.category}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            newsSection: {
                              ...p.newsSection,
                              articles: p.newsSection.articles.map((x, i) =>
                                i === idx
                                  ? { ...x, category: e.target.value }
                                  : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="adm-field">
                    <label>Kısa Özet</label>
                    <textarea
                      value={art.excerpt}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          newsSection: {
                            ...p.newsSection,
                            articles: p.newsSection.articles.map((x, i) =>
                              i === idx ? { ...x, excerpt: e.target.value } : x
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Detaylı İçerik</label>
                    <textarea
                      value={art.content}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          newsSection: {
                            ...p.newsSection,
                            articles: p.newsSection.articles.map((x, i) =>
                              i === idx ? { ...x, content: e.target.value } : x
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                  <ImageField
                    label="Kapak Fotoğrafı"
                    value={art.image}
                    onChange={(url) =>
                      updateData((p) => ({
                        ...p,
                        newsSection: {
                          ...p.newsSection,
                          articles: p.newsSection.articles.map((x, i) =>
                            i === idx ? { ...x, image: url } : x
                          ),
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* 8. HAKKIMIZDA & İLETİŞİM */}
          {tab === "pages" && (
            <>
              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">Hakkımızda Sayfası</h2>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Üst Başlık</label>
                    <input
                      type="text"
                      value={data.aboutPage.heroTitle}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          aboutPage: {
                            ...p.aboutPage,
                            heroTitle: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Vurgulu Kelime</label>
                    <input
                      type="text"
                      value={data.aboutPage.heroHighlight}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          aboutPage: {
                            ...p.aboutPage,
                            heroHighlight: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Giriş Açıklaması</label>
                  <textarea
                    value={data.aboutPage.heroLead}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        aboutPage: {
                          ...p.aboutPage,
                          heroLead: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="adm-field">
                  <label>1. Paragraf</label>
                  <textarea
                    value={data.aboutPage.paragraph1}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        aboutPage: {
                          ...p.aboutPage,
                          paragraph1: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="adm-field">
                  <label>2. Paragraf</label>
                  <textarea
                    value={data.aboutPage.paragraph2}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        aboutPage: {
                          ...p.aboutPage,
                          paragraph2: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="adm-card">
                <div className="adm-card-head">
                  <h2 className="adm-card-title">İletişim Formu Bölümü</h2>
                </div>
                <div className="adm-grid">
                  <div className="adm-field">
                    <label>Üst Etiket</label>
                    <input
                      type="text"
                      value={data.contactSection.eyebrow}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          contactSection: {
                            ...p.contactSection,
                            eyebrow: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="adm-field">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={data.contactSection.title}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          contactSection: {
                            ...p.contactSection,
                            title: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Alt Açıklama</label>
                  <textarea
                    value={data.contactSection.subtitle}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        contactSection: {
                          ...p.contactSection,
                          subtitle: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="adm-field">
                  <label>Form Konu Seçenekleri (Her satıra bir konu)</label>
                  <textarea
                    value={data.contactSection.topics.join("\n")}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        contactSection: {
                          ...p.contactSection,
                          topics: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      }))
                    }
                  />
                </div>
                <ImageField
                  label="İletişim Bölümü Arka Plan Görseli"
                  value={data.contactSection.image}
                  onChange={(url) =>
                    updateData((p) => ({
                      ...p,
                      contactSection: { ...p.contactSection, image: url },
                    }))
                  }
                />
              </div>
            </>
          )}

          {/* 9. GELEN BAŞVURULAR */}
          {tab === "submissions" && (
            <div className="adm-card">
              <div className="adm-card-head">
                <h2 className="adm-card-title">
                  Gelen İletişim &amp; Üyelik Başvuruları ({submissions.length})
                </h2>
              </div>

              {submissions.length === 0 ? (
                <p style={{ color: "#8b7f73", fontSize: "0.9rem" }}>
                  Henüz form üzerinden gönderilmiş bir başvuru bulunmuyor.
                </p>
              ) : (
                submissions.map((s) => (
                  <div
                    className="adm-list-item"
                    key={s.id}
                    style={{
                      borderColor: s.read
                        ? "rgba(170,145,128,0.2)"
                        : "#aa9180",
                      background: s.read ? "#fcfbfa" : "#fff",
                    }}
                  >
                    <div className="adm-list-head">
                      <div>
                        <span className="adm-list-title">{s.name}</span>
                        {!s.read && (
                          <span
                            className="adm-badge"
                            style={{ marginLeft: "0.5rem" }}
                          >
                            Yeni
                          </span>
                        )}
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "#8b7f73",
                            marginTop: "0.2rem",
                          }}
                        >
                          {new Date(s.createdAt).toLocaleString("tr-TR")} ·{" "}
                          {s.inquiry || "Genel"}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          className="adm-btn"
                          onClick={() => toggleSubmissionRead(s.id, !s.read)}
                        >
                          {s.read ? "Okunmadı İşaretle" : "Okundu İşaretle"}
                        </button>
                        <button
                          type="button"
                          className="adm-btn danger"
                          onClick={() => deleteSubmission(s.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "0.86rem",
                        color: "#5c5249",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <strong>Telefon:</strong> {s.phone || "—"} ·{" "}
                      <strong>E-posta:</strong> {s.email}
                    </div>
                    {s.message && (
                      <p
                        style={{
                          fontSize: "0.88rem",
                          color: "#2a2520",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {s.message}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

