"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteContent } from "@/context/SiteContentContext";

const NAV_ITEMS = [
  { label: "Anasayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Yönetim Kurulumuz", href: "/yonetim-kurulumuz" },
  { label: "Haberler", href: "/haberler" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { brand } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin");
  const isLightPage = pathname !== "/";

  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => setScrolled(window.scrollY > 44);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("amwaj-menu-open", menuOpen);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("amwaj-menu-open");
    };
  }, [menuOpen]);

  if (isAdmin) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const telHref = `tel:${brand.phone.replace(/\s+/g, "")}`;

  return (
    <>
      <nav
        id="site-nav"
        className={scrolled || isLightPage ? "scrolled" : undefined}
      >
        <button
          className="nav-burger"
          id="navBurger"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          aria-controls="navMobile"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="ico-burger">
            <svg viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </span>
          <span className="ico-close">
            <svg viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        </button>

        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href) ? "active" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" className="nav-logo">
          <img
            src={brand.logoDark}
            alt={brand.siteTitle}
            className="nav-logo-img"
            style={{ height: "38px", width: "auto" }}
          />
        </Link>

        <div className="nav-right">
          <a className="btn-pill nav-800" href={telHref}>
            {brand.phone}
          </a>
          <Link className="nav-toggle lang-toggle" href="/iletisim">
            <span className="lang-en">{brand.ctaLabel}</span>
          </Link>
        </div>
      </nav>

      <div className={`nav-mobile${menuOpen ? " open" : ""}`} id="navMobile">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <a
          className="btn-pill accent nav-mobile-cta"
          href={telHref}
          onClick={() => setMenuOpen(false)}
        >
          {brand.phone}
        </a>
      </div>
    </>
  );
}
