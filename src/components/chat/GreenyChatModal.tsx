"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";

interface GreenyChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "AI" | "SUPPORT";
  initialPrompt?: string;
}

interface RecommendedProduct {
  id: string;
  name: string;
  image: string;
  retailPrice: number;
  storeName: string;
  rating: number;
  soldCount: number;
  highlight: string;
}

interface Message {
  id: string;
  sender: "USER" | "AI" | "SUPPORT";
  text: string;
  translatedText?: string;
  recommendedProducts?: RecommendedProduct[];
  crushResistanceKg?: number;
  biodegradableDays?: number;
  source?: string;
  modelUsed?: string;
  timestamp: string;
}

const AI_KNOWLEDGE_BASE: Record<string, { analysis: string; products: RecommendedProduct[] }> = {
  glass: {
    analysis:
      "สำหรับสินค้าเปราะบาง เช่น ขวดแก้ว เซรามิก แนะนำ 'ขุยมะพร้าวอัดแผ่นกันกระแทก' ผ่านการทดสอบรับแรงตกกระทบและแรงกดทับสูงสุด 15 กิโลกรัม ย่อยสลายได้ 100% ภายใน 120 วัน หรือใช้ 'ถาดชานอ้อยขึ้นรูป' ล็อคคอขวดเพื่อความปลอดภัยสูงสุด",
    products: [
      {
        id: "prod-coir-1",
        name: "ขุยมะพร้าวอัดแผ่นกันกระแทก (ต้านแรงกด 15 kg)",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop",
        retailPrice: 75.0,
        storeName: "Green Living Crafts Thailand",
        rating: 4.98,
        soldCount: 2150,
        highlight: "ต้านแรงกดทับ 15 kg ผ่านการทดสอบขวดแก้วสมบูรณ์",
      },
      {
        id: "prod-bagasse-1",
        name: "ถาดชานอ้อยขึ้นรูปกันกระแทกสำหรับขวดแก้ว",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop",
        retailPrice: 65.0,
        storeName: "สวนดินดี ออร์แกนิค",
        rating: 4.85,
        soldCount: 1670,
        highlight: "ล็อคคอขวดและก้นขวด ป้องกันการสั่นสะเทือน",
      },
      {
        id: "prod-mycelium-1",
        name: "แผ่นโฟมเห็ดชีวมวลกันกระแทก (Mycelium)",
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop",
        retailPrice: 89.0,
        storeName: "Green Living Crafts Thailand",
        rating: 4.92,
        soldCount: 540,
        highlight: "โฟมชีวภาพ แข็งแรงเทียบเท่า EPS ย่อยสลาย 45 วัน",
      },
    ],
  },
  default: {
    analysis:
      "สำหรับพัสดุทั่วไป แนะนำ 'ผักตบชวาอบแห้ง' หรือ 'โฟมแป้งข้าวโพดละลายน้ำ' น้ำหนักเบา ป้องกันการขยับของสินค้าได้ดีเยี่ยม และเป็นมิตรต่อสิ่งแวดล้อม 100%",
    products: [
      {
        id: "prod-hyacinth-1",
        name: "ผักตบชวาอบแห้งกันกระแทก 1 กิโลกรัม",
        image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&auto=format&fit=crop",
        retailPrice: 59.0,
        storeName: "สวนดินดี ออร์แกนิค",
        rating: 4.95,
        soldCount: 1420,
        highlight: "สะอาด ไร้ฝุ่น อบแสงอาทิตย์ ย่อยสลาย 60 วัน",
      },
      {
        id: "prod-cornstarch-1",
        name: "โฟมแป้งข้าวโพดละลายน้ำ (Bio Peanuts)",
        image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop",
        retailPrice: 49.0,
        storeName: "Green Living Crafts Thailand",
        rating: 4.96,
        soldCount: 3100,
        highlight: "ละลายน้ำได้ใน 1 นาที ไร้สารพิษ ปลอดภัย",
      },
      {
        id: "prod-honeycomb-1",
        name: "กระดาษคราฟท์รังผึ้งย่อยสลายได้ (Honeycomb)",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop",
        retailPrice: 69.0,
        storeName: "Green Living Crafts Thailand",
        rating: 4.94,
        soldCount: 2800,
        highlight: "ยืดเป็นโครงสร้างรังผึ้ง ล็อคตัวเองไม่ต้องใช้กาว",
      },
    ],
  },
};

