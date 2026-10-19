import { NextResponse } from "next/server";

export interface CatalogProduct {
  id: string;
  name: string;
  retailPrice: number;
  storeName: string;
  rating: number;
  soldCount: number;
  highlight: string;
  image: string;
  tags: string[];
}

const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod-hyacinth-1",
    name: "ผักตบชวาอบแห้งกันกระแทก 1 กิโลกรัม",
    retailPrice: 59.0,
    storeName: "สวนดินดี ออร์แกนิค",
    rating: 4.95,
    soldCount: 1420,
    highlight: "สะอาด ไร้ฝุ่น อบแสงอาทิตย์ ย่อยสลาย 60 วัน",
    image: "/images/products/hyacinth-cushion.jpg",
    tags: ["general", "lightweight", "hyacinth", "void-fill"],
  },
  {
    id: "prod-coir-1",
    name: "ขุยมะพร้าวอัดแผ่นกันกระแทก (ต้านแรงกด 15 kg)",
    retailPrice: 75.0,
    storeName: "Green Living Crafts Thailand",
    rating: 4.98,
    soldCount: 2150,
    highlight: "ต้านแรงกดทับ 15 kg ผ่านการทดสอบขวดแก้วสมบูรณ์",
    image: "/images/products/coconut-coir.jpg",
    tags: ["glass", "fragile", "heavy", "15kg", "bottle", "ceramic"],
  },
  {
    id: "prod-bagasse-1",
    name: "ถาดชานอ้อยขึ้นรูปกันกระแทกสำหรับขวดแก้ว",
    retailPrice: 65.0,
    storeName: "สวนดินดี ออร์แกนิค",
    rating: 4.85,
    soldCount: 1670,
    highlight: "ล็อคคอขวดและก้นขวด ป้องกันการสั่นสะเทือน",
    image: "/images/products/bagasse-tray.jpg",
    tags: ["bottle", "bagasse", "food", "wine", "cosmetics"],
  },
  {
    id: "prod-cornstarch-1",
    name: "โฟมแป้งข้าวโพดละลายน้ำ (Bio Peanuts)",
    retailPrice: 49.0,
    storeName: "Green Living Crafts Thailand",
    rating: 4.96,
    soldCount: 3100,
    highlight: "ละลายน้ำได้ใน 1 นาที ไร้สารพิษ ปลอดภัย",
    image: "/images/products/cornstarch-peanuts.jpg",
    tags: ["peanut", "cornstarch", "void-fill", "soluble", "dissolvable"],
  },
  {
    id: "prod-mycelium-1",
    name: "แผ่นโฟมเห็ดชีวมวลกันกระแทก (Mycelium Packaging)",
    retailPrice: 89.0,
    storeName: "Green Living Crafts Thailand",
    rating: 4.92,
    soldCount: 540,
    highlight: "โฟมชีวภาพ แข็งแรงเทียบเท่า EPS ย่อยสลาย 45 วัน",
    image: "/images/products/mycelium-foam.jpg",
    tags: ["electronics", "mycelium", "heavy", "gadget", "appliances"],
  },
  {
    id: "prod-honeycomb-1",
    name: "กระดาษคราฟท์รังผึ้งย่อยสลายได้ (Honeycomb)",
    retailPrice: 69.0,
    storeName: "Green Living Crafts Thailand",
    rating: 4.94,
    soldCount: 2800,
    highlight: "ยืดเป็นโครงสร้างรังผึ้ง ล็อคตัวเองไม่ต้องใช้กาว",
    image: "/images/products/honeycomb-paper.jpg",
    tags: ["honeycomb", "kraft", "wrapping", "bakery", "gift"],
  },
];

