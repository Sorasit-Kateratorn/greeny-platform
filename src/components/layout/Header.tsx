"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { HeaderRegionSwitcher } from "./HeaderRegionSwitcher";
import { GreenyChatModal } from "@/components/chat/GreenyChatModal";

const NAV_ITEMS = [
  { id: "home", label: "หน้าแรก", href: "/" },
  { id: "shop", label: "ช้อปสินค้า (Marketplace)", href: "/shop" },
  { id: "categories", label: "หมวดหมู่สินค้า", href: "/search" },
  { id: "bestseller", label: "สินค้าขายดี", href: "/search?filter=bestseller" },
  { id: "lives", label: "Greeny Lives", href: "/shop#lives", isLive: true },
  { id: "reviews", label: "Greeny Review", href: "/shop#reviews" },
  { id: "flash-sales", label: "Flash Sales", href: "/shop#flash-sales", isFlash: true },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMode, setChatInitialMode] = useState<"AI" | "SUPPORT">("AI");
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [activeNav, setActiveNav] = useState<string>("shop");

  useEffect(() => {
    const updateActiveNav = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const search = typeof window !== "undefined" ? window.location.search : "";

      if (pathname === "/") {
        setActiveNav("home");
      } else if (pathname === "/shop") {
        if (hash === "#lives") {
          setActiveNav("lives");
        } else if (hash === "#reviews") {
          setActiveNav("reviews");
        } else if (hash === "#flash-sales") {
          setActiveNav("flash-sales");
        } else {
          setActiveNav("shop");
        }
      } else if (pathname === "/search") {
        if (search.includes("filter=bestseller")) {
          setActiveNav("bestseller");
        } else {
          setActiveNav("categories");
        }
      } else {
        setActiveNav("");
      }
    };

    updateActiveNav();
    window.addEventListener("hashchange", updateActiveNav);
    window.addEventListener("popstate", updateActiveNav);
    return () => {
      window.removeEventListener("hashchange", updateActiveNav);
      window.removeEventListener("popstate", updateActiveNav);
    };
  }, [pathname]);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      const mode = e?.detail?.mode || "AI";
      const prompt = e?.detail?.prompt;
      setChatInitialMode(mode);
      setChatInitialPrompt(prompt);
      setIsChatOpen(true);
    };

    window.addEventListener("open-greeny-chat", handleOpenChat);
    return () => window.removeEventListener("open-greeny-chat", handleOpenChat);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(20,41,24,0.05)] border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col justify-between py-2">
          {/* Top Row: Logo, Region Switcher, Search, Actions */}
          <div className="flex items-center justify-between gap-3 md:gap-6 pt-1">
            {/* Logo & Region Switcher */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">eco</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-xl text-primary tracking-tight leading-none group-hover:text-primary-container transition-colors">
                    Greeny
                  </span>
                  <span className="font-display font-bold text-[10px] text-secondary uppercase tracking-wider">
                    Eco Thailand
                  </span>
                </div>
              </Link>

              {/* Language & Currency Region Switcher */}
              <div className="hidden lg:block">
                <HeaderRegionSwitcher />
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="flex-1 max-w-xl mx-2">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full h-11 bg-surface-container-low rounded-full px-4 shadow-inner border border-outline-variant/20 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาบรรจุภัณฑ์รักษ์โลก, ผักตบ, ฟางข้าว, กันกระแทก..."
                  className="w-full bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setChatInitialMode("AI");
                    setIsChatOpen(true);
                  }}
                  className="flex items-center justify-center text-secondary hover:text-primary transition-colors pr-2"
                  title="สอบถาม AI แนะนำบรรจุภัณฑ์"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">psychology</span>
                </button>
                <button
                  type="submit"
                  className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary text-xs font-bold px-4 py-1.5 rounded-full transition-colors font-display shadow-2xs shrink-0"
                >
                  ค้นหา
                </button>
              </form>
            </div>

            {/* Action Links */}
            <div className="flex items-center gap-3 md:gap-5">
              {/* Region Switcher for mobile/tablet */}
              <div className="lg:hidden">
                <HeaderRegionSwitcher />
              </div>

              {/* Greeny Chat AI Trigger */}
              <button
                onClick={() => {
                  setChatInitialMode("AI");
                  setIsChatOpen(true);
                }}
                className="hidden sm:flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold bg-surface-container px-3 py-1.5 rounded-full"
                title="Greeny Chat AI"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">smart_toy</span>
                <span>Chat AI</span>
              </button>

              {/* Orders Link */}
              <Link
                href="/me"
                className="hidden xl:flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                <span>คำสั่งซื้อ</span>
              </Link>

              {/* Express Cart Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold"
                aria-label="Open shopping cart"
              >
                <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                <span className="hidden md:inline">รถเข็น</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-coral-accent text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-sm animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Seller Center Portal Link */}
              <Link
                href="/seller/dashboard"
                className="hidden md:flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold bg-surface-container-high px-3 py-1.5 rounded-full shadow-2xs"
              >
                <span className="material-symbols-outlined text-[18px] text-forest-slate">storefront</span>
                <span>เปิดร้านค้า</span>
              </Link>

              {/* User Account / Profile */}
              <Link
                href="/me"
                className="flex items-center gap-2 pl-2 border-l border-outline-variant/40"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <div className="hidden 2xl:flex flex-col text-left">
                  <span className="text-[10px] text-outline leading-tight">ยินดีต้อนรับ</span>
                  <span className="text-xs font-bold text-on-surface hover:text-primary transition-colors leading-tight">
                    บัญชีฉัน
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom Row: Navigation Links & Verification Tag */}
          <div className="w-full flex items-center justify-between overflow-x-auto pt-2 pb-1 gap-4">
            <nav className="flex items-center gap-1.5 whitespace-nowrap text-xs font-bold">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;

                let linkClass = "";
                if (item.isFlash) {
                  linkClass = isActive
                    ? "px-3 py-1 rounded-full bg-primary/10 text-primary font-extrabold border border-primary/20 shadow-2xs transition-colors"
                    : "px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary font-extrabold hover:bg-tertiary hover:text-white transition-colors";
                } else if (isActive) {
                  linkClass = "px-3 py-1 rounded-full text-primary font-extrabold bg-primary/10 shadow-2xs transition-colors";
                } else {
                  linkClass = "px-3 py-1 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors";
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveNav(item.id)}
                    className={`flex items-center gap-1 ${linkClass}`}
                  >
                    {item.isLive && (
                      <span className="w-2 h-2 rounded-full bg-coral-accent animate-ping"></span>
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-1.5 bg-secondary-container px-3 py-1 rounded-full text-[11px] font-bold text-on-secondary-container shadow-2xs shrink-0">
              <span className="material-symbols-outlined text-primary text-[15px]">verified</span>
              <span>บรรจุภัณฑ์ย่อยสลายได้ 100%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Greeny AI Chat Trigger Button */}
      <button
        onClick={() => {
          setChatInitialMode("AI");
          setChatInitialPrompt(undefined);
          setIsChatOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary to-emerald-700 hover:from-primary-container hover:to-primary text-on-primary font-display font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-white/20 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        aria-label="Open Greeny AI Chat"
        title="ปรึกษา Greeny AI Advisor (Google AI Studio)"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
        </span>
        <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
          smart_toy
        </span>
        <span>Chat AI</span>
      </button>

      {/* Global Greeny Chat Modal */}
      <GreenyChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMode={chatInitialMode}
        initialPrompt={chatInitialPrompt}
      />
    </>
  );
}
