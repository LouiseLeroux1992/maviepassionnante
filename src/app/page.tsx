"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type Strip = {
  no: string;
  slug: string;
  title: string;
  panels: number;
  ext: string;
};

const STRIPS: Strip[] = [
  { no: "11", slug: "voyage-au-japon", title: "Voyage au Japon", panels: 10, ext: "png" },
  { no: "10", slug: "mon-nouveau-metier", title: "Mon nouveau métier", panels: 10, ext: "jpg" },
  { no: "09", slug: "la-vie-a-paris", title: "La vie à Paris", panels: 10, ext: "jpg" },
  { no: "08", slug: "reconversion", title: "Reconversion", panels: 10, ext: "webp" },
  { no: "07", slug: "les-effectifs", title: "Les effectifs", panels: 9, ext: "webp" },
  { no: "06", slug: "demenagement-3", title: "Déménagement express : 3/3", panels: 8, ext: "jpg" },
  { no: "05", slug: "demenagement-2", title: "Déménagement express : 2/3", panels: 8, ext: "jpg" },
  { no: "04", slug: "demenagement-1", title: "Déménagement express : 1/3", panels: 6, ext: "jpg" },
  { no: "03", slug: "le-reveil", title: "Le réveil", panels: 6, ext: "jpg" },
  { no: "02", slug: "les-apparences", title: "Les apparences", panels: 6, ext: "jpg" },
  { no: "01", slug: "infirmiere-en-labo", title: "Infirmière en laboratoire", panels: 10, ext: "jpg" },
];

function panelSrc(strip: Strip, panel: number): string {
  return `/bd/${strip.slug}/${panel}.${strip.ext}`;
}

