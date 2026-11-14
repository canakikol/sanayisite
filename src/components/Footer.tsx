"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Footer() {
  const pathname = usePathname();
  const { brand } = useSiteContent();

  if (pathname.startsWith("/admin")) return null;

  const telHref = `tel:${brand.phone.replace(/\s+/g, "")}`;

  return (
    <footer>
      <div className="foot">
        <div className="foot-brand">
          <img
            src={brand.logoDark}
            alt={brand.siteTitle}
            className="foot-logo-img"
            style={{ height: "44px", width: "auto" }}
          />
          <p>{brand.footerDesc}</p>
        </div>

        <div className="foot-col">
          <h4>Menü</h4>
          <ul>
            <li>
              <Link href="/">Anasayfa</Link>
            </li>
            <li>
              <Link href="/hakkimizda">Hakkımızda</Link>
            </li>
            <li>
              <Link href="/#baskan">Başkanımızdan</Link>
            </li>
            <li>
              <Link href="/yonetim-kurulumuz">Yönetim Kurulu</Link>
            </li>
            <li>
              <Link href="/haberler">Haberler</Link>
            </li>
            <li>
              <Link href="/iletisim">İletişim</Link>
            </li>
          </ul>
        </div>

        <div className="foot-col">
          <h4>Kurumsal</h4>
          <ul>
            <li>
              <Link href="/#uyelik">Üyelik Başvuru Süreci</Link>
            </li>
            <li>
              <Link href="/#misyon">Misyon &amp; Vizyon</Link>
            </li>
            <li>
              <Link href="/hakkimizda">6. Bölge Teşvikleri</Link>
            </li>
            <li>
              <Link href="/admin">Yönetim Paneli</Link>
            </li>
          </ul>
        </div>

        <div className="foot-col">
          <h4>İletişim</h4>
          <ul>
            <li>
              <a href={telHref}>{brand.phone}</a>
            </li>
            <li>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
            <li>
              <span>{brand.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="foot-bottom">
        <p>{brand.copyright}</p>
        <div className="foot-socials">
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/yonetim-kurulumuz">Yönetim Kurulu</Link>
          <Link href="/iletisim">İletişim</Link>
        </div>
      </div>
    </footer>
  );
}