export function GreenyChatModal({
  isOpen,
  onClose,
  initialMode = "AI",
  initialPrompt,
}: GreenyChatModalProps) {
  const [mode, setMode] = useState<"AI" | "SUPPORT">(initialMode);
  const [inputText, setInputText] = useState("");
  const { addToCart } = useCart();
  const { formatPrice } = useLocale();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: "msg-ai-1",
      sender: "AI",
      text: "สวัสดีครับ! ผมคือ Greeny Chat AI ผู้ช่วยคำนวณและแนะนำบรรจุภัณฑ์รักษ์โลก 100% ขับเคลื่อนโดย Google AI Studio (Gemini) คุณกำลังจะส่งสินค้าอะไร มีน้ำหนักเท่าไหร่ หรือต้องการคำแนะนำวัสดุแบบไหนครับ?",
      timestamp: "เมื่อสักครู่",
      source: "google-ai-studio",
      modelUsed: "gemini-3.8-flash",
    },
  ]);

  const [supportMessages, setSupportMessages] = useState<Message[]>([
    {
      id: "msg-sup-1",
      sender: "SUPPORT",
      text: "ยินดีต้อนรับสู่ศูนย์บริการลูกค้า Greeny เจ้าหน้าที่พร้อมช่วยเหลือคุณในภาษาไทยและภาษาอังกฤษ",
      translatedText: "Welcome to Greeny Help Center. We provide real-time bilingual support.",
      timestamp: "10:30",
    },
  ]);

  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isSupportThinking, setIsSupportThinking] = useState(false);

  // Sync mode if initialMode changes
  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  // Handle optional initial prompt
  useEffect(() => {
    if (isOpen && initialPrompt && initialPrompt.trim() !== "") {
      handleSendAi(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  // Auto scroll to bottom whenever messages or thinking states change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiMessages, supportMessages, isAiThinking, isSupportThinking, isOpen, mode]);

  if (!isOpen) return null;

  const handleSendAi = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isAiThinking) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "USER",
      text: query,
      timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsAiThinking(true);

    try {
      const historyPayload = aiMessages.slice(-6).map((m) => ({
        role: m.sender === "USER" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/chat/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          history: historyPayload,
          mode: "AI",
        }),
      });

      if (!res.ok) throw new Error("API call failed");

      const data = await res.json();
      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        text: data.analysis || "ระบบได้วิเคราะห์บรรจุภัณฑ์ที่เหมาะสมสำหรับสินค้าของคุณเรียบร้อยแล้ว",
        recommendedProducts: data.recommendedProducts || [],
        crushResistanceKg: data.crushResistanceKg,
        biodegradableDays: data.biodegradableDays,
        source: data.source || "google-ai-studio",
        modelUsed: data.modelUsed,
        timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      };

      setAiMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.warn("Error calling AI API, using local fallback:", err);
      const isFragile = query.includes("แก้ว") || query.includes("แตก") || query.includes("15kg");
      const knowledge = isFragile ? AI_KNOWLEDGE_BASE.glass : AI_KNOWLEDGE_BASE.default;

      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        text: knowledge.analysis,
        recommendedProducts: knowledge.products,
        crushResistanceKg: isFragile ? 15 : 8,
        biodegradableDays: isFragile ? 120 : 60,
        source: "local-expert-rules",
        timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      };

      setAiMessages((prev) => [...prev, aiReply]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleSendSupport = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSupportThinking) return;

    const userMsg: Message = {
      id: `usr-sup-${Date.now()}`,
      sender: "USER",
      text: query,
      timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    };

    setSupportMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsSupportThinking(true);

    try {
      const historyPayload = supportMessages.slice(-6).map((m) => ({
        role: m.sender === "USER" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/chat/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          history: historyPayload,
          mode: "SUPPORT",
        }),
      });

      if (!res.ok) throw new Error("Support API call failed");

      const data = await res.json();
      const supReply: Message = {
        id: `sup-${Date.now()}`,
        sender: "SUPPORT",
        text: data.analysis || "เจ้าหน้าที่ยินดีให้คำปรึกษาเพิ่มเติมตลอด 24 ชั่วโมงครับ",
        translatedText: data.translatedText || "Our customer support team is happy to assist you.",
        timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      };

      setSupportMessages((prev) => [...prev, supReply]);
    } catch (err) {
      const supReply: Message = {
        id: `sup-${Date.now()}`,
        sender: "SUPPORT",
        text: "คุณสามารถเลือกซื้อสินค้าผ่านรถเข็น และชำระเงินด้วย PromptPay QR หรือติดต่อฝ่ายสนับสนุนได้ตลอดเวลาครับ",
        translatedText: "You can purchase items via cart with PromptPay QR or reach out anytime.",
        timestamp: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      };
      setSupportMessages((prev) => [...prev, supReply]);
    } finally {
      setIsSupportThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col h-[680px] max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-surface-container-lowest p-1 rounded-full shadow-2xs border border-outline-variant/30">
            <button
              onClick={() => setMode("AI")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === "AI"
                  ? "bg-primary-container text-on-primary-container shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              <span>Greeny Chat AI</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-primary/15 text-primary font-mono hidden sm:inline">
                Gemini 3.8
              </span>
            </button>
            <button
              onClick={() => setMode("SUPPORT")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === "SUPPORT"
                  ? "bg-forest-slate text-white shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              <span>แชทกับเรา (Support)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
            title="ปิดหน้าต่างแชท"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
          {mode === "AI" ? (
            <>
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "AI" && (
                    <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === "USER"
                          ? "bg-primary-container text-on-primary-container font-medium rounded-tr-xs"
                          : "bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30 rounded-tl-xs"
                      }`}
                    >
                      <div>{msg.text}</div>

                      {/* Technical Packaging Specs Badges */}
                      {(msg.crushResistanceKg || msg.biodegradableDays) && (
                        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-outline-variant/20">
                          {msg.crushResistanceKg ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                              <span className="material-symbols-outlined text-[12px]">fitness_center</span>
                              ต้านแรงกดทับ: ~{msg.crushResistanceKg} kg
                            </span>
                          ) : null}
                          {msg.biodegradableDays ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">
                              <span className="material-symbols-outlined text-[12px]">eco</span>
                              ย่อยสลายได้: ~{msg.biodegradableDays} วัน
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-surface-container text-outline ml-auto">
                            ⚡ Google AI Studio
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Recommended Product Cards from AI */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="space-y-2 mt-2 pt-1">
                        <div className="text-[11px] font-bold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">recommend</span>
                          สินค้าเกษตรรักษ์โลกแนะนำที่เหมาะกับสเปกของคุณ:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {msg.recommendedProducts.map((p) => (
                            <div
                              key={p.id}
                              className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/30 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full aspect-square object-cover rounded-lg bg-surface-container-low mb-1.5"
                              />
                              <div>
                                <h5 className="font-bold text-[11px] text-on-surface line-clamp-1 leading-tight">
                                  {p.name}
                                </h5>
                                <div className="text-[9px] text-on-surface-variant truncate">{p.storeName}</div>
                                <div className="text-[9px] text-primary font-semibold mt-0.5 line-clamp-1">
                                  {p.highlight}
                                </div>
                              </div>
                              <div className="mt-2 pt-1 border-t border-outline-variant/20 flex items-center justify-between">
                                <span className="font-display font-bold text-xs text-primary">
                                  {formatPrice(p.retailPrice)}
                                </span>
                                <button
                                  onClick={() =>
                                    addToCart({
                                      id: p.id,
                                      name: p.name,
                                      image: p.image,
                                      retailPrice: p.retailPrice,
                                      wholesaleTiers: [],
                                      storeName: p.storeName,
                                    })
                                  }
                                  className="p-1 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors"
                                  title="เพิ่มลงรถเข็น"
                                >
                                  <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-outline text-right">{msg.timestamp}</div>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex gap-3 justify-start animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[18px] animate-spin">smart_toy</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30 rounded-tl-xs flex items-center gap-2 text-xs">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    <span>Greeny AI (Google AI Studio) กำลังวิเคราะห์สเปกวัสดุและค้นหาผลิตภัณฑ์...</span>
                  </div>
                </div>
              )}

              {/* Quick AI Suggestion Chips */}
              <div className="pt-2 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  คำถามยอดนิยม (Suggested Prompts):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() =>
                      handleSendAi("ฉันต้องการกันกระแทกแบบโฟมรับแรงกดทับได้ดี สำหรับส่งขวดแก้ว 15kg")
                    }
                    className="text-[11px] bg-surface-container-lowest hover:bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/40 text-on-surface text-left transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>🍾 ขวดแก้ว (ต้านแรงกด 15 kg)</span>
                  </button>
                  <button
                    onClick={() =>
                      handleSendAi("แนะนำบรรจุภัณฑ์ย่อยสลายได้สำหรับร้านเบเกอรี่และของขวัญ")
                    }
                    className="text-[11px] bg-surface-container-lowest hover:bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/40 text-on-surface text-left transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>🥐 เบเกอรี่ & คุกกี้รักษ์โลก</span>
                  </button>
                  <button
                    onClick={() => handleSendAi("วัสดุกันกระแทกที่ละลายน้ำได้ใน 1 นาที มีอะไรบ้าง?")}
                    className="text-[11px] bg-surface-container-lowest hover:bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/40 text-on-surface text-left transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>💧 โฟมแป้งข้าวโพดละลายน้ำ</span>
                  </button>
                  <button
                    onClick={() => handleSendAi("ต้องการแพ็คเครื่องใช้ไฟฟ้าและโน้ตบุ๊กใช้วัสดุอะไรแทนโฟม EPS ขาว?")}
                    className="text-[11px] bg-surface-container-lowest hover:bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/40 text-on-surface text-left transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>📱 โฟมเห็ดชีวมวล (Mycelium)</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Bilingual Support Chat */}
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-primary/20 text-xs text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">translate</span>
                <span>ระบบเปิดใช้งานการแปลอัตโนมัติ 2 ภาษา (Real-time Thai ↔ English AI Support active)</span>
              </div>

              {supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender !== "USER" && (
                    <div className="w-8 h-8 rounded-xl bg-forest-slate text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">support_agent</span>
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-1">
                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm ${
                        msg.sender === "USER"
                          ? "bg-primary-container text-on-primary-container font-medium rounded-tr-xs"
                          : "bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30 rounded-tl-xs"
                      }`}
                    >
                      <div>{msg.text}</div>
                      {msg.translatedText && (
                        <div className="mt-1 pt-1 border-t border-outline-variant/20 text-[11px] text-primary italic flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">translate</span>
                          {msg.translatedText}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-outline text-right">{msg.timestamp}</div>
                  </div>
                </div>
              ))}

              {isSupportThinking && (
                <div className="flex gap-3 justify-start animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-xl bg-forest-slate text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[18px] animate-spin">support_agent</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest text-on-surface shadow-xs border border-outline-variant/30 rounded-tl-xs flex items-center gap-2 text-xs">
                    <span className="inline-block w-2 h-2 rounded-full bg-forest-slate animate-ping"></span>
                    <span>เจ้าหน้าที่กำลังเตรียมคำตอบและแปลภาษาให้คุณ...</span>
                  </div>
                </div>
              )}

              {/* Support Quick Questions */}
              <div className="pt-2 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  คำถามที่พบบ่อย (FAQ):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSendSupport("สั่งซื้อสินค้าและชำระเงินผ่าน PromptPay อย่างไร?")}
                    className="text-[11px] bg-surface-container-lowest hover:bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/40 text-on-surface text-left transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>💳 วิธีชำระเงินด้วย PromptPay</span>
                  </button>
                  <button
                    onClick={() => handleSendSupport("How long does shipping take in Thailand?")}
                    className="text-[11px] bg-surface-container-lowest hover:bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/40 text-on-surface text-left transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>🚚 Shipping Time / ระยะเวลาส่ง</span>
                  </button>
                  <button
                    onClick={() => handleSendSupport("ต้องการเปิดร้านค้าขายบรรจุภัณฑ์เกษตร ต้องทำอย่างไร?")}
                    className="text-[11px] bg-surface-container-lowest hover:bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/40 text-on-surface text-left transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>🏬 เปิดร้านค้า Seller Hub</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Anchor for automatic smooth scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-surface-container-low border-t border-outline-variant/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === "AI") handleSendAi();
              else handleSendSupport();
            }}
            className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-outline-variant/40 shadow-inner focus-within:border-primary transition-colors"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "AI"
                  ? "พิมพ์ถามคำแนะนำ เช่น วัสดุรับแรงกด 15kg สำหรับขวดแก้ว..."
                  : "พิมพ์ข้อความสอบถามเจ้าหน้าที่ (Type in Thai or English)..."
              }
              className="flex-1 bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isAiThinking || isSupportThinking}
              className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary disabled:opacity-40 disabled:hover:bg-primary-container flex items-center justify-center transition-colors shadow-xs shrink-0"
              title="ส่งข้อความ"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

