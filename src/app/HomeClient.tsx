"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useContent } from "@/context/ContentContext";

export default function HomeClient() {
  const { content } = useContent();
  const [activeBottom, setActiveBottom] = useState("#top");
  const [modalData, setModalData] = useState<{ img: string; title: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [tplStart, setTplStart] = useState(0);

  const coreRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLElement | null>(null);
  const procRef = useRef<HTMLDivElement | null>(null);

  // Parallax on hero mousemove
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!coreRef.current) return;
    const x = ((e.clientX / window.innerWidth) - 0.5) * 18;
    const y = ((e.clientY / window.innerHeight) - 0.5) * 18;
    coreRef.current.style.translate = `${x}px ${y}px`;
  };

  // Tilt on service cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--mx", `${x * 100}%`);
    c.style.setProperty("--my", `${y * 100}%`);
    c.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  };

  // Scroll effect for progress bar & nav
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement;
      const bar = document.getElementById("bar");
      const nav = document.getElementById("nav");
      if (bar) {
        bar.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`;
      }
      if (nav) {
        nav.classList.toggle("s", h.scrollTop > 10);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for reveals, counters & proc timeline
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            if (e.target === statsRef.current) {
              content.stats.forEach((stat, i) => {
                const targetNum = stat.value;
                const t0 = performance.now();
                const animate = (t: number) => {
                  const p = Math.min((t - t0) / 1600, 1);
                  const current = Math.round(targetNum * (1 - Math.pow(1 - p, 3)));
                  setCounts((prev) => {
                    const next = [...prev];
                    next[i] = current;
                    return next;
                  });
                  if (p < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
              });
            }
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const rvs = document.querySelectorAll(".rv");
    rvs.forEach((el) => io.observe(el));
    if (procRef.current) io.observe(procRef.current);
    if (statsRef.current) io.observe(statsRef.current);

    return () => io.disconnect();
  }, [content.stats]);

  const modalBodyRef = useRef<HTMLDivElement | null>(null);

  // Handle mock click for mobile modal preview
  const handleMockClick = (img: string, title: string) => {
    if (window.innerWidth <= 980) {
      setModalData({ img, title });
      document.body.style.overflow = "hidden";
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTop = 0;
      }
    }
  };

  const closeModal = () => {
    setModalData(null);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalData) closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalData]);

  return (
    <>
      <div id="bar"></div>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <symbol id="i-plane" viewBox="0 0 24 24">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.2.4c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </symbol>
          <symbol id="i-chat" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </symbol>
          <symbol id="i-wa" viewBox="0 0 24 24">
            <path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </symbol>
          <symbol id="i-home" viewBox="0 0 24 24">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </symbol>
          <symbol id="i-grid" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </symbol>
          <symbol id="i-camera" viewBox="0 0 24 24">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </symbol>
          <symbol id="i-ig" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </symbol>
          <symbol id="i-pin" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </symbol>
          <symbol id="i-cal" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </symbol>
          <symbol id="i-mail" viewBox="0 0 24 24">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 6L2 7" />
          </symbol>
          <symbol id="i-card" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <path d="M1 10h22" />
          </symbol>
          <symbol id="i-star" viewBox="0 0 24 24">
            <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z" />
          </symbol>
          <symbol id="i-globe" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
          </symbol>
          <symbol id="i-bolt" viewBox="0 0 24 24">
            <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
          </symbol>
          <symbol id="i-code" viewBox="0 0 24 24">
            <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
          </symbol>
          <symbol id="i-bag" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
          </symbol>
          <symbol id="i-bld" viewBox="0 0 24 24">
            <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 13v.01M9 17v.01" />
          </symbol>
          <symbol id="i-ok" viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5" />
          </symbol>
          <symbol id="i-up" viewBox="0 0 24 24">
            <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />
          </symbol>
        </defs>
      </svg>

      {/* Nav */}
      <nav id="nav">
        <div className="wrap">
          <a href="#top" className="logo">
            <Image
              src={content.brand.logo}
              alt={`${content.brand.primaryText}${content.brand.secondaryText}`}
              width={32}
              height={32}
              style={{ height: "32px", width: "auto", display: "block" }}
              priority
            />
            <span className="logo-label">
              <span className="p">{content.brand.primaryText}</span>
              <span className="s">{content.brand.secondaryText}</span>
            </span>
          </a>
          <ul>
            {content.nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a
            className="btn sm wa"
            href={content.brand.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.nav.ctaLabel}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="top" onMouseMove={handleHeroMouseMove}>
        <i className="blob b1"></i>
        <i className="blob b2"></i>
        <i className="blob b3"></i>
        <div className="wrap">
          <div>
            <span className="badge load" style={{ "--n": 0 } as React.CSSProperties}>
              <b>{content.hero.badgeTag}</b> {content.hero.badgeText}
            </span>
            <h1 className="load" style={{ "--n": 1 } as React.CSSProperties}>
              {content.hero.title}
            </h1>
            <p className="lead load" style={{ "--n": 2 } as React.CSSProperties}>
              {content.hero.lead}
            </p>
            <div className="cta load" style={{ "--n": 3 } as React.CSSProperties}>
              <a
                className="btn wa pulse"
                href={content.brand.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="i">
                  <use href="#i-wa" />
                </svg>
                {content.hero.primaryCta}
              </a>
              <a className="btn ghost" href="#contoh">
                {content.hero.secondaryCta}
              </a>
            </div>
            <div className="trust load" style={{ "--n": 4 } as React.CSSProperties}>
              {content.hero.trustItems.map((item) => (
                <span key={item}>
                  <svg className="i">
                    <use href="#i-ok" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Orbit stage */}
          <div className="sw load" style={{ "--n": 2 } as React.CSSProperties}>
            <div className="stage" id="stage">
              <i className="ring r1"></i>
              <i className="ring r2"></i>
              <i className="rip"></i>
              <i className="rip"></i>

              {/* Orbit 1 */}
              <div className="orb" id="o1" style={{ "--d": "36s" } as React.CSSProperties}>
                {content.hero.orbit1.map((item, n) => {
                  const a = (n * 360) / content.hero.orbit1.length;
                  return (
                    <div
                      key={item.icon}
                      className="ic"
                      style={{ "--a": `${a}deg`, "--r": "165px" } as React.CSSProperties}
                    >
                      <div className="up" style={{ "--a": `${a}deg` } as React.CSSProperties}>
                        <div
                          className="cnt"
                          style={{ "--d": "36s" } as React.CSSProperties}
                        >
                          <div
                            className="tile"
                            style={{ "--c": item.color } as React.CSSProperties}
                          >
                            <svg className="i">
                              <use href={`#i-${item.icon}`} />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Orbit 2 */}
              <div className="orb rev" id="o2" style={{ "--d": "58s" } as React.CSSProperties}>
                {content.hero.orbit2.map((item, n) => {
                  const a = (n * 360) / content.hero.orbit2.length;
                  return (
                    <div
                      key={item.icon}
                      className="ic"
                      style={{ "--a": `${a}deg`, "--r": "250px" } as React.CSSProperties}
                    >
                      <div className="up" style={{ "--a": `${a}deg` } as React.CSSProperties}>
                        <div
                          className="cnt"
                          style={{ "--d": "58s" } as React.CSSProperties}
                        >
                          <div
                            className="tile"
                            style={{ "--c": item.color } as React.CSSProperties}
                          >
                            <svg className="i">
                              <use href={`#i-${item.icon}`} />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Core card */}
              <div className="core" id="core" ref={coreRef}>
                <div className="bar">
                  <b></b>
                  <b></b>
                  <b></b>
                  <span>{content.hero.coreDomain}</span>
                </div>
                <div className="scene">
                  <i className="sunb"></i>
                  <svg className="i plane">
                    <use href="#i-plane" />
                  </svg>
                </div>
                <div className="bd">
                  <div className="ln"></div>
                  <div className="ln" style={{ width: "70%" }}></div>
                  <span className="pill">{content.hero.corePill}</span>
                </div>
              </div>

              {/* Chips */}
              {content.hero.chips.map((chip) => (
                <div key={chip.text} className={`chip ${chip.className}`}>
                  <svg className="i">
                    <use href={`#${chip.icon}`} />
                  </svg>
                  {chip.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Services */}
      <section id="layanan">
        <div className="wrap">
          <div className="hd rv">
            <h2>{content.services.title}</h2>
            <p>{content.services.subtitle}</p>
          </div>
          <div className="grid4">
            {content.services.items.map((item, idx) => (
              <article
                key={item.title}
                className="card rv"
                data-tilt
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={
                  {
                    "--c": item.color,
                    "--d": idx,
                  } as React.CSSProperties
                }
              >
                <div className="ico">
                  <svg className="i">
                    <use href={`#${item.icon}`} />
                  </svg>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="alt" style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div className="hd rv" style={{ margin: "0 auto 36px", textAlign: "center" }}>
            <h2>{content.marquee.title}</h2>
            <p>{content.marquee.subtitle}</p>
          </div>
        </div>
        <div className="mq rv" aria-hidden="true">
          <div id="mq">
            {[
              ...content.marquee.row1,
              ...content.marquee.row1,
              ...content.marquee.row1,
              ...content.marquee.row1,
            ].map((text, idx) => (
              <span key={`${text}-${idx}`}>{text}</span>
            ))}
          </div>
          <div id="mq2" className="back">
            {[
              ...content.marquee.row2,
              ...content.marquee.row2,
              ...content.marquee.row2,
              ...content.marquee.row2,
            ].map((text, idx) => (
              <span key={`${text}-${idx}`}>{text}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats" ref={statsRef}>
        <div className="wrap">
          {content.stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="rv"
              style={{ "--d": idx } as React.CSSProperties}
            >
              <b>
                {counts[idx]}
                {stat.suffix}
              </b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="contoh">
        <div className="wrap">
          <div className="hd rv">
            <h2>{content.templates.title}</h2>
            <p>{content.templates.subtitle}</p>
          </div>

          {(() => {
            const perPage = content.templates.perPage;
            const total = content.templates.items.length;
            // Build circular visible array: 3 consecutive items starting at tplStart
            const visible = Array.from({ length: perPage }, (_, i) =>
              content.templates.items[(tplStart + i) % total]
            );

            return (
              <>
                <div className="tpl">
                  {visible.map((tpl, idx) => (
                    <figure
                      key={`${tplStart}-${idx}`}
                      className="mock rv in"
                      style={{ "--c": tpl.color, "--d": idx } as React.CSSProperties}
                      onClick={() => handleMockClick(tpl.img, tpl.domain)}
                    >
                      <div className="bar">
                        <div className="bar-dots"><b></b><b></b><b></b></div>
                        <span>{tpl.domain}</span>
                      </div>
                      <div className="view">
                        <Image
                          src={tpl.img}
                          alt={tpl.title}
                          width={1200}
                          height={4000}
                          loading="lazy"
                        />
                      </div>
                      <figcaption>
                        <h3>{tpl.title}</h3>
                        <p>{tpl.desc}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <div className="tpl-nav">
                  <button
                    type="button"
                    className="btn ghost tpl-btn"
                    onClick={() => setTplStart((prev) => (prev - 1 + total) % total)}
                    aria-label="Sebelumnya"
                  >
                    ← Sebelumnya
                  </button>

                  <div className="tpl-dots">
                    {Array.from({ length: total }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`tpl-dot ${i === tplStart ? "active" : ""}`}
                        onClick={() => setTplStart(i)}
                        aria-label={`Contoh ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn ghost tpl-btn"
                    onClick={() => setTplStart((prev) => (prev + 1) % total)}
                    aria-label="Berikutnya"
                  >
                    Berikutnya →
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Process */}
      <section className="alt" id="proses">
        <div className="wrap">
          <div className="hd rv">
            <h2>{content.process.title}</h2>
            <p>{content.process.subtitle}</p>
          </div>
          <div className="proc" id="proc" ref={procRef}>
            {content.process.steps.map((step) => (
              <div key={step.num} className="step">
                <i>{step.num}</i>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="paket">
        <div className="wrap">
          <div className="hd rv">
            <h2>{content.pricing.title}</h2>
            <p>{content.pricing.subtitle}</p>
          </div>
          <div className="price">
            {content.pricing.plans.map((plan, idx) => (
              <div
                key={plan.name}
                className={`plan rv ${plan.popular ? "pop" : ""}`}
                style={{ "--d": idx } as React.CSSProperties}
              >
                {plan.popular && <span className="tag">{plan.popularBadge}</span>}
                <h3>{plan.name}</h3>
                <div className="p">{plan.price}</div>
                <small>{plan.period}</small>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <svg className="i">
                        <use href="#i-ok" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  className={`btn ${plan.popular ? "" : "ghost"}`}
                  href={content.brand.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {plan.buttonLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="alt" id="faq">
        <div className="wrap">
          <div className="hd rv" style={{ marginInline: "auto", textAlign: "center" }}>
            <h2>{content.faq.title}</h2>
          </div>
          <div className="faq rv">
            {content.faq.items.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className={`q ${isOpen ? "o" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    {item.q}
                  </button>
                  <div className="a">
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "80px 0 40px" }}>
        <div className="end rv">
          <h2>{content.cta.title}</h2>
          <p>{content.cta.subtitle}</p>
          <a
            className="btn wa pulse"
            href={content.brand.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="i">
              <use href="#i-wa" />
            </svg>
            {content.cta.buttonLabel}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div className="f-col f-brand">
              <a href="#top" className="logo">
                <Image
                  src={content.brand.logo}
                  alt={`${content.brand.primaryText}${content.brand.secondaryText}`}
                  width={32}
                  height={32}
                  style={{ height: "32px", width: "auto", display: "block" }}
                  loading="lazy"
                />
                <span className="logo-label">
                  <span className="p">{content.brand.primaryText}</span>
                  <span className="s">{content.brand.secondaryText}</span>
                </span>
              </a>
              <p className="f-desc">{content.brand.description}</p>
            </div>

            <div className="f-col">
              <h4>{content.footer.quickLinksTitle}</h4>
              <ul className="f-links">
                {content.nav.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="f-col">
              <h4>{content.footer.servicesTitle}</h4>
              <ul className="f-links">
                {content.services.items.map((svc) => (
                  <li key={svc.title}>
                    <a href="#layanan">{svc.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="f-col">
              <h4>{content.footer.contactTitle}</h4>
              <p className="f-address">{content.footer.address}</p>
              <p className="f-hours">{content.footer.hours}</p>
              <div className="f-contacts">
                <a
                  href={`mailto:${content.brand.email}`}
                  className="f-contact-item"
                  aria-label="Email kami"
                >
                  <svg className="i">
                    <use href="#i-mail" />
                  </svg>
                  <span>{content.brand.email}</span>
                </a>
                <a
                  href={content.brand.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f-contact-item"
                  aria-label="Instagram kami"
                >
                  <svg className="i">
                    <use href="#i-ig" />
                  </svg>
                  <span>@{content.brand.instagram}</span>
                </a>
              </div>
              <a
                className="btn sm wa"
                style={{ marginTop: "14px", width: "fit-content" }}
                href={content.brand.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="i">
                  <use href="#i-wa" />
                </svg>
                WhatsApp {content.brand.whatsappNumber}
              </a>
            </div>
          </div>

          <div className="f-bottom">
            <span>{content.footer.copyright}</span>
            <div className="f-bottom-links">
              <a href="#top">Kembali ke Atas ↑</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile */}
      <nav className="bnav" aria-label="Navigasi Bawah Mobile">
        {content.bottomNav.map((item) =>
          item.type === "wa" ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bnav-wa"
              aria-label={item.label}
            >
              <div className="bnav-wa-icon">
                <svg className="i">
                  <use href={`#${item.icon}`} />
                </svg>
              </div>
              <span>{item.label}</span>
            </a>
          ) : (
            <a
              key={item.label}
              href={item.href}
              className={activeBottom === item.href ? "active" : ""}
              onClick={() => setActiveBottom(item.href)}
            >
              <svg className="i">
                <use href={`#${item.icon}`} />
              </svg>
              <span>{item.label}</span>
            </a>
          )
        )}
      </nav>

      {/* Preview Modal for Mobile / Full View */}
      <div
        id="prevModal"
        className={`modal ${modalData ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Preview Website"
        onClick={closeModal}
      >
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-bar">
            <div className="bar-dots">
              <b></b>
              <b></b>
              <b></b>
            </div>
            <span className="modal-title" id="modalTitle">
              {modalData?.title || ""}
            </span>
            <button
              className="modal-close"
              id="modalClose"
              aria-label="Tutup"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
          <div className="modal-body" id="modalBody" ref={modalBodyRef}>
            {modalData && (
              <Image
                id="modalImg"
                src={modalData.img}
                alt="Website Preview"
                width={1200}
                height={4000}
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
