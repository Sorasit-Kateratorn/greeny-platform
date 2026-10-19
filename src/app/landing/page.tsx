"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import confetti from "canvas-confetti";

interface MockProduct {
  id: string;
  name: string;
  category: "cushion" | "tableware" | "bags";
  image: string;
  retailPrice: number;
  originalPrice: number;
  producer: string;
  badge: string;
  carbonBadge: string;
  carbonIcon: string;
  rating: number;
  reviewsCount: number;
  wholesaleTiers: { minQty: number; unitPrice: number; discountPct: number }[];
}

const PRODUCTS: MockProduct[] = [
  {
    id: "prod-hyacinth-roll",
    name: "แผ่นผักตบชวากันกระแทก (Water Hyacinth Cushion Roll)",
    category: "cushion",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3P-hGlXlfWv-VzeBkTpzSRv9rYBRMsIr9tM1dKBHfUqHzkhW1kvR3EF0_O5PioLtQrZX6IAtTHDFTNO57Fa51v6azcRJK9yBOZkHWaV_VAeznV6nLYM5iu9FdInmqquIpgH0QDGa4OWKWfRkOE_-s-3Zn3g2B2OISSviDbTDlwz1nsLEfxVWz0qiRngZMnQfYIzHaorlB9gE4Ud3JGutXRlaj523CRumAhg3T0wVwYSd-k-hK82Za",
    retailPrice: 145,
    originalPrice: 180,
    producer: "วิสาหกิจชุมชนบางเลน",
    badge: "ลดขยะแหล่งน้ำ",
    carbonBadge: "-1.20 kg CO2e / ม้วน",
    carbonIcon: "co2",
    rating: 4.9,
    reviewsCount: 540,
    wholesaleTiers: [
      { minQty: 5, unitPrice: 125, discountPct: 14 },
      { minQty: 20, unitPrice: 110, discountPct: 24 },
    ],
  },
  {
    id: "prod-cornstarch-peanuts",
    name: "เม็ดโฟมแป้งข้าวโพดย่อยสลาย ละลายน้ำ 100% (50 ลิตร)",
    category: "cushion",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4pXYPJOTpwCFjnzdOh-OAxQt68ZxC5ZHLu6mJJN0Wn4Fn8VfJ1wJ0mB5WOfKupSDAFHaVVtmK3sgVjk-1_qHnmfhVhrqChxrU0L5mcoLQHRtR0n8c7nmo9qQpJkoOqcoL6oX-IRdXIHr8LOw5YfHA-c3er_94DibTZGxAlh1Y4U0RZ4qxVHaoKYG003Kwcv7gilU9UE4TNKk9RdqklrGObIyd3OEvnXwKTbjGiBzbWhk0IWMKuU6L",
    retailPrice: 189,
    originalPrice: 250,
    producer: "Green BioPack Tech",
    badge: "-25% Flash",
    carbonBadge: "ละลายน้ำใน 10 วินาที",
    carbonIcon: "water_drop",
    rating: 4.95,
    reviewsCount: 1240,
    wholesaleTiers: [
      { minQty: 3, unitPrice: 165, discountPct: 13 },
      { minQty: 10, unitPrice: 145, discountPct: 23 },
    ],
  },
  {
    id: "prod-mushroom-foam",
    name: "โฟมขึ้นรูปจากเส้นใยเห็ด (Mushroom Packaging Foam)",
    category: "cushion",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAL284C05ltxwGFmnlGygHSZWhut1bEE1N9rPe4BSSL9uuwnjWHzF2JONdfWsb6DOVKwSlAZ8KBG7BfH8h6t7z5qUn3Uj7wNqf1tko560K6WC8i0F3KzNgslkXSKeMKrwFfpPUtI5O70nh4z5CItoZudmyAQIgQvNTmONSRQqLM8IdE6pEyfdh3UBXSj2yV_N3f0RJUAlL6oGuIGAgQ7sPLtp6Od2-W0bdZAzrQfchRZD_9l4Shw31H",
    retailPrice: 320,
    originalPrice: 390,
    producer: "Mycelium EcoLab TH",
    badge: "นวัตกรรมเห็ด",
    carbonBadge: "ทนความร้อน ไม่อับชื้น",
    carbonIcon: "forest",
    rating: 4.88,
    reviewsCount: 310,
    wholesaleTiers: [
      { minQty: 5, unitPrice: 285, discountPct: 11 },
      { minQty: 15, unitPrice: 250, discountPct: 22 },
    ],
  },
  {
    id: "prod-areca-palm-plates",
    name: "ชุดจานกาบหมากธรรมชาติ ทรงเหลี่ยม 8 นิ้ว (แพ็ก 25 ชิ้น)",
    category: "tableware",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZsOqNQCce8JUsPohlfL0bRLaiTwiqE8edw8vcYpfmX0YfFuI_2K1roofpdVLgXkWqaStAzklLdZZvNIDM6U1eqjoEjv-PG5q_dfG-Qy0dik9xE59NIHA_6XvhPxpfY0e4PLIE38gF2Eo3YGWdwOQsfQFCNme6REYl3kGMouoJYIbTiFrClFBXwtjU44r5yunwJhOW4Lx0D7bstdOUNO-FkuxOtsfwAtWgBrKwpaHL2Fu0iZf8oOJ9",
    retailPrice: 160,
    originalPrice: 200,
    producer: "วิสาหกิจกาบหมากสุราษฎร์",
    badge: "เข้าไมโครเวฟได้",
    carbonBadge: "ไม่ใช้กาวหรือสารเคมี",
    carbonIcon: "eco",
    rating: 4.96,
    reviewsCount: 890,
    wholesaleTiers: [
      { minQty: 4, unitPrice: 140, discountPct: 12 },
      { minQty: 10, unitPrice: 120, discountPct: 25 },
    ],
  },
];

