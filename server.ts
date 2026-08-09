import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import {
  initialProductListings,
  initialOrders,
  initialMandiPrices,
  initialFarmers,
  govtSchemes
} from "./src/data/mockData.ts";
import { ProductListing, Order, ChatMessage, UserProfile, UserRole } from "./src/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Firebase App & Storage
const firebaseConfig = {
  apiKey: "AIzaSyCOk3__UnHjvGFGx43oHKULxQXPpnQ2NyE",
  authDomain: "krishisetu-a42bb.firebaseapp.com",
  projectId: "krishisetu-a42bb",
  storageBucket: "krishisetu-a42bb.firebasestorage.app",
  messagingSenderId: "106050532437",
  appId: "1:106050532437:web:a4d9676c7aaf14b4a3d0dc",
  measurementId: "G-SH6CR13JQT"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(firebaseApp);
const JWT_SECRET = process.env.JWT_SECRET || "kisan_direct_jwt_secret_key_2026_safe";

// User Database Model
interface UserRecord extends UserProfile {
  passwordHash: string;
}

const defaultPasswordHash = bcrypt.hashSync("password123", 10);

let users: UserRecord[] = [
  {
    id: "f1",
    name: "Rameshwar Patel",
    phone: "+91 98765 43210",
    passwordHash: defaultPasswordHash,
    role: "farmer",
    villageOrCity: "Medak",
    district: "Medak",
    state: "Telangana",
    distanceKm: 4.2,
    rating: 4.9,
    reviewsCount: 38,
    verified: true,
    farmSizeAcres: 8.5,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "f2",
    name: "Gurpreet Singh",
    phone: "+91 98123 76543",
    passwordHash: defaultPasswordHash,
    role: "farmer",
    villageOrCity: "Rangareddy",
    district: "Rangareddy",
    state: "Telangana",
    distanceKm: 8.7,
    rating: 4.8,
    reviewsCount: 52,
    verified: true,
    farmSizeAcres: 12.0,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "s1",
    name: "Sri Krishna Traders",
    phone: "+91 91234 56789",
    passwordHash: defaultPasswordHash,
    role: "seller",
    villageOrCity: "Kukatpally",
    district: "Hyderabad",
    state: "Telangana",
    shopName: "Sri Krishna Vegetable Retail",
    rating: 4.8,
    reviewsCount: 24,
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "admin1",
    name: "APMC Mandi Administrator",
    phone: "+91 99000 00000",
    passwordHash: defaultPasswordHash,
    role: "admin",
    villageOrCity: "Gachibowli",
    district: "Hyderabad",
    state: "Telangana",
    rating: 5.0,
    reviewsCount: 100,
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  }
];

// Authentication Middleware
interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    phone: string;
    role: UserRole;
    name: string;
  };
}

const authMiddleware = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Authentication JWT token required." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired JWT access token." });
  }
};