// Priority list of Gemini models on Google AI Studio
const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = (body.query || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];
    const mode = body.mode || "AI";

    if (!query) {
      return NextResponse.json({ error: "Empty query" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // If Gemini API key is available, call Google AI Studio Gemini API
    if (apiKey) {
      for (const model of GEMINI_MODELS) {
        try {
          const isSupportMode = mode === "SUPPORT";

          const systemPrompt = isSupportMode
            ? `You are "Greeny Bilingual Customer Support Specialist" (ฝ่ายบริการลูกค้าแพลตฟอร์ม Greeny E-Commerce).
You help buyers and sellers with orders, PromptPay QR payments, shipping timelines across Thailand, eco packaging advice, and account issues.
Be polite, warm, and professional.
Respond strictly in valid JSON format matching this schema:
{
  "analysis": "Helpful, friendly answer in Thai (or English if the user asked in English).",
  "translatedText": "Natural translation in the opposite language (English if analysis is Thai, or Thai if analysis is English).",
  "materialRecommended": "NONE",
  "crushResistanceKg": 0,
  "biodegradableDays": 0,
  "recommendedProductIds": []
}`
            : `You are "Greeny Eco-Packaging AI Consultant" (ผู้เชี่ยวชาญด้านบรรจุภัณฑ์ชีวภาพและวัสดุเหลือใช้ทางการเกษตรไทย สำหรับ Greeny E-Commerce).
You help buyers, merchants, and businesses select the ideal sustainable Thai packaging material and products.

Materials available in our catalog:
1. ผักตบชวาอบแห้ง (Water Hyacinth) - prod-hyacinth-1: Lightweight void fill, shock absorption, 60 days biodegradability, crush resistance ~8 kg.
2. ขุยมะพร้าวอัดแผ่น (Coconut Coir Pad) - prod-coir-1: Heavy duty, withstands up to 15 kg crush resistance, excellent for glass, wine bottles, ceramics.
3. ถาดชานอ้อยขึ้นรูป (Bagasse Molding) - prod-bagasse-1: Custom fitted tray for bottles and cosmetic jars, crush resistance ~10 kg.
4. โฟมแป้งข้าวโพดละลายน้ำ (Cornstarch Bio Peanuts) - prod-cornstarch-1: Void fill peanuts that dissolve in water in 60 seconds, non-toxic, crush resistance ~5 kg.
5. แผ่นโฟมเห็ดชีวมวล (Mycelium Foam) - prod-mycelium-1: Bio foam matching expanded polystyrene (EPS) for electronics, appliances, and high-value fragile goods, crush resistance ~18 kg.
6. กระดาษคราฟท์รังผึ้ง (Honeycomb Paper) - prod-honeycomb-1: Stretchable honeycomb structure for bakery, gifts, and cosmetic packaging, crush resistance ~7 kg.

You MUST respond strictly in valid JSON format matching this schema:
{
  "analysis": "Professional, friendly advice in Thai (2-4 sentences) explaining the optimal packaging material, why it fits the item's weight/fragility, and packing advice.",
  "materialRecommended": "HYACINTH" | "COCONUT_COIR" | "BAGASSE" | "CORNSTARCH" | "MYCELIUM" | "HONEYCOMB",
  "crushResistanceKg": number,
  "biodegradableDays": number,
  "recommendedProductIds": string[] (select 1 to 3 IDs strictly from: ["prod-hyacinth-1", "prod-coir-1", "prod-bagasse-1", "prod-cornstarch-1", "prod-mycelium-1", "prod-honeycomb-1"])
}`;

          // Format previous conversation context if provided
          const formattedContents: Array<{ role: "user" | "model"; parts: [{ text: string }] }> = [];

          if (history.length > 0) {
            for (const item of history.slice(-6)) {
              if (item.sender === "USER" || item.role === "user") {
                formattedContents.push({
                  role: "user",
                  parts: [{ text: String(item.text || item.content || "") }],
                });
              } else if (item.sender === "AI" || item.role === "model") {
                formattedContents.push({
                  role: "model",
                  parts: [{ text: String(item.text || item.content || "") }],
                });
              }
            }
          }

          formattedContents.push({
            role: "user",
            parts: [{ text: `User packaging inquiry: "${query}"` }],
          });

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents: formattedContents,
                generationConfig: {
                  temperature: 0.3,
                  responseMimeType: "application/json",
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const responseText =
              geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (responseText) {
              let cleanJson = responseText.trim();
              if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
              } else if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
              }

              const parsed = JSON.parse(cleanJson);

              // Map recommended product IDs to actual catalog products
              let matchedProducts = CATALOG_PRODUCTS.filter((p) =>
                parsed.recommendedProductIds?.includes(p.id)
              );

              // Fallback matching by recommended material if direct IDs weren't matched
              if (matchedProducts.length === 0) {
                const mat = (parsed.materialRecommended || "").toUpperCase();
                if (mat.includes("COIR") || mat.includes("COCONUT")) {
                  matchedProducts = [CATALOG_PRODUCTS[1], CATALOG_PRODUCTS[2]];
                } else if (mat.includes("BAGASSE")) {
                  matchedProducts = [CATALOG_PRODUCTS[2], CATALOG_PRODUCTS[1]];
                } else if (mat.includes("CORNSTARCH")) {
                  matchedProducts = [CATALOG_PRODUCTS[3], CATALOG_PRODUCTS[0]];
                } else if (mat.includes("MYCELIUM")) {
                  matchedProducts = [CATALOG_PRODUCTS[4], CATALOG_PRODUCTS[1]];
                } else if (mat.includes("HONEYCOMB")) {
                  matchedProducts = [CATALOG_PRODUCTS[5], CATALOG_PRODUCTS[0]];
                } else {
                  matchedProducts = [CATALOG_PRODUCTS[0], CATALOG_PRODUCTS[3]];
                }
              }

              return NextResponse.json({
                analysis: parsed.analysis,
                translatedText: parsed.translatedText,
                materialRecommended: parsed.materialRecommended || "HYACINTH",
                crushResistanceKg: parsed.crushResistanceKg || 8,
                biodegradableDays: parsed.biodegradableDays || 60,
                recommendedProducts: matchedProducts,
                source: "google-ai-studio",
                modelUsed: model,
              });
            }
          } else {
            const errBody = await geminiRes.text();
            console.warn(`Gemini model ${model} returned ${geminiRes.status}:`, errBody.slice(0, 150));
          }
        } catch (modelError) {
          console.warn(`Attempt with Gemini model ${model} failed:`, modelError);
        }
      }
    }

    // Fallback rule engine if GEMINI_API_KEY is not set or network fails
    const lowerQuery = query.toLowerCase();
    const isFragile =
      lowerQuery.includes("แก้ว") ||
      lowerQuery.includes("แตก") ||
      lowerQuery.includes("เซรามิก") ||
      lowerQuery.includes("15kg") ||
      lowerQuery.includes("15 กก") ||
      lowerQuery.includes("glass") ||
      lowerQuery.includes("หนัก") ||
      lowerQuery.includes("ไวน์");

    const isBakery =
      lowerQuery.includes("เบเกอรี่") ||
      lowerQuery.includes("ขนม") ||
      lowerQuery.includes("คุกกี้") ||
      lowerQuery.includes("ของขวัญ");

    const isSoluble =
      lowerQuery.includes("ละลาย") ||
      lowerQuery.includes("โฟม") ||
      lowerQuery.includes("cornstarch");

    if (isFragile) {
      return NextResponse.json({
        analysis:
          "สำหรับสินค้าแตกหักง่าย เช่น ขวดแก้ว เซรามิก แนะนำ 'ขุยมะพร้าวอัดแผ่นกันกระแทก' ผ่านการทดสอบรับแรงตกกระทบและแรงกดทับสูงสุด 15 กิโลกรัม ย่อยสลายได้ 100% ภายใน 120 วัน หรือใช้ 'ถาดชานอ้อยขึ้นรูป' ล็อคคอขวดเพื่อความปลอดภัยสูงสุด",
        materialRecommended: "COCONUT_COIR",
        crushResistanceKg: 15,
        biodegradableDays: 120,
        recommendedProducts: [CATALOG_PRODUCTS[1], CATALOG_PRODUCTS[2]],
        source: "local-expert-rules",
      });
    }

    if (isBakery) {
      return NextResponse.json({
        analysis:
          "สำหรับเบเกอรี่ คุกกี้ และของขวัญ แนะนำ 'กระดาษคราฟท์รังผึ้งย่อยสลายได้' โครงสร้างรังผึ้งช่วยล็อคสินค้าให้อยู่กับที่โดยไม่ต้องใช้เทปกาว พร้อมให้ความรู้สึกมินิมอลพรีเมียม",
        materialRecommended: "HONEYCOMB",
        crushResistanceKg: 7,
        biodegradableDays: 45,
        recommendedProducts: [CATALOG_PRODUCTS[5], CATALOG_PRODUCTS[0]],
        source: "local-expert-rules",
      });
    }

    if (isSoluble) {
      return NextResponse.json({
        analysis:
          "สำหรับผู้ที่ต้องการวัสดุย่อยสลายได้รวดเร็ว แนะนำ 'โฟมแป้งข้าวโพดละลายน้ำ (Bio Peanuts)' สามารถละลายน้ำได้หมดจดภายใน 1 นาที ปลอดภัย ไร้สารเคมีตกค้าง และน้ำหนักเบามาก",
        materialRecommended: "CORNSTARCH",
        crushResistanceKg: 5,
        biodegradableDays: 1,
        recommendedProducts: [CATALOG_PRODUCTS[3], CATALOG_PRODUCTS[0]],
        source: "local-expert-rules",
      });
    }

    return NextResponse.json({
      analysis:
        "สำหรับพัสดุทั่วไป แนะนำ 'ผักตบชวาอบแห้ง' หรือ 'โฟมแป้งข้าวโพดละลายน้ำ' น้ำหนักเบา ป้องกันการขยับของสินค้าได้ดีเยี่ยม และเป็นมิตรต่อสิ่งแวดล้อม 100%",
      materialRecommended: "HYACINTH",
      crushResistanceKg: 8,
      biodegradableDays: 60,
      recommendedProducts: [CATALOG_PRODUCTS[0], CATALOG_PRODUCTS[3]],
      source: "local-expert-rules",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process AI query" }, { status: 500 });
  }
}

