"use client";

import { useState, FormEvent } from "react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function ContactSection() {
  const { contactSection, brand } = useSiteContent();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setSubmitted(false);
      setStatus("Lütfen ad soyad ve e-posta alanlarını eksiksiz doldurun.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, inquiry, message }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setStatus(
        "Başvurunuz başarıyla alındı. Dernek yetkililerimiz en kısa sürede sizinle iletişime geçecektir."
      );
      setName("");
      setPhone("");
      setEmail("");
      setInquiry("");
      setMessage("");
    } catch {
      setSubmitted(false);
      setStatus("Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-wrap" id="contact">
      <div
        className="contact-img"
        style={{ backgroundImage: `url(${contactSection.image})` }}
      />
      <div className="contact-layout">
        <div className="contact-text reveal">
          <div className="section-eyebrow">{contactSection.eyebrow}</div>
          <h2>
            {contactSection.title} <i>{contactSection.titleHighlight}</i>
          </h2>
          <p>{contactSection.subtitle}</p>
        </div>

        <div className="contact-panel reveal">
          <form className="contact-form amwaj-form" onSubmit={handleSubmit} noValidate>
            <div className="f-field">
              <label htmlFor="amf_name">Ad Soyad / Firma Adı</label>
              <input
                type="text"
                id="amf_name"
                name="name"
                placeholder="Adınız ve soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div className="f-row">
              <div className="f-field">
                <label htmlFor="amf_phone">Telefon</label>
                <input
                  type="tel"
                  id="amf_phone"
                  name="phone"
                  placeholder={brand.phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="f-field">
                <label htmlFor="amf_email">E-posta</label>
                <input
                  type="email"
                  id="amf_email"
                  name="email"
                  placeholder={brand.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="f-field">
              <label htmlFor="amf_inquiry">Başvuru Konusu</label>
              <div className="f-select">
                <select
                  id="amf_inquiry"
                  name="inquiry"
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                >
                  <option value="">Konu seçiniz</option>
                  {contactSection.topics.map((topic, idx) => (
                    <option key={idx} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="f-field">
              <label htmlFor="amf_message">Mesajınız</label>
              <textarea
                id="amf_message"
                name="message"
                placeholder="Talebiniz veya sorunuz hakkında kısa bilgi yazabilirsiniz"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-pill accent"
              style={{
                padding: "1rem 2rem",
                alignSelf: "flex-start",
                marginTop: "0.4rem",
              }}
            >
              {submitting ? "Gönderiliyor..." : "Gönder"}{" "}
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
            </button>

            {status && (
              <div
                className={`amwaj-form-status${submitted ? " is-ok" : " is-err"}`}
                role="status"
                aria-live="polite"
                style={{
                  fontSize: "0.85rem",
                  color: submitted ? "var(--ink)" : "#9c3b3b",
                  marginTop: "0.25rem",
                }}
              >
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