const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden. Requires one of roles: ${roles.join(", ")}` });
    }
    next();
  };
};

// Initialize Gemini Client safely
const getGeminiAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. AI features will fallback to smart mock responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// In-Memory Database
let productListings: ProductListing[] = [...initialProductListings];
let orders: Order[] = [...initialOrders];
let mandiPrices = [...initialMandiPrices];
let messages: ChatMessage[] = [
  {
    id: "msg-1",
    orderId: "ORD-9012",
    senderId: "s1",
    senderName: "Sri Krishna Vegetable Retail",
    recipientId: "f1",
    text: "Namaste Rameshwar ji! Are the tomatoes loaded in the auto rickshaw?",
    timestamp: "2026-07-22T08:35:00Z"
  },
  {
    id: "msg-2",
    orderId: "ORD-9012",
    senderId: "f1",
    senderName: "Rameshwar Patel",
    recipientId: "s1",
    text: "Namaste! Yes, 100 kg packed in 4 crates. Transport vehicle has left Medak farm at 8:45 AM.",
    timestamp: "2026-07-22T08:48:00Z"
  }
];

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "KisanDirect Marketplace" });
});

// AUTHENTICATION APIS (JWT + BCrypt)
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      phone,
      password,
      role,
      villageOrCity,
      district,
      state,
      farmSizeAcres,
      shopName,
      avatarUrl,
      verificationDocumentUrl
    } = req.body;

    if (!name || !phone || !password || !role) {
      return res.status(400).json({ error: "Missing required registration fields: name, phone, password, role" });
    }

    const cleanPhone = phone.trim();
    const normalizePhone = (p: string) => {
      const digits = p.replace(/\D/g, '');
      return digits.length >= 10 ? digits.slice(-10) : digits;
    };
    const normalizedInput = normalizePhone(cleanPhone);

    if (users.some(u => normalizePhone(u.phone) === normalizedInput)) {
      return res.status(400).json({ error: "An account with this phone number already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = (role === 'farmer' ? 'f_' : role === 'seller' ? 's_' : 'admin_') + Date.now();

    const newUser: UserRecord = {
      id: userId,
      name,
      phone: cleanPhone,
      passwordHash,
      role: role as UserRole,
      villageOrCity: villageOrCity || "Telangana",
      district: district || "Hyderabad",
      state: state || "Telangana",
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      farmSizeAcres: farmSizeAcres ? Number(farmSizeAcres) : undefined,
      shopName: shopName || undefined,
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      verificationDocumentUrl
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, phone: newUser.phone, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { passwordHash: _, ...publicUser } = newUser;
    res.status(201).json({ token, user: publicUser });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "Phone number and password are required." });
    }

    const cleanPhone = phone.trim();
    const normalizePhone = (p: string) => {
      const digits = p.replace(/\D/g, '');
      return digits.length >= 10 ? digits.slice(-10) : digits;
    };
    const targetDigits = normalizePhone(cleanPhone);
    const user = users.find(u => normalizePhone(u.phone) === targetDigits || u.phone === cleanPhone);
    if (!user) {
      return res.status(401).json({ error: "Invalid phone number or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid phone number or password." });
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { passwordHash: _, ...publicUser } = user;
    res.json({ token, user: publicUser });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = users.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: "User profile not found" });
  }
  const { passwordHash, ...publicUser } = user;
  res.json(publicUser);
});

// FIREBASE STORAGE UPLOAD API
app.post("/api/upload", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { base64Data, folder, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: "base64Data is required for file upload" });
    }

    const validFolders = ['farmers', 'sellers', 'products', 'documents'];
    const targetFolder = validFolders.includes(folder) ? folder : 'products';

    const timestamp = Date.now();
    const safeName = fileName ? fileName.replace(/[^a-zA-Z0-9.-]/g, '_') : `upload_${timestamp}.jpg`;
    const storagePath = `${targetFolder}/${timestamp}_${safeName}`;

    const storageRef = ref(firebaseStorage, storagePath);
    await uploadString(storageRef, base64Data, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);

    // Return ONLY the Firebase download URL
    res.status(201).json({
      success: true,
      fileUrl: downloadUrl,
      folder: targetFolder,
      path: storagePath
    });
  } catch (err: any) {
    console.error("Firebase Storage Upload Error:", err);
    res.status(500).json({ error: "Failed to upload file to Firebase Storage", details: err.message });
  }
});

app.delete("/api/files/delete", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ error: "fileUrl is required" });
    }

    const fileRef = ref(firebaseStorage, fileUrl);
    await deleteObject(fileRef);
    res.json({ success: true, message: "File deleted successfully from Firebase Storage" });
  } catch (err: any) {
    console.error("Delete file error:", err);
    res.status(500).json({ error: "Failed to delete file from Firebase Storage", details: err.message });
  }
});

// Product Listings
app.get("/api/listings", (req, res) => {
  const { category, search, maxDistance, minPrice, maxPrice } = req.query;
  let filtered = [...productListings];

  if (category && category !== "all" && typeof category === "string") {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      p => p.cropName.toLowerCase().includes(q) ||
           p.farmerName.toLowerCase().includes(q) ||
           p.farmerLocation.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q)
    );
  }

  if (maxDistance && !isNaN(Number(maxDistance))) {
    filtered = filtered.filter(p => p.distanceKm <= Number(maxDistance));
  }

  res.json(filtered);
});

app.post("/api/listings", (req, res) => {
  const newListing: ProductListing = {
    id: "p_" + Date.now(),
    farmerId: req.body.farmerId || "f1",
    farmerName: req.body.farmerName || "Rameshwar Patel",
    farmerPhone: req.body.farmerPhone || "+91 98765 43210",
    farmerLocation: req.body.farmerLocation || "Medak, Telangana",
    distanceKm: req.body.distanceKm || 5.0,
    cropName: req.body.cropName,
    category: req.body.category || "Vegetable",
    pricePerKg: Number(req.body.pricePerKg),
    mandiPricePerKg: req.body.mandiPricePerKg ? Number(req.body.mandiPricePerKg) : Math.round(Number(req.body.pricePerKg) * 1.35),
    quantityAvailableKg: Number(req.body.quantityAvailableKg),
    minimumOrderKg: Number(req.body.minimumOrderKg) || 10,
    harvestDate: req.body.harvestDate || "Freshly Harvested Today",
    organic: Boolean(req.body.organic),
    description: req.body.description || "Fresh harvested produce directly from farm.",
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    qualityGrade: req.body.qualityGrade || "Grade A (Premium)",
    createdAt: new Date().toISOString()
  };

  productListings.unshift(newListing);
  res.status(201).json(newListing);
});

app.delete("/api/listings/:id", (req, res) => {
  const { id } = req.params;
  productListings = productListings.filter(p => p.id !== id);
  res.json({ success: true, id });
});

// Orders
app.get("/api/orders", (req, res) => {
  const { farmerId, sellerId } = req.query;
  let result = [...orders];
  if (farmerId) {
    result = result.filter(o => o.farmerId === farmerId);
  }
  if (sellerId) {
    result = result.filter(o => o.sellerId === sellerId);
  }
  res.json(result);
});

app.post("/api/orders", (req, res) => {
  const listing = productListings.find(p => p.id === req.body.listingId);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const qty = Number(req.body.quantityKg);
  if (qty > listing.quantityAvailableKg) {
    return res.status(400).json({ error: "Requested quantity exceeds available stock" });
  }

  const transportFee = req.body.transportOptIn ? 150 : 0;
  const total = (qty * listing.pricePerKg) + transportFee;

  const newOrder: Order = {
    id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
    listingId: listing.id,
    cropName: listing.cropName,
    cropImage: listing.imageUrl,
    farmerId: listing.farmerId,
    farmerName: listing.farmerName,
    farmerPhone: listing.farmerPhone,
    sellerId: req.body.sellerId || "s1",
    sellerName: req.body.sellerName || "Sri Krishna Vegetable Retail",
    sellerPhone: req.body.sellerPhone || "+91 91234 56789",
    deliveryAddress: req.body.deliveryAddress || "Rythu Bazar, Kukatpally, Hyderabad",
    quantityKg: qty,
    pricePerKg: listing.pricePerKg,
    totalAmount: total,
    status: "Pending",
    transportOptIn: Boolean(req.body.transportOptIn),
    paymentStatus: req.body.paymentMethod === "UPI" ? "Paid via UPI" : "Cash on Delivery",
    orderDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    estimatedDelivery: "Tomorrow by 11:00 AM"
  };

  // Reduce available quantity on listing
  listing.quantityAvailableKg -= qty;

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.patch("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status, ratingGiven, reviewText } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (status) order.status = status;
  if (ratingGiven) order.ratingGiven = ratingGiven;
  if (reviewText) order.reviewText = reviewText;

  res.json(order);
});

// Mandi Prices & Govt Schemes
app.get("/api/mandi-prices", (req, res) => {
  res.json(mandiPrices);
});

app.get("/api/govt-schemes", (req, res) => {
  res.json(govtSchemes);
});

// Chat Messages
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const msg: ChatMessage = {
    id: "msg-" + Date.now(),
    orderId: req.body.orderId,
    senderId: req.body.senderId,
    senderName: req.body.senderName,
    recipientId: req.body.recipientId,
    text: req.body.text,
    timestamp: new Date().toISOString()
  };
  messages.push(msg);
  res.status(201).json(msg);
});

// ----------------------------------------------------
// AI ENDPOINTS (Server-Side Gemini Integration)
// ----------------------------------------------------

// AI Crop Disease Diagnostic Doctor
app.post("/api/ai/disease-check", async (req, res) => {
  try {
    const { cropName, imageBase64, userNotes } = req.body;
    const ai = getGeminiAi();

    if (!ai) {
      // Fallback response if no API key is set
      return res.json({
        cropName: cropName || "Tomato / General Crop",
        diseaseName: "Tomato Late Blight (Phytophthora infestans)",
        confidence: 0.94,
        severity: "Moderate",
        symptoms: [
          "Irregular dark green water-soaked spots on leaves",
          "White fungal mildew growth underneath leaf in moist weather",
          "Brown firm decay spots appearing on fruits"
        ],
        organicTreatment: [
          "Spray 5% Neem oil emulsion thoroughly covering both sides of leaves",
          "Apply diluted sour curd/buttermilk whey (1:10 ratio) every 5 days",
          "Remove and safely burn severely infected lower branches to stop spread"
        ],
        chemicalTreatment: [
          "Spray Copper Oxychloride 50 WP @ 3 grams per liter water",
          "In case of heavy infestation: Spray Mancozeb 75 WP @ 2.5 grams/liter"
        ],
        preventiveMeasures: [
          "Ensure wide spacing between plants for free air ventilation",
          "Avoid overhead watering; use drip irrigation at soil level",
          "Rotate crop with legumes or non-solanaceous crops next season"
        ]
      });
    }

    const systemInstruction = `You are an expert AI Agricultural Plant Pathologist and Agronomist. Analyze crop leaf health and diagnose diseases. Provide output ONLY in strictly valid JSON format.`;

    const prompt = `Diagnose crop health for: ${cropName || 'Crop'}. User note: "${userNotes || ''}".
