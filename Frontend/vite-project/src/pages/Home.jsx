import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext";

/* ─────────────────────────────────────────────
   STYLES — pixel-perfect Amazon India clone
───────────────────────────────────────────── */
const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .amz-home {
    background: #e3e6e6;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #0f1111;
  }

  /* ── HERO CAROUSEL ── */
  .amz-hero {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #131921;
    user-select: none;
  }
  .amz-hero-track {
    display: flex;
    transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }
  .amz-hero-slide {
    min-width: 100%;
    height: 350px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  @media (max-width: 768px) { .amz-hero-slide { height: 220px; } }

  .amz-hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .amz-hero-grad-l {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 100px;
    background: linear-gradient(to right, #131921 0%, transparent 100%);
    z-index: 2; pointer-events: none;
  }
  .amz-hero-grad-r {
    position: absolute; right: 0; top: 0; bottom: 0;
    width: 100px;
    background: linear-gradient(to left, #131921 0%, transparent 100%);
    z-index: 2; pointer-events: none;
  }
  .amz-hero-arr {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 10;
    background: rgba(255,255,255,0.85);
    border: none; border-radius: 2px;
    width: 44px; height: 86px;
    font-size: 24px; font-weight: 400;
    cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    color: #111;
    transition: background .15s;
    box-shadow: 0 2px 5px rgba(0,0,0,.3);
  }
  .amz-hero-arr:hover { background: rgba(255,255,255,1); }
  .amz-hero-arr.l { left: 0; border-radius: 0 3px 3px 0; }
  .amz-hero-arr.r { right: 0; border-radius: 3px 0 0 3px; }
  .amz-hero-dots {
    position: absolute; bottom: 14px; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 7px; z-index: 10;
  }
  .amz-hero-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(255,255,255,0.4);
    border: none; cursor: pointer; padding: 0;
    transition: background .2s, transform .2s;
  }
  .amz-hero-dot.on { background: #ff9900; transform: scale(1.3); }

  /* Hero text content */
  .amz-hero-content {
    position: absolute; z-index: 2;
    inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px;
    text-align: center;
    padding: 0 60px;
  }
  .amz-hero-tag {
    display: inline-block;
    font-size: 11px; font-weight: 800;
    letter-spacing: .08em; text-transform: uppercase;
    padding: 3px 10px; border-radius: 2px;
    color: #111; width: fit-content;
  }
  .amz-hero-title {
    font-size: 2rem; font-weight: 800;
    color: #fff; line-height: 1.15;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }
  .amz-hero-sub {
    font-size: 14px; color: rgba(255,255,255,0.85);
    line-height: 1.4;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
  .amz-hero-cta {
    display: inline-block; width: fit-content;
    padding: 9px 20px; border-radius: 3px;
    font-size: 13px; font-weight: 700;
    border: none; cursor: pointer;
    font-family: Arial, sans-serif;
    transition: filter .15s, transform .1s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .amz-hero-cta:hover { filter: brightness(1.08); transform: translateY(-1px); }

  @media (max-width: 768px) {
    .amz-hero-title { font-size: 1.3rem; }
    .amz-hero-sub   { font-size: 12px; }
    .amz-hero-cta   { font-size: 12px; padding: 7px 14px; }
  }

  /* ── DEAL STRIP ── */
  .amz-deal {
    background: #232f3e;
    padding: 8px 16px;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    border-bottom: 1px solid #3a4553;
  }
  .amz-deal-badge {
    background: #ff9900; color: #111;
    font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 2px;
    letter-spacing: .05em; text-transform: uppercase;
    white-space: nowrap;
  }
  .amz-deal-text { font-size: 13px; color: #ccc; font-weight: 400; }
  .amz-deal-cd { display: flex; align-items: center; gap: 4px; margin-left: auto; }
  .amz-deal-label { font-size: 11px; color: #aaa; margin-right: 4px; }
  .amz-deal-box {
    background: #131921; color: #ff9900;
    font-size: 13px; font-weight: 800;
    padding: 3px 8px; border-radius: 3px;
    min-width: 32px; text-align: center;
    font-variant-numeric: tabular-nums;
    border: 1px solid #3a4553;
  }
  .amz-deal-col { color: #ff9900; font-weight: 900; font-size: 14px; }

  /* ── CATEGORY NAV STRIP ── */
  .amz-cat-nav {
    background: #37475a;
    overflow-x: auto; white-space: nowrap;
    scrollbar-width: none; padding: 0 8px;
    border-bottom: 1px solid #2a3546;
  }
  .amz-cat-nav::-webkit-scrollbar { display: none; }
  .amz-cat-nav-inner { display: inline-flex; }
  .amz-cat-nav-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 9px 14px;
    background: transparent; border: none;
    color: #ddd; font-size: 13px; font-weight: 500;
    cursor: pointer; white-space: nowrap;
    border-bottom: 2px solid transparent;
    font-family: Arial, sans-serif;
    transition: color .15s, border-color .15s, background .15s;
  }
  .amz-cat-nav-btn:hover,
  .amz-cat-nav-btn.active {
    color: #fff; border-bottom-color: #ff9900;
    background: rgba(255,255,255,0.06);
  }
  .amz-cat-nav-icon { font-size: 15px; line-height: 1; }

  /* ── MAIN LAYOUT ── */
  .amz-main { max-width: 1500px; margin: 0 auto; padding: 12px 10px; }

  /* ── SECTION CARD ── */
  .amz-section {
    background: #fff;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .amz-section-title {
    font-size: 20px; font-weight: 700; color: #0f1111;
    margin-bottom: 14px;
  }
  .amz-section-see-more {
    font-size: 13px; color: #007185; font-weight: 400;
    text-decoration: none; margin-top: 10px; display: inline-block;
  }
  .amz-section-see-more:hover { color: #c7511f; text-decoration: underline; }

  /* ── CATEGORY GRID (Amazon home widgets) ── */
  .amz-cat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 12px;
  }
  @media (max-width: 992px) { .amz-cat-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 576px)  { .amz-cat-grid { grid-template-columns: repeat(2, 1fr); } }

  .amz-cat-card {
    background: #fff; border-radius: 4px;
    padding: 14px; cursor: pointer;
    transition: box-shadow .2s;
  }
  .amz-cat-card:hover { box-shadow: 0 3px 14px rgba(0,0,0,.13); }
  .amz-cat-card-title {
    font-size: 16px; font-weight: 700; color: #0f1111;
    margin-bottom: 10px;
  }
  .amz-cat-img-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 5px; margin-bottom: 8px;
  }
  .amz-cat-img-cell {
    aspect-ratio: 1/1; background: #f7f8f8;
    border-radius: 2px; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
  }
  .amz-cat-img-cell img { width: 100%; height: 100%; object-fit: cover; }
  .amz-cat-see-more { font-size: 13px; color: #007185; }
  .amz-cat-see-more:hover { color: #c7511f; text-decoration: underline; }

  /* ── SIDEBAR + GRID LAYOUT ── */
  .amz-body { display: grid; grid-template-columns: 230px 1fr; gap: 12px; }
  @media (max-width: 900px) { .amz-body { grid-template-columns: 1fr; } }

  /* ── SIDEBAR ── */
  .amz-sidebar {
    background: #fff; border-radius: 4px; padding: 16px;
    position: sticky; top: 10px; height: fit-content;
    border: 1px solid #ddd;
  }
  .amz-sidebar-title {
    font-size: 18px; font-weight: 700; color: #0f1111;
    margin-bottom: 12px;
  }
  .amz-filter-sep { border: none; border-top: 1px solid #e7e7e7; margin: 12px 0; }
  .amz-filter-head {
    font-size: 13px; font-weight: 700; color: #0f1111;
    margin-bottom: 8px; padding-left: 7px;
    border-left: 3px solid #ff9900;
  }
  .amz-filter-row {
    display: flex; align-items: center; gap: 7px;
    padding: 4px 0; cursor: pointer;
    font-size: 13px; color: #0f1111;
  }
  .amz-filter-row:hover { color: #c7511f; }
  .amz-filter-row input[type="checkbox"],
  .amz-filter-row input[type="radio"] {
    accent-color: #ff9900; width: 14px; height: 14px; cursor: pointer;
  }
  .amz-clear-btn {
    background: none; border: none; color: #007185;
    font-size: 12px; font-weight: 600; cursor: pointer;
    padding: 0; font-family: inherit;
  }
  .amz-clear-btn:hover { color: #c7511f; text-decoration: underline; }

  /* ── SORT / RESULT BAR ── */
  .amz-sortbar {
    background: #fff; border-radius: 4px;
    padding: 10px 14px; margin-bottom: 10px;
    display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 8px;
    border-bottom: 2px solid #e7e7e7;
  }
  .amz-result-text { font-size: 14px; color: #555; }
  .amz-result-count { color: #c7511f; font-weight: 700; }
  .amz-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12px; padding: 3px 10px; border-radius: 14px;
    background: #fff3e0; color: #c7511f;
    border: 1px solid #f5c48a; font-weight: 500;
  }
  .amz-chip-x { cursor: pointer; font-weight: 800; margin-left: 2px; }

  /* ── PRODUCT GRID ── */
  .amz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 8px;
  }
  @media (max-width: 576px) { .amz-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; } }

  /* ── PRODUCT CARD — exact Amazon style ── */
  .amz-card {
    background: #fff; border-radius: 4px;
    display: flex; flex-direction: column;
    cursor: pointer; position: relative;
    transition: box-shadow .2s; overflow: hidden;
    border: 1px solid transparent;
  }
  .amz-card:hover {
    box-shadow: 0 2px 20px rgba(0,0,0,.15);
    border-color: #ddd;
  }

  .amz-card-sponsored {
    font-size: 10px; color: #767676;
    padding: 6px 8px 0; min-height: 20px;
  }

  .amz-card-img-wrap {
    aspect-ratio: 1/1; background: #fff;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; padding: 12px; position: relative;
  }
  .amz-card-img {
    max-width: 100%; max-height: 100%;
    object-fit: contain; transition: transform .3s;
  }
  .amz-card:hover .amz-card-img { transform: scale(1.04); }
  .amz-card-fallback { font-size: 3rem; color: #ccc; }

  .amz-card-badge {
    position: absolute; top: 10px; left: 0;
    background: #c0392b; color: #fff;
    font-size: 11px; font-weight: 700;
    padding: 3px 8px; border-radius: 0 3px 3px 0; z-index: 2;
  }
  .amz-card-wish {
    position: absolute; top: 8px; right: 8px;
    background: rgba(255,255,255,.9);
    border: 1px solid #ddd; border-radius: 50%;
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; z-index: 3;
    transition: background .15s, transform .15s;
  }
  .amz-card-wish:hover { background: #fff; transform: scale(1.15); }

  .amz-card-body { padding: 6px 10px; flex: 1; display: flex; flex-direction: column; gap: 2px; }

  .amz-card-name {
    font-size: 13px; color: #0f1111; line-height: 1.4;
    overflow: hidden; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-weight: 400;
  }

  /* Stars */
  .amz-stars { display: flex; align-items: center; gap: 3px; margin-top: 3px; }
  .amz-stars-bar { display: flex; gap: 1px; }
  .amz-star { font-size: 12px; line-height: 1; color: #ddd; }
  .amz-star.on { color: #ff9900; }
  .amz-review-count { font-size: 12px; color: #007185; }
  .amz-review-count:hover { color: #c7511f; text-decoration: underline; }

  /* Price */
  .amz-price-block { margin-top: 4px; }
  .amz-price-row { display: flex; align-items: baseline; gap: 2px; flex-wrap: wrap; }
  .amz-price-symbol { font-size: 12px; font-weight: 700; color: #0f1111; }
  .amz-price-int    { font-size: 20px; font-weight: 700; color: #0f1111; line-height: 1; }
  .amz-price-frac   { font-size: 12px; font-weight: 700; color: #0f1111; }
  .amz-price-mrp    { font-size: 12px; color: #565959; margin-top: 1px; }
  .amz-price-mrp s  { text-decoration: line-through; }
  .amz-price-save   { font-size: 12px; color: #c0392b; font-weight: 600; }

  /* Prime */
  .amz-prime { display: flex; align-items: center; gap: 4px; margin-top: 3px; }
  .amz-prime-badge {
    background: #00a8e0; color: #fff;
    font-size: 9px; font-weight: 800;
    padding: 1px 5px; border-radius: 2px; letter-spacing: .04em;
  }
  .amz-prime-text { font-size: 11px; color: #007185; }

  .amz-delivery { font-size: 11px; color: #007185; margin-top: 2px; }
  .amz-delivery b { font-weight: 700; }
  .amz-stock-low { font-size: 12px; color: #c7511f; font-weight: 500; margin-top: 2px; }
  .amz-stock-out { font-size: 12px; color: #c0392b; font-weight: 600; margin-top: 2px; }

  /* Add to Cart button — exact Amazon style */
  .amz-card-cta {
    margin: 8px 10px 10px;
    background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
    color: #111; border: 1px solid #a88734;
    border-radius: 3px; padding: 7px 10px;
    font-size: 13px; font-weight: 500;
    cursor: pointer; width: calc(100% - 20px);
    font-family: inherit;
    transition: background .12s, border-color .12s;
    white-space: nowrap;
    box-shadow: 0 1px 0 rgba(255,255,255,.4) inset;
  }
  .amz-card-cta:hover:not(:disabled) {
    background: linear-gradient(to bottom, #f5d78e, #eeb933);
    border-color: #a88734;
  }
  .amz-card-cta:disabled {
    background: #f3f3f3; color: #aaa;
    border-color: #ddd; cursor: not-allowed; box-shadow: none;
  }

  /* ── HORIZONTAL SCROLL ROW ── */
  .amz-row-wrap { overflow: hidden; position: relative; }
  .amz-row-scroll {
    display: flex; gap: 8px;
    overflow-x: auto; scroll-behavior: smooth;
    scrollbar-width: none; padding-bottom: 4px;
  }
  .amz-row-scroll::-webkit-scrollbar { display: none; }
  .amz-row-card {
    min-width: 155px; max-width: 155px;
    background: #fff; border-radius: 3px;
    cursor: pointer; flex-shrink: 0;
    border: 1px solid #e7e7e7;
    transition: box-shadow .2s;
    overflow: hidden;
  }
  .amz-row-card:hover { box-shadow: 0 2px 10px rgba(0,0,0,.12); }
  .amz-row-img-wrap {
    width: 100%; aspect-ratio: 1/1; background: #fff;
    display: flex; align-items: center; justify-content: center;
    padding: 8px; font-size: 2rem; color: #ccc;
  }
  .amz-row-img-wrap img { width: 100%; height: 100%; object-fit: contain; }
  .amz-row-name {
    font-size: 12px; padding: 0 8px 3px; color: #0f1111;
    overflow: hidden; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .amz-row-price {
    font-size: 13px; font-weight: 700; padding: 0 8px 8px; color: #0f1111;
  }
  .amz-row-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 5;
    background: rgba(255,255,255,.95);
    border: 1px solid #ddd; border-radius: 50%;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; font-weight: 700; color: #444;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
    transition: background .12s;
  }
  .amz-row-nav:hover { background: #fff; }
  .amz-row-nav.l { left: 0; }
  .amz-row-nav.r { right: 0; }

  /* ── EMPTY STATE ── */
  .amz-empty {
    background: #fff; border-radius: 4px;
    text-align: center; padding: 60px 20px;
  }
  .amz-empty-ico { font-size: 48px; margin-bottom: 12px; }
  .amz-empty p { font-size: 14px; color: #555; margin-bottom: 12px; }
  .amz-empty-btn {
    background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
    color: #111; border: 1px solid #a88734;
    padding: 8px 20px; border-radius: 3px;
    font-size: 13px; font-weight: 500; cursor: pointer;
  }

  .amz-loading { display: flex; justify-content: center; padding: 48px 0; }

  /* ── BACK TO HOME LINK ── */
  .amz-back-link {
    display: inline-flex; align-items: center; gap: 5px;
    color: #007185; font-size: 13px; font-weight: 500;
    background: none; border: none; cursor: pointer;
    padding: 0; font-family: inherit;
  }
  .amz-back-link:hover { color: #c7511f; text-decoration: underline; }

  @media (max-width: 576px) {
    .amz-hero-arr { display: none; }
    .amz-deal-cd  { display: none; }
    .amz-body { gap: 8px; }
    .amz-grid { gap: 6px; }
    .amz-card-body { padding: 5px 8px; }
    .amz-card-cta  { margin: 6px 8px 8px; width: calc(100% - 16px); }
  }
`;

/* ─────────────────────────────────────────────
   BANNER DATA — Amazon India style banners
   Uses Unsplash photos + gradient overlays
───────────────────────────────────────────── */
const BANNERS = [
  {
    bg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
    gradient: "linear-gradient(rgba(15,25,50,0.55), rgba(15,25,50,0.55))",
    tag: "Great Indian Sale",
    tagBg: "#ff9900",
    title: "Up to 70% Off",
    sub: "On Electronics, Fashion & more",
    cta: "Shop Now",
    ctaBg: "#ff9900",
    ctaColor: "#111",
  },
  {
    bg: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80",
    gradient: "linear-gradient(rgba(30,10,60,0.55), rgba(30,10,60,0.55))",
    tag: "New Arrivals",
    tagBg: "#00a8e0",
    title: "Latest Fashion",
    sub: "Explore trending styles at best prices",
    cta: "Explore Now",
    ctaBg: "#fff",
    ctaColor: "#111",
  },
  {
    bg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80",
    gradient: "linear-gradient(rgba(10,30,20,0.55), rgba(10,30,20,0.55))",
    tag: "Free Delivery",
    tagBg: "#2e7d32",
    title: "Shop Smarter",
    sub: "Free delivery on orders above ₹499",
    cta: "Start Shopping",
    ctaBg: "#ff9900",
    ctaColor: "#111",
  },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function useCountdown(targetHour = 20) {
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });
  useEffect(() => {
    const tick = () => {
      const now = new Date(), end = new Date();
      end.setHours(targetHour, 0, 0, 0);
      if (end <= now) end.setDate(end.getDate() + 1);
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTime({
        h: String(Math.floor(diff / 3600)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600) / 60)).padStart(2, "0"),
        s: String(diff % 60).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetHour]);
  return time;
}

function Stars({ rating = 4.2, count }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="amz-stars">
      <div className="amz-stars-bar">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`amz-star ${i <= full ? "on" : i === full + 1 && half ? "on" : ""}`}
          >
            ★
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="amz-review-count">{count.toLocaleString()}</span>
      )}
    </div>
  );
}

function Price({ price, mrp, pct }) {
  const rupees = Math.floor(price);
  return (
    <div className="amz-price-block">
      <div className="amz-price-row">
        <span className="amz-price-symbol">₹</span>
        <span className="amz-price-int">{rupees.toLocaleString("en-IN")}</span>
      </div>
      {mrp > price && (
        <div className="amz-price-mrp">
          M.R.P.: <s>₹{mrp.toLocaleString("en-IN")}</s>{" "}
          <span className="amz-price-save">({pct}% off)</span>
        </div>
      )}
    </div>
  );
}

const CAT_ICONS = {
  default: "📦", electronics: "📱", mobiles: "📱", laptops: "💻",
  fashion: "👗", clothing: "👕", shoes: "👟", books: "📚",
  home: "🏠", kitchen: "🍳", beauty: "💄", sports: "⚽",
  toys: "🧸", grocery: "🛒", furniture: "🛋️", jewelry: "💍", watches: "⌚",
};
const getCatIcon = (name = "") => {
  const k = name.toLowerCase();
  for (const key of Object.keys(CAT_ICONS)) if (k.includes(key)) return CAT_ICONS[key];
  return CAT_ICONS.default;
};

const discountCache = {};
function getDiscount(product) {
  if (!discountCache[product._id]) {
    const pct = 10 + ((product._id?.charCodeAt(0) || 0) % 41);
    const mrp = Math.round(product.price / (1 - pct / 100) / 10) * 10;
    discountCache[product._id] = { pct, mrp };
  }
  return discountCache[product._id];
}

const PRICE_RANGES = [
  { label: "Under ₹500",        value: [0, 499] },
  { label: "₹500 – ₹1,000",    value: [500, 1000] },
  { label: "₹1,000 – ₹5,000",  value: [1000, 5000] },
  { label: "₹5,000 – ₹10,000", value: [5000, 10000] },
  { label: "Above ₹10,000",     value: [10000, 9999999] },
];

/* ─────────────────────────────────────────────
   HERO CAROUSEL
───────────────────────────────────────────── */
function HeroCarousel() {
  const [cur, setCur]       = useState(0);
  const [paused, setPaused] = useState(false);
  const total               = BANNERS.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCur((c) => (c + 1) % total), 5000);
    return () => clearInterval(id);
  }, [paused, total]);

  const go = (dir) => setCur((c) => (c + dir + total) % total);

  return (
    <div
      className="amz-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="amz-hero-track" style={{ transform: `translateX(-${cur * 100}%)` }}>
        {BANNERS.map((b, i) => (
          <div key={i} className="amz-hero-slide">
            {/* Background photo */}
            <img
              className="amz-hero-img"
              src={b.bg}
              alt=""
              onError={(e) => { e.target.style.display = "none"; }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: b.gradient, zIndex: 1,
            }} />
            {/* Text content */}
            <div className="amz-hero-content" style={{
              opacity: i === cur ? 1 : 0,
              transform: i === cur ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
            }}>
              <span className="amz-hero-tag" style={{ background: b.tagBg }}>
                {b.tag}
              </span>
              <div className="amz-hero-title">{b.title}</div>
              <div className="amz-hero-sub">{b.sub}</div>
              <button
                className="amz-hero-cta"
                style={{ background: b.ctaBg, color: b.ctaColor }}
              >
                {b.cta} →
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="amz-hero-grad-l" />
      <div className="amz-hero-grad-r" />
      <button className="amz-hero-arr l" onClick={() => go(-1)}>‹</button>
      <button className="amz-hero-arr r" onClick={() => go(1)}>›</button>
      <div className="amz-hero-dots">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`amz-hero-dot ${i === cur ? "on" : ""}`}
            onClick={() => setCur(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEAL STRIP
───────────────────────────────────────────── */
function DealStrip() {
  const { h, m, s } = useCountdown(20);
  return (
    <div className="amz-deal">
      <span className="amz-deal-badge">⚡ Today's Deals</span>
      <span className="amz-deal-text">Lightning deals — hurry, limited time offer!</span>
      <div className="amz-deal-cd">
        <span className="amz-deal-label">Ends in</span>
        <span className="amz-deal-box">{h}</span>
        <span className="amz-deal-col">:</span>
        <span className="amz-deal-box">{m}</span>
        <span className="amz-deal-col">:</span>
        <span className="amz-deal-box">{s}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CATEGORY NAV STRIP (below deal strip)
───────────────────────────────────────────── */
function CategoryNavStrip({ categories, activeCat, onCatClick, onReset }) {
  return (
    <div className="amz-cat-nav">
      <div className="amz-cat-nav-inner">
        <button
          className={`amz-cat-nav-btn ${activeCat === null ? "active" : ""}`}
          onClick={onReset}
        >
          <span className="amz-cat-nav-icon">🏠</span>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`amz-cat-nav-btn ${activeCat === cat._id ? "active" : ""}`}
            onClick={() => onCatClick(cat)}
          >
            <span className="amz-cat-nav-icon">{getCatIcon(cat.name)}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CATEGORY MINI WIDGETS (Amazon home sections)
───────────────────────────────────────────── */
function CategoryWidgets({ categories, products, onCatClick }) {
  if (!categories.length || !products.length) return null;
  return (
    <div className="amz-cat-grid">
      {categories.slice(0, 8).map((cat) => {
        const catProducts = products
          .filter((p) => p.category?._id === cat._id || p.category?.name === cat.name)
          .slice(0, 4);
        return (
          <div key={cat._id} className="amz-cat-card amz-section" onClick={() => onCatClick(cat)}>
            <div className="amz-cat-card-title">{cat.name}</div>
            <div className="amz-cat-img-grid">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="amz-cat-img-cell">
                  {catProducts[i]?.photo ? (
                    <img
                      src={`${import.meta.env.VITE_API}/uploads/${catProducts[i].photo}`}
                      alt=""
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span>{getCatIcon(cat.name)}</span>
                  )}
                </div>
              ))}
            </div>
            <span className="amz-cat-see-more">See more</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HORIZONTAL SCROLL ROW
───────────────────────────────────────────── */
function ProductRow({ title, products, navigate }) {
  const scrollRef = useRef(null);
  const scroll    = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += dir * 600;
  };
  if (!products.length) return null;
  return (
    <div className="amz-section" style={{ marginBottom: 12 }}>
      <div className="amz-section-title">{title}</div>
      <div className="amz-row-wrap">
        <div className="amz-row-scroll" ref={scrollRef}>
          {products.map((p) => {
            const { pct } = getDiscount(p);
            return (
              <div
                key={p._id}
                className="amz-row-card"
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                <div className="amz-row-img-wrap">
                  {p.photo ? (
                    <img
                      src={`${import.meta.env.VITE_API}/uploads/${p.photo}`}
                      alt={p.name}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span>{getCatIcon(p.category?.name)}</span>
                  )}
                </div>
                <div className="amz-row-name">{p.name}</div>
                <div className="amz-row-price">
                  ₹{p.price?.toLocaleString("en-IN")}
                  {pct >= 20 && (
                    <span style={{ fontSize: 11, color: "#c0392b", marginLeft: 4 }}>
                      {pct}% off
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button className="amz-row-nav l" onClick={() => scroll(-1)}>‹</button>
        <button className="amz-row-nav r" onClick={() => scroll(1)}>›</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ product, navigate, addToCart, wishlist, toggleWishlist }) {
  const [imgErr, setImgErr] = useState(false);
  const { pct, mrp }        = getDiscount(product);
  const isWished            = wishlist.includes(product._id);
  const rating              = parseFloat(
    (3.5 + ((product._id?.charCodeAt(0) || 0) % 15) / 10).toFixed(1)
  );
  const reviews  = 50 + (((product._id?.charCodeAt(1) || 0) * 7) % 900);
  const isPrime  = product.shipping || (product._id?.charCodeAt(2) || 0) % 2 === 0;

  return (
    <div className="amz-card" onClick={() => navigate(`/product/${product.slug}`)}>
      <div className="amz-card-sponsored">Sponsored</div>

      <div className="amz-card-img-wrap">
        {pct >= 25 && <span className="amz-card-badge">{pct}% off</span>}
        <button
          className="amz-card-wish"
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}
          title={isWished ? "Remove from wishlist" : "Save"}
        >
          {isWished ? "❤️" : "🤍"}
        </button>
        {imgErr ? (
          <div className="amz-card-fallback">{getCatIcon(product.category?.name)}</div>
        ) : (
          <img
            className="amz-card-img"
            src={
              product.photo
                ? `${import.meta.env.VITE_API}/uploads/${product.photo}`
                : "https://via.placeholder.com/300?text=No+Image"
            }
            alt={product.name}
            onError={() => setImgErr(true)}
          />
        )}
      </div>

      <div className="amz-card-body">
        <div className="amz-card-name">{product.name}</div>
        <Stars rating={rating} count={reviews} />
        <Price price={product.price || 0} mrp={mrp} pct={pct} />

        {isPrime && product.quantity > 0 && (
          <div className="amz-prime">
            <span className="amz-prime-badge">prime</span>
            <span className="amz-prime-text">FREE Delivery</span>
          </div>
        )}
        {product.quantity === 0 && (
          <div className="amz-stock-out">Currently unavailable.</div>
        )}
        {product.quantity > 0 && product.quantity < 10 && (
          <div className="amz-stock-low">Only {product.quantity} left in stock.</div>
        )}
        {product.quantity >= 10 && product.shipping && (
          <div className="amz-delivery">
            <b>FREE</b> delivery by <b>Tomorrow</b>
          </div>
        )}
      </div>

      <button
        className="amz-card-cta"
        disabled={product.quantity === 0}
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product);
          toast.success("Added to Cart!", {
            icon: "🛒",
            style: { fontSize: 13, fontWeight: 600 },
          });
        }}
      >
        {product.quantity === 0 ? "Currently unavailable" : "Add to Cart"}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────── */
const Home = () => {
  const navigate       = useNavigate();
  const { addToCart }  = useCart();

  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked]       = useState([]);
  const [radio, setRadio]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [activeCat, setActiveCat]   = useState(null);
  const [wishlist, setWishlist]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist") || "[]"); }
    catch { return []; }
  });

  /* ── API calls ── */
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data.success) setCategories(data.categories);
    } catch { toast.error("Failed to load categories"); }
  }, []);

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/product/get-all-products");
      if (data.success) setProducts(data.products);
    } catch { toast.error("Failed to load products"); }
    finally { setLoading(false); }
  }, []);

  const fetchFiltered = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/product/filter-products", { checked, radio });
      if (data.success) setProducts(data.products);
    } catch { toast.error("Filter failed"); }
    finally { setLoading(false); }
  }, [checked, radio]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    if (!checked.length && !radio.length) fetchAllProducts();
    else fetchFiltered();
  }, [checked, radio, fetchAllProducts, fetchFiltered]);

  /* ── Handlers ── */
  const toggleCategory = (id) =>
    setChecked((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id]);

  const handleReset = () => { setChecked([]); setRadio([]); setActiveCat(null); };
  const hasFilters  = checked.length > 0 || radio.length > 0;

  const handleCatClick = (cat) => {
    if (activeCat === cat._id) {
      handleReset();
    } else {
      setActiveCat(cat._id);
      setChecked([cat._id]);
      setRadio([]);
    }
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  };

  const showFilteredView = hasFilters || activeCat;

  return (
    <div className="amz-home">
      <style>{styles}</style>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "Arial, sans-serif", fontSize: 13, borderRadius: 4 },
        }}
      />

      {/* Hero + Deal + Category Nav */}
      <HeroCarousel />
      <DealStrip />
      {categories.length > 0 && (
        <CategoryNavStrip
          categories={categories}
          activeCat={activeCat}
          onCatClick={handleCatClick}
          onReset={handleReset}
        />
      )}

      <div className="amz-main">
        {/* ── HOME VIEW (no filters) ── */}
        {!showFilteredView && (
          <>
            <CategoryWidgets
              categories={categories}
              products={products}
              onCatClick={handleCatClick}
            />
            <ProductRow
              title="Best sellers in your area"
              products={products.slice(0, 20)}
              navigate={navigate}
            />
            <div className="amz-section">
              <div className="amz-section-title">All Products</div>
              {loading ? (
                <div className="amz-loading">
                  <Spinner animation="border" style={{ color: "#ff9900" }} />
                </div>
              ) : (
                <div className="amz-grid">
                  {products.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      navigate={navigate}
                      addToCart={addToCart}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
            <ProductRow
              title="Recommended for you"
              products={[...products].reverse().slice(0, 20)}
              navigate={navigate}
            />
          </>
        )}

        {/* ── FILTERED VIEW ── */}
        {showFilteredView && (
          <div className="amz-body">
            {/* Sidebar */}
            <div className="amz-sidebar">
              <div
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 12,
                }}
              >
                <span className="amz-sidebar-title">Filters</span>
                {hasFilters && (
                  <button className="amz-clear-btn" onClick={handleReset}>Clear all</button>
                )}
              </div>
              <hr className="amz-filter-sep" />
              <div className="amz-filter-head">Category</div>
              {categories.map((cat) => (
                <label className="amz-filter-row" key={cat._id}>
                  <input
                    type="checkbox"
                    checked={checked.includes(cat._id)}
                    onChange={() => toggleCategory(cat._id)}
                  />
                  {cat.name}
                </label>
              ))}
              <hr className="amz-filter-sep" />
              <div className="amz-filter-head">Price</div>
              {PRICE_RANGES.map((r, i) => (
                <label className="amz-filter-row" key={i}>
                  <input
                    type="radio"
                    name="price"
                    checked={radio[0] === r.value[0] && radio[1] === r.value[1]}
                    onChange={() => setRadio(r.value)}
                  />
                  {r.label}
                </label>
              ))}
            </div>

            {/* Products column */}
            <div>
              {/* Sort / result bar */}
              <div className="amz-sortbar">
                <span className="amz-result-text">
                  {loading ? "Loading…" : (
                    <>
                      <span className="amz-result-count">{products.length}</span> results
                    </>
                  )}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                  {checked.map((id) => {
                    const cat = categories.find((c) => c._id === id);
                    return cat ? (
                      <span className="amz-chip" key={id}>
                        {cat.name}
                        <span className="amz-chip-x" onClick={() => toggleCategory(id)}>×</span>
                      </span>
                    ) : null;
                  })}
                  {radio.length === 2 && (
                    <span className="amz-chip">
                      {PRICE_RANGES.find(
                        (r) => r.value[0] === radio[0] && r.value[1] === radio[1]
                      )?.label}
                      <span className="amz-chip-x" onClick={() => setRadio([])}>×</span>
                    </span>
                  )}
                  <button className="amz-back-link" onClick={handleReset}>
                    ← Back to home
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="amz-loading">
                  <Spinner animation="border" style={{ color: "#ff9900" }} />
                </div>
              ) : products.length === 0 ? (
                <div className="amz-empty">
                  <div className="amz-empty-ico">🔍</div>
                  <p>No results for your selection.</p>
                  <button className="amz-empty-btn" onClick={handleReset}>Clear filters</button>
                </div>
              ) : (
                <div className="amz-grid">
                  {products.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      navigate={navigate}
                      addToCart={addToCart}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;