"use client";

import { useState, useRef } from "react";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

interface GalleryItem {
  url: string;
  name: string;
  folder: string;
}

export default function ImageField({ label, value, onChange }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükleme başarısız.");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const openGallery = async () => {
    setGalleryOpen(true);
    try {
      const res = await fetch("/api/upload");
      if (res.ok) {
        const data = await res.json();
        setGallery(data.images || []);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="adm-field">
      <label>{label}</label>
      <div className="adm-img-box">
        <div
          className="adm-img-prev"
          style={{ backgroundImage: value ? `url(${value})` : undefined }}
        />
        <div className="adm-img-controls">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/mtsd/... veya /uploads/..."
          />
          <div className="adm-img-btns">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
            />
            <button
              type="button"
              className="adm-btn"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "Yükleniyor..." : "Bilgisayardan Yükle"}
            </button>
            <button type="button" className="adm-btn" onClick={openGallery}>
              Galeriden Seç
            </button>
          </div>
          {error && (
            <span style={{ fontSize: "0.78rem", color: "#9c3b3b" }}>
              {error}
            </span>
          )}
        </div>
      </div>

      {galleryOpen && (
        <div
          className="adm-modal-bg"
          onClick={() => setGalleryOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <strong style={{ fontSize: "0.9rem" }}>Görsel Galerisi</strong>
              <button
                type="button"
                className="adm-btn"
                onClick={() => setGalleryOpen(false)}
              >
                Kapat
              </button>
            </div>
            <div className="adm-modal-grid">
              {gallery.map((g) => (
                <button
                  key={g.url}
                  type="button"
                  className="adm-gal-item"
                  onClick={() => {
                    onChange(g.url);
                    setGalleryOpen(false);
                  }}
                >
                  <div
                    className="adm-gal-thumb"
                    style={{ backgroundImage: `url(${g.url})` }}
                  />
                  <div className="adm-gal-name" title={g.name}>
                    {g.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