const AI_PRESET_QUESTIONS = [
  {
    q: "ต้องการส่งเซรามิก 500 กรัม ควรใช้วัสดุกันกระแทกแบบใด?",
    a: "แนะนำ 'แผ่นรวงผึ้งกระดาษคราฟท์' ร่วมกับ 'เม็ดโฟมแป้งข้าวโพด' ย่อยสลายได้ทันทีในน้ำ รองรับแรงกดทับได้สูงสุด 15 กก. ไร้รอยขีดข่วนครับ",
    badge: "ลดขยะพลาสติก 100%",
  },
  {
    q: "ร้านกาแฟอยากเปลี่ยนเป็นแก้วและหลอดย่อยสลายได้ มีแบบไหนบ้าง?",
    a: "Greeny มีแก้วชานอ้อยเคลือบ PLA ชีวภาพ และหลอดก้านบัวธรรมชาติ ย่อยสลายในดินภายใน 90 วัน ไม่เปื่อยยุ่ยในเครื่องดื่มเย็น สั่งขั้นต่ำเพียง 100 ชิ้นครับ",
    badge: "ย่อยสลาย 90 วัน",
  },
  {
    q: "ส่งพัสดุ EV Express ต่างจังหวัดครอบคลุมพื้นที่ไหนบ้าง?",
    a: "ปัจจุบันครอบคลุมกรุงเทพฯ-ปริมณฑล และหัวเมืองใหญ่ เช่น เชียงใหม่ ขอนแก่น ภูเก็ต พร้อมขยายสถานีชาร์จพลังงานแสงอาทิตย์ทั่วประเทศครบ 77 จังหวัดในปี 2025 ครับ",
    badge: "EV 100% Zero Emission",
  },
];

