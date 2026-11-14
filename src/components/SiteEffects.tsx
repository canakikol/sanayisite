"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSiteContent } from "@/context/SiteContentContext";

export default function SiteEffects() {
  const pathname = usePathname();
  const { brand } = useSiteContent();
  const isAdmin = pathname.startsWith("/admin");
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    if (isAdmin) return;
    const timer = setTimeout(() => {
      setLoaderDone(true);
    }, 650);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    // Scroll reveal observer
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    els.forEach((el) => el.classList.remove("is-visible"));

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const staggerIndex = (el: HTMLElement) => {
      const parent = el.parentElement;
      if (!parent) return 0;
      const sibs = Array.from(parent.children).filter(
        (c) => c.classList && c.classList.contains("reveal")
      );
      const i = sibs.indexOf(el);
      return i < 0 ? 0 : i;
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Math.min(staggerIndex(el), 6) * 150;
            setTimeout(() => {
              el.classList.add("is-visible");
            }, delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => obs.observe(el));

    // Sliders
    const cleanups: (() => void)[] = [];
    const sliders = Array.from(
      document.querySelectorAll<HTMLElement>(".amwaj-slider")
    );

    sliders.forEach((root) => {
      const track = root.querySelector<HTMLElement>(".amwaj-track");
      const viewport = root.querySelector<HTMLElement>(".amwaj-viewport");
      if (!track || !viewport) return;

      const mode = root.dataset.slider || "always";
      const isFocus = root.dataset.focus === "1";
      const isWaves = root.dataset.waves === "1";
      const prevBtn = root.querySelector<HTMLButtonElement>(".amwaj-prev");
      const nextBtn = root.querySelector<HTMLButtonElement>(".amwaj-next");
      const dotsWrap = root.querySelector<HTMLElement>(".amwaj-dots");

      const slides = Array.from(
        track.querySelectorAll<HTMLElement>(":scope > .amwaj-slide")
      );
      const count = slides.length;
      if (count === 0) return;

      let index = 0;

      const getPerView = () => {
        const w = window.innerWidth;
        if (mode === "mobile") return w <= 768 ? 1 : count;
        if (isFocus) return w <= 768 ? 1 : w <= 1160 ? 2 : 3;
        if (isWaves) return w <= 768 ? 1 : w <= 1024 ? 2 : 3;
        return 1;
      };

      const isActive = () => {
        if (mode === "mobile") return window.innerWidth <= 768;
        return true;
      };

      const maxIdx = () => Math.max(0, count - getPerView());

      const buildDots = () => {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = "";
        const total = maxIdx() + 1;
        for (let i = 0; i < total; i++) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "amwaj-dot" + (i === index ? " is-active" : "");
          b.setAttribute("aria-label", `Slide ${i + 1}`);
          b.addEventListener("click", () => go(i));
          dotsWrap.appendChild(b);
        }
      };

      const paint = () => {
        if (!isActive()) {
          track.style.transform = "";
          slides.forEach((s) => s.classList.remove("is-center", "is-active"));
          return;
        }
        const offset = slides[index]
          ? slides[index].offsetLeft - slides[0].offsetLeft
          : 0;
        track.style.transform = `translate3d(-${offset}px, 0, 0)`;

        if (isFocus) {
          slides.forEach((s, i) => {
            s.classList.toggle("is-center", i === index);
            s.classList.toggle("is-active", i === index);
          });
        }

        if (dotsWrap) {
          Array.from(dotsWrap.children).forEach((d, i) => {
            d.classList.toggle("is-active", i === index);
          });
        }
        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= maxIdx();
      };

      const go = (n: number) => {
        const m = maxIdx();
        index = Math.max(0, Math.min(m, n));
        paint();
      };

      const onPrev = () => go(index - 1);
      const onNext = () => go(index + 1);
      const onResize = () => {
        index = Math.min(index, maxIdx());
        buildDots();
        paint();
      };

      let startX = 0;
      let dragging = false;
      const onTouchStart = (e: TouchEvent) => {
        startX = e.touches[0].clientX;
        dragging = true;
      };
      const onTouchEnd = (e: TouchEvent) => {
        if (!dragging) return;
        dragging = false;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
          go(dx < 0 ? index + 1 : index - 1);
        }
      };

      prevBtn?.addEventListener("click", onPrev);
      nextBtn?.addEventListener("click", onNext);
      viewport.addEventListener("touchstart", onTouchStart, { passive: true });
      viewport.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("resize", onResize);

      buildDots();
      paint();

      cleanups.push(() => {
        prevBtn?.removeEventListener("click", onPrev);
        nextBtn?.removeEventListener("click", onNext);
        viewport.removeEventListener("touchstart", onTouchStart);
        viewport.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("resize", onResize);
      });
    });

    return () => {
      obs.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <>
      {!loaderDone && (
        <div
          className="amwaj-loader"
          id="amwajLoader"
          role="status"
          aria-label="Loading"
        >
          <img
            src={brand.logoDark}
            alt={brand.siteTitle}
            className="amwaj-loader-logo"
          />
          <div className="amwaj-loader-bar">
            <span />
          </div>
        </div>
      )}
      <div className="ambient" aria-hidden="true" />
    </>
  );
}