Return JSON object matching this schema:
{
  "cropName": string,
  "diseaseName": string,
  "confidence": number between 0 and 1,
  "severity": "Low" | "Moderate" | "High" | "Severe",
  "symptoms": string[],
  "organicTreatment": string[],
  "chemicalTreatment": string[],
  "preventiveMeasures": string[]
}`;

    const parts: any[] = [];
    if (imageBase64) {
      // Extract pure base64
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in AI Disease Check:", err);
    res.status(500).json({ error: "Failed to perform AI disease check", details: err.message });
  }
});

// AI Price Trend Predictor
app.post("/api/ai/price-predict", async (req, res) => {
  try {
    const { cropName, region } = req.body;
    const ai = getGeminiAi();

    if (!ai) {
      return res.json({
        cropName: cropName || "Red Tomato",
        currentPrice: 28,
        predictedPrice7Days: 34,
        predictedPrice14Days: 38,
        trendDirection: "rising",
        confidenceScore: 0.89,
        keyFactors: [
          "Monsoon rainfall delay causing reduced harvest arrivals in nearby Mandis",
          "Increased wholesale demand from hotel chains and city supermarkets",
          "Transport diesel price stability in South India states"
        ],
        recommendation: "Hold 30% of harvest for 5 days. Prices are expected to peak due to supply shortfall in wholesale yards."
      });
    }

    const prompt = `Provide an agricultural AI price forecast for crop: "${cropName || 'Tomatoes'}" in region: "${region || 'Telangana / AP'}".