export default function LandingPage() {
  const { addToCart, openCart } = useCart();

  // Category Filter State
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Interactive AI Assistant State
  const [selectedAiIndex, setSelectedAiIndex] = useState(0);

  // Carbon Impact Calculator State
  const [monthlyOrders, setMonthlyOrders] = useState<number>(120);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Toast feedback state for cart
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // B2B Modal
  const [showB2BModal, setShowB2BModal] = useState(false);
  const [b2bSubmitted, setB2bSubmitted] = useState(false);

  const filteredProducts =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: MockProduct) => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        retailPrice: product.retailPrice,
        storeName: product.producer,
        wholesaleTiers: product.wholesaleTiers,
        isMall: true,
      },
      1
    );

    setAddedToast(`เพิ่ม "${product.name.slice(0, 28)}..." ลงรถเข็นแล้ว!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore if confetti blocked
    }

    setIsSubscribed(true);
  };

  const copyCouponCode = () => {
    navigator.clipboard.writeText("ECO10");
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  // Calculations for interactive impact slider
  const savedCo2 = (monthlyOrders * 0.45).toFixed(1);
  const plasticBagsAvoided = Math.round(monthlyOrders * 3.2);
  const treesEquivalent = (monthlyOrders * 0.08).toFixed(1);

  return (
    <div className="w-full bg-surface text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Toast Notification */}
      {addedToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-outline-variant/40"
        >
          <span className="material-symbols-outlined text-primary-fixed text-[22px]">
            check_circle
          </span>
          <span className="text-xs sm:text-sm font-medium">{addedToast}</span>
          <button
            onClick={openCart}
            className="ml-2 text-xs font-bold text-primary-fixed underline hover:text-white"
          >
            ดูรถเข็น
          </button>
        </aside>
      )}

      {/* =========================================================================
          SECTION 1: HERO SECTION & TRUST METRICS
          ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-container-lowest/60 to-surface-container-low pt-4 sm:pt-8 pb-16 lg:py-20 border-b border-outline-variant/20">
        {/* Ambient organic green blur background decorations */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-6">
              {/* Eco Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/80 text-on-secondary-container shadow-sm border border-outline-variant/30">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
                <span className="font-display font-bold text-xs sm:text-sm tracking-tight">
                  🌱 แพลตฟอร์มอีคอมเมิร์ซปลอดพลาสติก 100% แห่งแรกในไทย
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.15]">
                ช้อปเพื่อโลกที่ยั่งยืน <br />
                <span className="text-primary font-display">เริ่มต้นที่ Greeny</span>
              </h1>

              {/* Subtitle */}
              <p className="font-body text-sm sm:text-base lg:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                รวมสินค้าเกษตรอินทรีย์ บรรจุภัณฑ์ย่อยสลายได้ทางชีวภาพจากวิสาหกิจชุมชนไทย
                พร้อมระบบคำนวณและชดเชยคาร์บอน (Carbon Offset) ทุกคำสั่งซื้อ จัดส่งด้วยรถพลังงานไฟฟ้า EV ถึงมือคุณ
              </p>

              {/* Dual CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
                <Link
                  href="/search"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-display font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-200 group"
                >
                  <span>สำรวจสินค้าเพื่อโลก</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  href="/seller/onboarding"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-surface-container-lowest text-on-surface hover:text-primary hover:bg-surface-container font-display font-bold text-sm sm:text-base shadow-xs border border-outline-variant/40 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    storefront
                  </span>
                  <span>สมัครเปิดร้านค้าสีเขียว</span>
                </Link>
              </div>

              {/* Micro Carbon Guarantee Note */}
              <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm pt-1">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  verified_user
                </span>
                <span>มาตรฐานรับรอง Biodegradable ASTM D6400 &amp; สัญลักษณ์คาร์บอนฟุตพริ้นท์</span>
              </div>
            </div>

            {/* Right Visual Showcase / Dynamic Collage */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              {/* Main Hero Showcase Card */}
              <div className="relative w-full rounded-3xl bg-surface-container-lowest p-4 sm:p-5 shadow-2xl border border-outline-variant/30">
                <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden bg-surface-container">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEMsu1MuZZpHPDqSasRNb_1qmrKYbUlVO-UGVcN6OQzBLMBbrhG9OmakpE0ymx2muHOEBT3wzcBoBKN84tM31zR6aAlryf6_hhSXdLoJdOm5hKSvFY9WMFa-6RF0fnJ1Sf39RHjQv526b2iJNhaKeR3FV9tZ9qok_khUbnl64eLunVrnYj44Scq11iP4tZ9_TOUu1Z5jO5VLwz11LWROlajd0m1i3oQJNWnxSuh48no_Bl2WxdfvXc"
                    alt="Eco-friendly packaging products arrangement"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold shadow-md flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">compost</span>
                    <span>100% Compostable</span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-xs font-bold shadow-sm flex items-center gap-1.5 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      electric_bolt
                    </span>
                    <span>ส่งด่วน EV Express</span>
                  </div>
                </div>

                {/* Overlapping Float Card: Live Carbon Tracker */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3.5 max-w-xs border border-outline-variant/30 backdrop-blur-md">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">co2</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      คำสั่งซื้อล่าสุดช่วยลด
                    </span>
                    <span className="font-display font-extrabold text-base sm:text-lg text-primary">
                      -2.84 kg CO2e
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      เทียบเท่าปลูกต้นไม้ 1 ต้น 🌳
                    </span>
                  </div>
                </div>

                {/* Overlapping Float Badge: Zero Plastic Ribbon */}
                <div className="absolute -top-3 -right-3 bg-tertiary-container text-on-tertiary-container font-display font-extrabold text-xs px-3.5 py-1.5 rounded-2xl shadow-md flex items-center gap-1.5 transform rotate-2 border border-tertiary/20">
                  <span className="material-symbols-outlined text-[16px]">block</span>
                  <span>Zero-Single-Use Plastic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Metrics Strip */}
          <div className="mt-14 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 bg-surface-container-lowest rounded-3xl p-5 sm:p-8 shadow-sm border border-outline-variant/30">
              <div className="flex flex-col gap-1 items-start pl-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[24px]">nest_eco_leaf</span>
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
                    1,480,250
                  </span>
                </div>
                <span className="font-display font-bold text-xs sm:text-sm text-primary">
                  kg CO2e
                </span>
                <p className="text-xs text-on-surface-variant">คาร์บอนที่ช่วยลดสะสมทั้งแพลตฟอร์ม</p>
              </div>

              <div className="flex flex-col gap-1 items-start pl-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
                    50,000+
                  </span>
                </div>
                <span className="font-display font-bold text-xs sm:text-sm text-primary">
                  คำสั่งซื้อ EV
                </span>
                <p className="text-xs text-on-surface-variant">ส่งด้วยรถขนส่งพลังงานไฟฟ้า 100%</p>
              </div>

              <div className="flex flex-col gap-1 items-start pl-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[24px]">groups</span>
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
                    2,500+
                  </span>
                </div>
                <span className="font-display font-bold text-xs sm:text-sm text-primary">
                  วิสาหกิจชุมชน
                </span>
                <p className="text-xs text-on-surface-variant">เกษตรกรไทยผ่านการตรวจรับรอง Eco</p>
              </div>

              <div className="flex flex-col gap-1 items-start pl-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[24px]">recycling</span>
                  <span className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
                    100%
                  </span>
                </div>
                <span className="font-display font-bold text-xs sm:text-sm text-primary">
                  Plastic Neutral
                </span>
                <p className="text-xs text-on-surface-variant">บรรจุภัณฑ์ไร้พลาสติกใช้ครั้งเดียว</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: INTERACTIVE CARBON OFFSET CALCULATOR (COMMERCIAL UTILITY)
          ========================================================================= */}
      <section className="w-full py-12 lg:py-16 bg-surface border-b border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-gradient-to-r from-secondary-container/50 via-surface-container to-secondary-container/40 rounded-3xl p-6 sm:p-10 border border-outline-variant/30 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-primary font-display font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>Green Impact Calculator (สำหรับร้านค้า &amp; ผู้ซื้อ)</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
                จำลองผลกระทบเชิงบวกต่อสิ่งแวดล้อมของคุณ
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                เลื่อนแถบเพื่อดูว่า หากร้านค้าหรือครัวเรือนของคุณเปลี่ยนมาใช้บรรจุภัณฑ์ย่อยสลายได้ของ Greeny
                จะสามารถช่วยโลกได้มากเพียงใดในแต่ละเดือน
              </p>

              {/* Slider Controller */}
              <div className="mt-4 pt-2">
                <div className="flex justify-between items-center text-xs font-bold text-on-surface mb-2">
                  <span>ปริมาณพัสดุ / ออเดอร์ต่อเดือน:</span>
                  <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-display text-sm font-extrabold">
                    {monthlyOrders} กล่อง/เดือน
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-outline mt-1 font-medium">
                  <span>10 กล่อง (ร้านขนาดเล็ก)</span>
                  <span>500 กล่อง (ร้านค้ากำลังโต)</span>
                  <span>1,000+ กล่อง (ธุรกิจ SME)</span>
                </div>
              </div>
            </div>

            {/* Impact Calculation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full lg:w-auto shrink-0">
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[22px]">cloud_off</span>
                </div>
                <span className="font-display font-extrabold text-xl sm:text-2xl text-primary">
                  -{savedCo2} kg
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  CO2e คาร์บอนที่ลดได้
                </span>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[22px]">delete_sweep</span>
                </div>
                <span className="font-display font-extrabold text-xl sm:text-2xl text-tertiary">
                  -{plasticBagsAvoided} ชิ้น
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  ขยะพลาสติกที่หมดไป
                </span>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[22px]">park</span>
                </div>
                <span className="font-display font-extrabold text-xl sm:text-2xl text-on-secondary-container">
                  {treesEquivalent} ต้น
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  เทียบเท่าปลูกต้นไม้
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CORE VALUE PROPOSITIONS (4 PILLARS BENTO GRID)
          ========================================================================= */}
      <section className="w-full py-16 lg:py-24 bg-surface border-b border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="font-display font-bold text-xs sm:text-sm text-primary uppercase tracking-wider">
                Greeny Standard of Excellence
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight">
                ทำไมต้องเลือก Greeny?
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                มาตรฐานที่ผสานความสะดวกสบายของการช้อปปิ้งออนไลน์ เข้ากับความรับผิดชอบต่อสิ่งแวดล้อมอย่างแท้จริง
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-display font-bold text-xs border border-outline-variant/20">
                มาตรฐานตรวจสอบ 5 ระดับ
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-display font-bold text-xs border border-outline-variant/20">
                Eco-Pass การันตี
              </span>
            </div>
          </div>

          {/* Bento Grid of 4 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="flex flex-col justify-between p-6 rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/30 group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px] text-primary">eco</span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-display font-bold text-[11px] mb-2.5">
                  ย่อยสลายได้ใน 90 วัน
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-on-surface mb-2">
                  100% Bio-Degradable
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  วัสดุทำจากพืชธรรมชาติ เช่น ผักตบชวา ชานอ้อย และแป้งมันสำปะหลัง ไร้สารเคลือบไมโครพลาสติก คืนสารอาหารให้ดินอย่างปลอดภัย
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center gap-1 text-primary font-display font-bold text-xs">
                <span>ดูผลแล็บทดสอบ ASTM</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col justify-between p-6 rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/30 group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px] text-primary">
                    electric_car
                  </span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-display font-bold text-[11px] mb-2.5">
                  EV Fleet Logistics
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-on-surface mb-2">
                  Green Delivery Partner
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  จัดส่งพัสดุด้วยรถขนส่งไฟฟ้า ลดควันพิษ PM2.5 และใช้เทปกระดาษกาวน้ำ (Water-Activated Tape) ไร้เทปพลาสติก แกะรีไซเคิลได้ทันที
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center gap-1 text-primary font-display font-bold text-xs">
                <span>เส้นทางขนส่งสีเขียว</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col justify-between p-6 rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/30 group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px] text-primary">
                    agriculture
                  </span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-display font-bold text-[11px] mb-2.5">
                  Fair Trade 100%
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-on-surface mb-2">
                  Direct from Thai Farmers
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  เชื่อมตรงกับกลุ่มเกษตรกรและช่างฝีมือชุมชนกว่า 77 จังหวัด สร้างรายได้คืนสู่รากหญ้าโดยไม่ผ่านคนกลางหลายต่อ ราคาเป็นธรรม
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center gap-1 text-primary font-display font-bold text-xs">
                <span>ทำความรู้จักเกษตรกร</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col justify-between p-6 rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/30 group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px] text-primary">loyalty</span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-display font-bold text-[11px] mb-2.5">
                  Green Points &amp; Offset
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-on-surface mb-2">
                  Eco-Rewards &amp; Credits
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  ทุกคำสั่งซื้อและรีวิวการลดขยะ เปลี่ยนเป็นคะแนน Green Points แลกส่วนลดเงินสด และแปลงเป็นเหรียญสนับสนุนโครงการปลูกป่าชุมชน
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center gap-1 text-primary font-display font-bold text-xs">
                <span>ระบบแต้มและปลูกป่า</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: GREENY ECOSYSTEM EXPERIENCES (SIGNATURE FEATURES)
          ========================================================================= */}
      <section className="w-full py-16 lg:py-24 bg-surface-container-low border-b border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-display font-bold text-xs sm:text-sm text-primary uppercase tracking-wider">
              Integrated Commerce &amp; Community
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight mt-1">
              ระบบนิเวศการช้อปปิ้งเพื่อโลกที่ครบวงจร
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
              ไม่เพียงแค่ซื้อขาย แต่คือพื้นที่แห่งการเรียนรู้ แบ่งปันไลฟ์สไตล์ และขับเคลื่อนเศรษฐกิจหมุนเวียน (Circular Economy) ไปด้วยกัน
            </p>
          </div>

          {/* 4 Signature Interactive Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature 1: Greeny Lives */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-6 items-center hover:shadow-lg transition-all duration-300">
              <div className="w-full md:w-1/2 h-64 rounded-2xl overflow-hidden relative bg-surface-container shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaZkDMHQ0mrir2yA6Yv9tb0iPgkZbCppWAwbySIQrXzNh9Os7kOjJcLilJBsX1BUqdWz6Ph3Sx0_LHRovZg-51JvmXj4WzWW8XL_uL5zl0sQ9xUx0R3bmJIfkGg02Mkyz2dgOSH5nBPUqaXw8LQvZWG9btup3O_D7QGMPv9ueCOZMCntKWGx-f3j6zZqk9kY4CN1QwrCCXKR3opN1g2vS90VgZYEjrPYHqpRP2G6YPpgVYdCKmT1LU"
                  alt="Greeny Lives streaming demo"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-error text-on-error font-display font-bold text-xs flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-surface-container-lowest animate-ping"></span>
                  <span>LIVE</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-on-surface/80 backdrop-blur-md text-on-primary flex items-center justify-between text-xs font-bold">
                  <span>ผู้ชม 1,420 คน</span>
                  <span className="text-primary-fixed">แจกโค้ด -20%</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                  <span className="font-display font-bold text-xs uppercase">Live Commerce</span>
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-on-surface">
                  Greeny Lives ช้อปสดกับผู้ผลิต
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  พบกับเกษตรกรและผู้ผลิตตัวจริง สาธิตการทดสอบการย่อยสลาย ความแข็งแรงของบรรจุภัณฑ์ชานอ้อย และเคล็ดลับการปลูกแบบอินทรีย์ ช้อปได้ทันทีขณะชมไลฟ์
                </p>
                <Link
                  href="/#lives"
                  className="inline-flex items-center gap-1 text-primary font-display font-bold text-xs sm:text-sm mt-1 hover:underline"
                >
                  <span>เข้าห้องชมไลฟ์ตอนนี้</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Feature 2: Greeny Review (UGC Community) */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-6 items-center hover:shadow-lg transition-all duration-300">
              <div className="w-full md:w-1/2 h-64 rounded-2xl overflow-hidden relative bg-surface-container shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr4Ew9_eZ-24C-wD74djj8KJF6r5qe5BcYg_PqmQhKyYYCBTKVjM62cZFJAwZLw7f_CW7xI6FMIcziw9AwMOWB2rSAqqBuv95-Rx7Hjx0YNQ8Wel1FyODz177_nt6T2N4C09QbvHffFfGZ_jWR7kJMp0zVx9V5cW9I6-rDrMZT-ZQP08FiE2fvYkxXoZXVi6ElF7t_5B0S6T_4dXMmsDVG5kQtiXcoroTHeS2Rl26kCq-z_7WlQ92B"
                  alt="Eco packaging unboxing review"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-display font-bold text-xs flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">reviews</span>
                  <span>รีวิวจริง 100%</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-on-surface/80 backdrop-blur-md text-on-primary flex items-center justify-between text-xs font-bold">
                  <span>★ 4.9 (18,400+ รีวิว)</span>
                  <span className="text-primary-fixed">+50 แต้มต่อโพสต์</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">rate_review</span>
                  <span className="font-display font-bold text-xs uppercase">Community UGC</span>
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-on-surface">
                  Greeny Review ชุมชนคนรักษ์โลก
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  พื้นที่รวมรีวิวแกะกล่องพัสดุเขียวจากผู้ใช้จริง ร่วมแชร์วิดีโอทดสอบการละลายน้ำของโฟมข้าวโพด แลกเปลี่ยนไอเดียการจัดการขยะในบ้าน รับ Green Points ทันที
                </p>
                <Link
                  href="/#reviews"
                  className="inline-flex items-center gap-1 text-primary font-display font-bold text-xs sm:text-sm mt-1 hover:underline"
                >
                  <span>สำรวจรีวิวของเพื่อนสมาชิก</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Feature 3: Interactive Greeny Chat AI Assistant */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-6 items-center hover:shadow-lg transition-all duration-300">
              <div className="w-full md:w-1/2 min-h-64 rounded-2xl overflow-hidden relative bg-surface-container shrink-0 p-4 flex flex-col justify-between border border-outline-variant/20">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                    <div>
                      <div className="font-display font-bold text-xs text-on-surface">
                        Greeny AI Advisor
                      </div>
                      <div className="text-[10px] text-primary font-medium">ออนไลน์พร้อมคำนวณ</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                    {AI_PRESET_QUESTIONS[selectedAiIndex].badge}
                  </span>
                </div>

                {/* Interactive Simulated Chat Bubble */}
                <div className="space-y-2.5 my-3">
                  <div className="p-2.5 rounded-xl bg-surface-container-high text-on-surface text-xs leading-relaxed max-w-[90%] shadow-2xs">
                    💬 &quot;{AI_PRESET_QUESTIONS[selectedAiIndex].q}&quot;
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary text-on-primary text-xs leading-relaxed max-w-[95%] ml-auto shadow-xs">
                    🌱 {AI_PRESET_QUESTIONS[selectedAiIndex].a}
                  </div>
                </div>

                {/* Preset switcher tabs */}
                <div className="flex items-center justify-between gap-1 pt-2 border-t border-outline-variant/20">
                  <div className="flex gap-1">
                    {AI_PRESET_QUESTIONS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedAiIndex(idx)}
                        className={`w-6 h-6 rounded-full text-[11px] font-bold transition-all ${
                          selectedAiIndex === idx
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-lowest"
                        }`}
                        title={`ดูตัวอย่างคำถามที่ ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    คลิกเปลี่ยนคำถามตัวอย่าง
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                  <span className="font-display font-bold text-xs uppercase">
                    Intelligent Material Match
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-on-surface">
                  Greeny Chat AI ผู้ช่วยสเปกบรรจุภัณฑ์
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  ปัญญาประดิษฐ์อัจฉริยะที่ช่วยคำนวณขนาดกล่องพัสดุ แนะนำวัสดุทดแทนพลาสติกตามน้ำหนักสินค้า และประเมินค่าลดคาร์บอน (Carbon Reduction Estimator) ได้แม่นยำ
                </p>
                <Link
                  href="/#chat"
                  className="inline-flex items-center gap-1 text-primary font-display font-bold text-xs sm:text-sm mt-1 hover:underline"
                >
                  <span>ทดลองปรึกษา Greeny AI ฟรี</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Feature 4: Seller & Creator Studio (B2B Hub) */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-6 items-center hover:shadow-lg transition-all duration-300">
              <div className="w-full md:w-1/2 h-64 rounded-2xl overflow-hidden relative bg-surface-container shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8gyCMPCg79-33utV_YSU74fpbrWgdovdWiwYVWiUj9l6g2SQ8wdq7JvFCHA_YueizdH2q_5JqSLUx9wBUP0WnDUrfXHj05Jy04xEPDYzoM1ObL_QdBex2ed13iqO0dqgLFQjWiEyWzkcLUtEcV-ppreYsPYwn8_JM5gE6-NB6irsqv4fR_WSSGOnKzoI54k5dJYfDQhqKfQl8g94TA0u6Snrzcr_BnOlT-0cvovN3b6chqU74yama"
                  alt="B2B Warehouse & Wholesale hub"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary text-on-secondary font-display font-bold text-xs flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[14px]">store</span>
                  <span>B2B Wholesale Hub</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-on-surface/80 backdrop-blur-md text-on-primary flex items-center justify-between text-xs font-bold">
                  <span>สั่งขั้นต่ำ 50 ชิ้น</span>
                  <span className="text-primary-fixed">ราคาส่งโรงงาน</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">handshake</span>
                  <span className="font-display font-bold text-xs uppercase">
                    Affiliate &amp; Wholesale
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-on-surface">
                  Creator &amp; Seller Center
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  สตูดิโอจัดการร้านค้าที่ครบครันสำหรับผู้ประกอบการ สั่งซื้อวัตถุดิบและบรรจุภัณฑ์ราคาส่ง พร้อมระบบ Affiliate สร้างรายได้สำหรับครีเอเตอร์สายรักษ์โลก
                </p>
                <Link
                  href="/seller/dashboard"
                  className="inline-flex items-center gap-1 text-primary font-display font-bold text-xs sm:text-sm mt-1 hover:underline"
                >
                  <span>เข้าสู่ศูนย์บริการผู้ขาย B2B</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: TRENDING ECO-INNOVATIONS & BEST SELLERS
          ========================================================================= */}
      <section className="w-full py-16 lg:py-24 bg-surface border-b border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary font-display font-bold text-xs sm:text-sm uppercase mb-1">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                <span>นวัตกรรมขายดีประจำสัปดาห์</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight">
                สินค้ารักษ์โลกยอดนิยม
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full font-display font-bold text-xs sm:text-sm transition-all ${
                  activeCategory === "all"
                    ? "bg-on-surface text-surface shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setActiveCategory("cushion")}
                className={`px-4 py-2 rounded-full font-display font-bold text-xs sm:text-sm transition-all ${
                  activeCategory === "cushion"
                    ? "bg-on-surface text-surface shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                กันกระแทกชีวภาพ
              </button>
              <button
                onClick={() => setActiveCategory("tableware")}
                className={`px-4 py-2 rounded-full font-display font-bold text-xs sm:text-sm transition-all ${
                  activeCategory === "tableware"
                    ? "bg-on-surface text-surface shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                ภาชนะชานอ้อย/กาบหมาก
              </button>
            </div>
          </div>

          {/* Product Cards Grid (Top Innovations) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border border-outline-variant/30 group"
              >
                <div>
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-surface-container mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-display font-bold text-[10px] shadow-sm">
                      {product.badge}
                    </span>
                    <button
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur flex items-center justify-center text-on-surface hover:text-error transition-colors"
                      title="ถูกใจสินค้า"
                    >
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-on-surface-variant text-xs mb-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      verified
                    </span>
                    <span className="font-medium truncate">{product.producer}</span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Carbon badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-display font-bold text-[10px] mb-3">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      {product.carbonIcon}
                    </span>
                    <span>{product.carbonBadge}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between mt-2">
                  <div>
                    <div className="font-display font-extrabold text-base sm:text-lg text-on-surface flex items-center gap-1.5">
                      <span>฿{product.retailPrice}</span>
                      <span className="text-xs text-on-surface-variant line-through font-normal">
                        ฿{product.originalPrice}
                      </span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant font-medium">
                      ★ {product.rating} ({product.reviewsCount} รีวิว)
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-all shadow-sm active:scale-95"
                    title="เพิ่มลงรถเข็น"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Shop CTA Bar */}
          <div className="mt-12 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-surface-container-highest text-on-surface font-display font-bold text-sm sm:text-base hover:bg-primary-container hover:text-on-primary-container transition-all shadow-xs"
            >
              <span>ดูสินค้าปลอดพลาสติกทั้งหมดกว่า 4,500+ รายการ</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CREATOR & FARMER STORIES (COMMUNITY TESTIMONIALS)
          ========================================================================= */}
      <section className="w-full py-16 lg:py-24 bg-surface-container-low border-b border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="font-display font-bold text-xs sm:text-sm text-primary uppercase tracking-wider">
                Community Testimonials
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight mt-1">
                เสียงจริงจากเกษตรกรและครีเอเตอร์
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md">
              เรื่องราวความสำเร็จจากผู้สร้างการเปลี่ยนแปลงจริง ที่สร้างรายได้และขับเคลื่อนความยั่งยืนบน Greeny
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story 1: Farmer */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-all">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shrink-0 relative">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkuzOrHIQlgTBZiuF45Zo3in6SmO74yEN8AU2v3YLesWnG1rhk6Wo7n3goQHR_BJnCWg1T1i2qsHE-XUTGEGOHouESFSeqC4iNoasiQpoT1qMVrqIdRwzGv8ClWfWF93iFz3T3yIp1pvIjwJE9mjlie-pjhIxlzDYwBALfJqgkb2gToGRf1x-t9hZtZhtmc9MQYmZNh_fePdtPjhp-L3HcgF9Fwm5iI84HXxVJQ8bgeXiGS9nZtzoo"
                      alt="ลุงสนิท บุญส่ง"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-sm sm:text-base text-on-surface">
                      ลุงสนิท บุญส่ง
                    </div>
                    <div className="text-xs text-primary font-bold">
                      สวนดินดี ออร์แกนิค (เชียงใหม่)
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant italic leading-relaxed">
                  &quot;ก่อนหน้านี้ผักสลัดอินทรีย์ของเราต้องขนส่งแบบใส่โฟมสังเคราะห์ ตอนนี้ Greeny เชื่อมเรากับรถขนส่ง EV และให้ใช้กล่องชานอ้อยเก็บความเย็น ลูกค้ากรุงเทพฯ ได้กินผักสดวันรุ่งขึ้นโดยไม่สร้างขยะพลาสติกแม้แต่ชิ้นเดียว&quot;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-on-surface-variant">
                <span>ส่งแล้วกว่า 12,000 ออเดอร์</span>
                <span className="text-primary">Eco-Cert Verified</span>
              </div>
            </div>

            {/* Story 2: Creator */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-all">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shrink-0 relative">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb1ywzWft7eNkVf_rdcRszrxdQXJAerdEK21ufzWQsk9qR77kYLAOXjZM6jl1_H4U0l1SuLci_vTyakBPnu9juI2UspIivJ_l2zbGEdtV5bgCEkQz_-9v-IoQOoXO3WwHd_Znxkzn7JCyunEoZUBQGekk-A42BkF24x-1H5Dckyybf4lNjCYGA_-4JTMMbDYpko7Ag8Utu_-1uXVElaLmmlYF-QMOHhbHcvJOy0EnxL0j-mRa8aTv8"
                      alt="ณภัทร วรเวช"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-sm sm:text-base text-on-surface">
                      ณภัทร วรเวช
                    </div>
                    <div className="text-xs text-primary font-bold">
                      Creator @Napat.EcoLife (24.5k)
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant italic leading-relaxed">
                  &quot;การทำไลฟ์ Greeny Lives ทำให้ผู้ติดตามได้เห็นเลยว่าเม็ดโฟมแป้งข้าวโพดละลายน้ำได้จริง ไม่ใช่แค่คำโฆษณา สร้างความเชื่อมั่นและสร้างรายได้ผ่าน Creator Affiliate สม่ำเสมอทุกเดือน&quot;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-on-surface-variant">
                <span>ยอดช้อปผ่านไลฟ์ 1.8M ฿</span>
                <span className="text-primary">Green Creator Award</span>
              </div>
            </div>

            {/* Story 3: B2B Brand */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-all">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shrink-0 relative">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmhWH_-94MhtMMYgKulzhtwfEFloQFgvIh2AE7TZvoVpVAGHSKOaeA0EUKJntxB67zL12krE8P4zpjtJdlays1OejIVP3xFN-u3AdauCWQ1SNbIC6qKgtAEsEPQ7HqMRCjYj44473fWDCTDTfOUMjrwSybvoZvnWnrPYDeWwvFAmv_KfrTpveNI0mfq7xy-NB_gP6NIDu-nsen4Rs-bd_9vOzPRdBSRJE53xA9vTbv4F8tNE_OEnMd"
                      alt="ดร. กานดา ศิริโชค"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-sm sm:text-base text-on-surface">
                      ดร. กานดา ศิริโชค
                    </div>
                    <div className="text-xs text-primary font-bold">
                      ผู้ก่อตั้ง Green BioPack OEM
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant italic leading-relaxed">
                  &quot;Seller Center ช่วยให้ร้านค้าออนไลน์ขนาดกลางและขนาดย่อมเข้าถึงเรทราคาส่งของวัสดุผักตบชวาได้โดยตรง ทำให้เราสามารถช่วยลดขยะพลาสติกกันกระแทกได้มากกว่า 15 ตันในทุกๆ เดือน&quot;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-on-surface-variant">
                <span>ลดขยะ 15 ตัน/เดือน</span>
                <span className="text-primary">Circular B2B Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: B2B & WHOLESALE PARTNERSHIP BANNER
          ========================================================================= */}
      <section className="w-full py-16 lg:py-20 bg-surface border-b border-outline-variant/20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="relative w-full rounded-3xl bg-inverse-surface text-inverse-on-surface p-8 lg:p-14 overflow-hidden shadow-2xl border border-outline-variant/20">
            {/* Botanical decorative overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden lg:block">
              <svg
                className="w-full h-full text-primary-fixed"
                fill="none"
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  stroke="currentColor"
                  strokeDasharray="8 8"
                  strokeWidth="2"
                />
                <path
                  d="M120 280C120 180 280 140 280 140C280 140 240 300 120 280Z"
                  fill="currentColor"
                  fillOpacity="0.4"
                />
                <path
                  d="M150 250C150 170 270 150 270 150"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </div>

            <div className="relative z-10 max-w-2xl flex flex-col gap-4 sm:gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/10 text-primary-fixed font-display font-bold text-xs">
                <span className="material-symbols-outlined text-[16px]">domain_verification</span>
                <span>สำหรับร้านค้าออนไลน์ คาเฟ่ และธุรกิจ SME</span>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight leading-tight">
                เปลี่ยนร้านค้าของคุณให้เป็น <br />
                <span className="text-primary-fixed font-display">
                  &quot;Green Verified Store&quot; อย่างมืออาชีพ
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-inverse-on-surface/85 leading-relaxed">
                ยกระดับแบรนด์ด้วยบรรจุภัณฑ์รักษ์โลกราคาส่ง B2B สั่งพิมพ์โลโก้หมึกถั่วเหลือง (Soy Ink) ขั้นต่ำต่ำ พร้อมสิทธิ์ใช้งานตรารับรอง Greeny Eco-Certified Badge บนหน้าร้านของคุณฟรี
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/seller/onboarding"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-display font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <span>ลงทะเบียนเปิดร้านค้าสีเขียว</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>

                <button
                  onClick={() => setShowB2BModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface/10 text-inverse-on-surface hover:bg-surface/20 font-display font-bold text-xs sm:text-sm border border-outline-variant/30 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">request_quote</span>
                  <span>ขอใบเสนอราคาส่ง B2B</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-inverse-on-surface/75 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                    done
                  </span>
                  <span>ออกใบกำกับภาษีเต็มรูปแบบ e-Tax</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                    done
                  </span>
                  <span>เครดิตเทอม 30 วันสำหรับนิติบุคคล</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                    done
                  </span>
                  <span>รายงานคำนวณ Carbon Footprint ฟรี</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: INTERACTIVE ECO GUIDE & NEWSLETTER
          ========================================================================= */}
      <section className="w-full py-16 lg:py-20 bg-surface-container-low">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2 max-w-xl text-left">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
                <span className="font-display font-bold text-xs uppercase tracking-wider">
                  Free Eco-Packaging Guidebook
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl sm:text-3xl text-on-surface">
                รับฟรี! คู่มือการเลือกวัสดุชีวภาพปี 2025 และโค้ดส่วนลด ฿100
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                สมัครรับจดหมายข่าวนวัตกรรมกรีน รายงานแนวโน้มวัสดุย่อยสลาย และรับรหัสคูปอง{" "}
                <button
                  onClick={copyCouponCode}
                  className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-extrabold hover:bg-secondary hover:text-white transition-colors"
                  title="คลิกเพื่อคัดลอกโค้ด"
                >
                  {copiedCoupon ? "คัดลอกแล้ว! ✓" : "ECO10"}
                </button>{" "}
                สำหรับสั่งซื้อครั้งแรก
              </p>
            </div>

            <div className="w-full lg:w-auto">
              {!isSubscribed ? (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-2.5 items-stretch"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="กรอกอีเมลสำหรับรับคู่มือ PDF"
                    className="px-5 py-3.5 rounded-full bg-surface-container text-on-surface placeholder:text-outline text-xs sm:text-sm min-w-[280px] focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
                  />
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-display font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                  >
                    <span>รับคู่มือและโค้ดลด</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-secondary-container text-on-secondary-container border border-outline-variant/30 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    mark_email_read
                  </span>
                  <div>
                    <div className="font-display font-bold text-sm">ส่งคู่มือไปยังอีเมลแล้ว!</div>
                    <div className="text-xs">
                      ใช้โค้ดลด <span className="font-bold underline">ECO10</span> ที่หน้าชำระเงิน
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          B2B QUOTATION MODAL
          ========================================================================= */}
      {showB2BModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-outline-variant/30 shadow-2xl relative">
            <button
              onClick={() => {
                setShowB2BModal(false);
                setB2bSubmitted(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {!b2bSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setB2bSubmitted(true);
                }}
                className="flex flex-col gap-4 text-left"
              >
                <div className="flex items-center gap-2 text-primary font-display font-bold text-xs uppercase">
                  <span className="material-symbols-outlined text-[20px]">store</span>
                  <span>Greeny B2B Wholesale Request</span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-on-surface">
                  ขอใบเสนอราคาส่ง &amp; สั่งผลิตแบรนด์คุณ
                </h3>
                <p className="text-xs text-on-surface-variant">
                  เจ้าหน้าที่ฝ่าย B2B จะติดต่อกลับพร้อมเอกสารสเปกวัสดุและตารางราคาส่งขั้นบันไดภายใน 24 ชม.
                </p>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    ชื่อธุรกิจ / แบรนด์ร้านค้า
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ร้านคาเฟ่ Organic Daily, หรือ SME ช็อป"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      required
                      placeholder="08X-XXX-XXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">อีเมลติดต่อ</label>
                    <input
                      type="email"
                      required
                      placeholder="business@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    วัสดุหรือประเภทที่สนใจ
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>แผ่นผักตบชวากันกระแทก (ขั้นต่ำ 50 ม้วน)</option>
                    <option>เม็ดโฟมแป้งข้าวโพดละลายน้ำ (ขั้นต่ำ 20 ลัง)</option>
                    <option>จานชามกาบหมากและชานอ้อย (ขั้นต่ำ 500 ชิ้น)</option>
                    <option>สั่งพิมพ์โลโก้หมึกถั่วเหลือง Soy Ink บนกล่องคราฟท์</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-display font-bold text-sm shadow-md transition-all mt-2"
                >
                  ส่งข้อมูลขอใบเสนอราคา
                </button>
              </form>
            ) : (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px]">check</span>
                </div>
                <h4 className="font-display font-extrabold text-xl text-on-surface">
                  ได้รับข้อมูลเรียบร้อยแล้ว!
                </h4>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  ทีมงาน B2B Greeny จะจัดส่งใบเสนอราคาและสเปกวัสดุไปยังอีเมลของคุณโดยเร็วที่สุด ขอบคุณที่ร่วมสร้างธุรกิจสีเขียวครับ
                </p>
                <button
                  onClick={() => setShowB2BModal(false)}
                  className="mt-2 px-6 py-2 rounded-full bg-surface-container text-on-surface font-bold text-xs"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