import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [reading, setReading] = useState<number | null>(null);
  const searchParams = useSearchParams();

  const closeReader = useCallback(() => {
    setReading(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("read");
    window.history.replaceState({}, "", url.pathname);
  }, []);

  const openStrip = useCallback((index: number) => {
    setReading(index);
    const url = new URL(window.location.href);
    url.searchParams.set("read", STRIPS[index].slug);
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => {
    const slug = searchParams.get("read");
    if (slug) {
      const index = STRIPS.findIndex((s) => s.slug === slug);
      if (index !== -1) {
        setReading(index);
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Archive onSelect={openStrip} />
        <InstaSection />
      </main>
      <SiteFooter />
      {reading !== null && (
        <WebtoonReader
          strip={STRIPS[reading]}
          onClose={closeReader}
          onPrev={reading > 0 ? () => openStrip(reading - 1) : null}
          onNext={reading < STRIPS.length - 1 ? () => openStrip(reading + 1) : null}
        />
      )}
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b-[3px] border-ink px-5 md:px-8 py-4 md:py-5 flex items-end justify-between bg-paper">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[32px] md:text-[38px] leading-[0.85] tracking-[-0.02em] text-ink">
          MVP
        </span>
        <span className="font-serif italic text-sm text-mute hidden md:inline">
          Ma Vie Passionnante
        </span>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://instagram.com/louise.maviepassionnante"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] tracking-[0.14em] uppercase text-mute hover:text-ink transition-colors no-underline"
        >
          Instagram
        </a>
        <a
          href="https://lerouxlouise.fr"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] tracking-[0.14em] uppercase text-mute hover:text-ink transition-colors no-underline"
        >
          Portfolio
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-5 md:px-8 pt-8 md:pt-14 pb-7 md:pb-9 flex flex-col md:grid md:grid-cols-[1fr_280px] gap-6 md:gap-8 bg-paper border-b border-ink">
      <div className="flex flex-col gap-7">
        <h1 className="m-0 flex flex-col leading-[0.84]">
          <span
            className="font-serif italic font-normal tracking-[-0.04em] text-dark"
            style={{ fontSize: "clamp(60px, 14vw, 180px)" }}
          >
            Ma Vie
          </span>
          <span
            className="font-display uppercase text-primary"
            style={{
              fontSize: "clamp(60px, 14vw, 180px)",
              marginTop: "-0.08em",
              marginLeft: "5%",
              WebkitTextStroke: "1.5px var(--c-ink)",
            }}
          >
            PASSIONNANTE
          </span>
        </h1>
        <p className="font-serif text-[17px] md:text-2xl leading-[1.35] max-w-[720px] m-0 text-ink border-l-[3px] md:border-l-4 border-dark pl-3 md:pl-[18px]">
          Bande dessinée autobiographique et humoristique par Louise Leroux.
        </p>
      </div>
      <div className="flex flex-col gap-4 self-start">
        <Image
          src="/bd/profilepic.jpg"
          alt="Ma Vie Passionnante"
          width={280}
          height={280}
          className="w-full h-auto border-2 border-ink"
          style={{ aspectRatio: "1/1", objectFit: "cover" }}
        />
        <div className="border-[1.5px] md:border-2 border-ink p-4 md:p-5 bg-cream flex flex-col gap-2 text-ink">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[36px] md:text-[48px] leading-[0.88] text-dark">{STRIPS.length}</span>
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase">strips</span>
          </div>
          <div className="w-full h-[1.5px] bg-ink opacity-20" />
          <div className="font-mono text-[11px] tracking-[0.12em] mt-1">
            @louise.maviepassionnante
          </div>
        </div>
      </div>
    </section>
  );
}

function Archive({ onSelect }: { onSelect: (i: number) => void }) {
  return (
    <section className="px-5 md:px-8 pt-8 md:pt-14 pb-8 md:pb-14 bg-paper border-b border-ink">
      <header className="flex flex-col gap-2 md:gap-2.5 mb-5 md:mb-9">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute">
          Tous les strips
        </span>
        <h2 className="font-serif font-medium text-[clamp(36px,5vw,64px)] leading-[0.98] m-0 text-ink">
          Onze strips, <em className="italic font-normal">une vie passionnante.</em>
        </h2>
      </header>
      <ol className="list-none p-0 m-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-5 md:gap-y-7">
        {STRIPS.map((s, i) => (
          <li key={s.no}>
            <button
              className="bg-transparent border-none p-0 text-left cursor-pointer flex flex-col gap-2 text-ink transition-transform hover:translate-y-[-3px] w-full group"
              onClick={() => onSelect(i)}
            >
              <div className="relative">
                <Image
                  src={panelSrc(s, 1)}
                  alt={s.title}
                  width={300}
                  height={300}
                  className="w-full h-auto border-[1.5px] border-ink group-hover:shadow-[4px_4px_0_var(--c-primary)] transition-shadow"
                  style={{ aspectRatio: "1/1", objectFit: "cover" }}
                />
                <span className="absolute bottom-0 left-0 right-0 bg-ink/70 text-cream font-mono text-[10px] tracking-[0.12em] uppercase px-2 py-1.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Lire →
                </span>
              </div>
              <div className="flex gap-2.5 items-baseline font-mono text-[10px] tracking-[0.16em] uppercase mt-1">
                <span className="text-dark font-bold">{s.no}</span>
              </div>
              <div className="font-serif italic text-lg md:text-[22px] leading-[1.1] text-ink">
                {s.title}
              </div>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function InstaSection() {
  return (
    <section className="px-5 md:px-8 pt-10 md:pt-16 pb-10 md:pb-16 bg-sage border-b border-ink flex flex-col md:grid md:grid-cols-[1fr_420px] gap-6 md:gap-12 md:items-center">
      <div className="flex flex-col gap-3.5">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-dark">
          Suivre la suite
        </span>
        <h2 className="font-serif font-medium text-[clamp(36px,5vw,72px)] leading-[0.98] m-0 text-ink">
          <em className="italic font-normal text-dark">Retrouvez</em>
          <br />toutes les planches
          <br />sur Instagram.
        </h2>
      </div>
      <a
        className="flex flex-col gap-[18px] no-underline text-ink bg-paper border-2 border-ink p-7 transition-all hover:bg-cream hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[5px_5px_0_var(--c-ink)]"
        href="https://instagram.com/louise.maviepassionnante"
        target="_blank"
        rel="noreferrer"
      >
        <span className="font-display text-[26px] tracking-[0.02em] uppercase">
          @louise.maviepassionnante
        </span>
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-dark pt-3.5 border-t border-ink">
          Aller sur Instagram →
        </span>
      </a>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-ink px-5 md:px-8 py-4 md:py-5 flex flex-col md:flex-row md:justify-between gap-1 md:gap-6 font-mono text-[9.5px] md:text-[10px] tracking-[0.14em] uppercase text-mute">
      <div>
        <strong className="text-ink font-semibold">MA VIE PASSIONNANTE</strong> · par Louise Leroux
      </div>
      <a href="https://lerouxlouise.fr" className="text-ink no-underline hover:text-dark">
        lerouxlouise.fr
      </a>
    </footer>
  );
}

function WebtoonReader({ strip, onClose, onPrev, onNext }: {
  strip: Strip;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const prevSlugRef = React.useRef(strip.slug);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, []);

  const handleNav = useCallback((fn: (() => void) | null) => {
    if (fn) { setLoading(true); scrollToTop(); fn(); }
  }, [scrollToTop]);

  const handlePrev = useCallback(() => handleNav(onPrev), [handleNav, onPrev]);
  const handleNext = useCallback(() => handleNav(onNext), [handleNav, onNext]);

  useEffect(() => {
    if (prevSlugRef.current !== strip.slug) {
      prevSlugRef.current = strip.slug;
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [strip.slug]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") { onClose(); } };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", handleKey); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper">
      <div className="sticky top-0 z-[52] flex items-center justify-between px-5 md:px-8 py-3 md:py-4 border-b border-ink bg-paper">
        <div className="flex items-center gap-2 md:gap-4">
          {onPrev ? (
            <button className="bg-transparent border border-ink text-ink w-9 h-9 md:w-10 md:h-10 flex items-center justify-center cursor-pointer hover:bg-fog transition-colors text-base md:text-lg font-sans" onClick={handlePrev}>←</button>
          ) : <div className="w-9 h-9 md:w-10 md:h-10" />}
          <div className="flex items-center gap-2 md:gap-4">
            <span className="font-display text-ink text-base md:text-xl tracking-[0.04em] uppercase">Nº {strip.no}</span>
            <span className="font-serif italic text-dark text-sm md:text-lg">{strip.title}</span>
            <span className="hidden md:inline font-mono text-[10px] tracking-[0.14em] uppercase text-mute">{strip.panels} cases</span>
          </div>
          {onNext ? (
            <button className="bg-transparent border border-ink text-ink w-9 h-9 md:w-10 md:h-10 flex items-center justify-center cursor-pointer hover:bg-fog transition-colors text-base md:text-lg font-sans" onClick={handleNext}>→</button>
          ) : <div className="w-9 h-9 md:w-10 md:h-10" />}
        </div>
        <button className="bg-ink text-cream border-none w-9 h-9 md:w-10 md:h-10 flex items-center justify-center cursor-pointer hover:bg-dark transition-colors text-lg" onClick={onClose}>✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="max-w-[600px] mx-auto px-4 md:px-0 py-6 md:py-10 flex flex-col gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full bg-fog animate-pulse" style={{ aspectRatio: "1/1" }}>
                <div className="h-full flex items-center justify-center">
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute/50">{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-[600px] mx-auto px-4 md:px-0 py-6 md:py-10 flex flex-col gap-6">
            {Array.from({ length: strip.panels }).map((_, i) => (
              <Image key={i} src={panelSrc(strip, i + 1)} alt={`${strip.title} — case ${i + 1}`} width={1200} height={1200} className="w-full h-auto" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="max-w-[600px] mx-auto px-4 md:px-0 pb-10 flex flex-col items-center gap-6">
            <div className="w-full border-t border-ink pt-6 flex flex-col items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute">FIN</span>
              <span className="font-serif italic text-lg text-dark">{strip.title}</span>
            </div>
            <div className="w-full flex items-center justify-between gap-4">
              {onPrev ? (
                <button className="flex items-center gap-2 bg-transparent border border-ink text-ink px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase cursor-pointer hover:bg-fog transition-colors" onClick={handlePrev}>
                  <span className="font-sans text-lg">←</span><span className="hidden md:inline">Strip précédent</span>
                </button>
              ) : <div />}
              <button className="bg-ink text-cream border-none px-5 py-2.5 font-display text-sm tracking-[0.12em] uppercase cursor-pointer hover:bg-dark transition-colors" onClick={onClose}>Retour</button>
              {onNext ? (
                <button className="flex items-center gap-2 bg-transparent border border-ink text-ink px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase cursor-pointer hover:bg-fog transition-colors" onClick={handleNext}>
                  <span className="hidden md:inline">Strip suivant</span><span className="font-sans text-lg">→</span>
                </button>
              ) : <div />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