Return strictly JSON with schema:
{
  "cropName": string,
  "currentPrice": number,
  "predictedPrice7Days": number,
  "predictedPrice14Days": number,
  "trendDirection": "rising" | "falling" | "stable",
  "confidenceScore": number,
  "keyFactors": string[],
  "recommendation": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in AI Price Predict:", err);
    res.status(500).json({ error: "Failed to generate price prediction", details: err.message });
  }
});

// Multilingual Kisan Mitra AI Assistant
app.post("/api/ai/advisory-chat", async (req, res) => {
  try {
    const { query, language, userRole } = req.body;
    const ai = getGeminiAi();

    if (!ai) {
      return res.json({
        reply: `Namaste! Regarding "${query}": To get the best price for your produce without brokers, ensure proper grading, list fresh harvest early in the morning on KisanDirect, and keep mandi rates as reference. (Language: ${language || 'English'})`,
        suggestedActions: ["View Live Mandi Prices", "Scan Crop for Disease", "List New Crop"]
      });
    }

    const langNameMap: Record<string, string> = {
      te: "Telugu",
      hi: "Hindi",
      ta: "Tamil",
      kn: "Kannada",
      mr: "Marathi",
      en: "English"
    };

    const targetLang = langNameMap[language] || "English";

    const systemInstruction = `You are 'Kisan Mitra' (किसान मित्र / రైతు మిత్రుడు), an empathetic, knowledgeable agricultural AI assistant helping Indian farmers and local vegetable sellers.
Respond directly in the requested language (${targetLang}) using clear, simple words easily understood by rural farmers.
Keep answers concise (max 3-4 bullet points or short paragraphs).`;

    const prompt = `User query: "${query}"
Language requested: ${targetLang}
Role: ${userRole || 'Farmer'}

Provide response in JSON:
{
  "reply": string (in ${targetLang}),
  "suggestedActions": string[] (3 short action prompts)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in Kisan Mitra Chat:", err);
    res.status(500).json({ error: "Failed to get AI advisory response", details: err.message });
  }
});

// ----------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 KisanDirect Server running on http://localhost:${PORT}`);
  });
}

startServer();
