import { ProductListing, MandiPriceItem, UserProfile, Order, GovtScheme } from '../types';

export const initialFarmers: UserProfile[] = [
  {
    id: "f1",
    name: "Rameshwar Patel",
    phone: "+91 98765 43210",
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
    id: "f3",
    name: "Mallesham Reddy",
    phone: "+91 94401 22334",
    role: "farmer",
    villageOrCity: "Siddipet",
    district: "Siddipet",
    state: "Telangana",
    distanceKm: 14.5,
    rating: 4.7,
    reviewsCount: 29,
    verified: true,
    farmSizeAcres: 5.0,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "f4",
    name: "Lakshmi Narayana",
    phone: "+91 99887 11223",
    role: "farmer",
    villageOrCity: "Vikarabad",
    district: "Vikarabad",
    state: "Telangana",
    distanceKm: 19.2,
    rating: 5.0,
    reviewsCount: 16,
    verified: true,
    farmSizeAcres: 6.2,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  }
];

export const initialProductListings: ProductListing[] = [
  {
    id: "p1",
    farmerId: "f1",
    farmerName: "Rameshwar Patel",
    farmerPhone: "+91 98765 43210",
    farmerLocation: "Medak, Telangana",
    distanceKm: 4.2,
    cropName: "Fresh Red Tomatoes (நாட்டு தக்காளி / టమోటా)",
    category: "Vegetable",
    pricePerKg: 22,
    mandiPricePerKg: 32,
    quantityAvailableKg: 450,
    minimumOrderKg: 20,
    harvestDate: "Today (Morning 6 AM)",
    organic: true,
    description: "Plucked fresh today morning. Firm red tomatoes with long shelf life. Grown without harmful pesticides using vermicompost.",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    qualityGrade: "Grade A (Premium)",
    createdAt: "2026-07-22T06:30:00Z"
  },
  {
    id: "p2",
    farmerId: "f2",
    farmerName: "Gurpreet Singh",
    farmerPhone: "+91 98123 76543",
    farmerLocation: "Rangareddy, Telangana",
    distanceKm: 8.7,
    cropName: "Nasik Grade Red Onions (उल्ली / प्याज)",
    category: "Vegetable",
    pricePerKg: 28,
    mandiPricePerKg: 38,
    quantityAvailableKg: 1200,
    minimumOrderKg: 50,
    harvestDate: "Yesterday",
    organic: false,
    description: "Medium to large dry onions, fully cured and ready for bulk transport or retail sales.",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    qualityGrade: "Grade A (Premium)",
    createdAt: "2026-07-21T14:00:00Z"
  },
  {
    id: "p3",
    farmerId: "f3",
    farmerName: "Mallesham Reddy",
    farmerPhone: "+91 94401 22334",
    farmerLocation: "Siddipet, Telangana",
    distanceKm: 14.5,
    cropName: "Green Chillies (పచ్చిమిర్చి / हरी मिर्च)",
    category: "Spices",
    pricePerKg: 45,
    mandiPricePerKg: 62,
    quantityAvailableKg: 280,
    minimumOrderKg: 10,
    harvestDate: "Today",
    organic: true,
    description: "Spicy dark green chillies fresh harvested. High oil content, ideal for hotels, wholesale mandis, and local retailers.",
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
    qualityGrade: "Grade A (Premium)",
    createdAt: "2026-07-22T08:15:00Z"
  },
  {
    id: "p4",
    farmerId: "f4",
    farmerName: "Lakshmi Narayana",
    farmerPhone: "+91 99887 11223",
    farmerLocation: "Vikarabad, Telangana",
    distanceKm: 19.2,
    cropName: "Fresh Spinach & Coriander (పాలకూర & కొత్తిమీర)",
    category: "Greens",
    pricePerKg: 18,
    mandiPricePerKg: 28,
    quantityAvailableKg: 150,
    minimumOrderKg: 15,
    harvestDate: "Today (Morning 5 AM)",
    organic: true,
    description: "Crisp leafy greens harvested at dawn. Tender leaves with rich aroma and rich iron content.",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    qualityGrade: "Grade A (Premium)",
    createdAt: "2026-07-22T05:00:00Z"
  },
  {
    id: "p5",
    farmerId: "f1",
    farmerName: "Rameshwar Patel",
    farmerPhone: "+91 98765 43210",
    farmerLocation: "Medak, Telangana",
    distanceKm: 4.2,
    cropName: "Crisp Green Brinjal / Eggplant (వంకాయ)",
    category: "Vegetable",
    pricePerKg: 24,
    mandiPricePerKg: 35,
    quantityAvailableKg: 350,
    minimumOrderKg: 25,
    harvestDate: "Yesterday",
    organic: false,
    description: "Shiny green round brinjals without seeds. Excellent cooking texture.",
    imageUrl: "https://images.unsplash.com/photo-1628773822503-930a8585e33b?w=600&auto=format&fit=crop&q=80",
    qualityGrade: "Grade B (Standard)",
    createdAt: "2026-07-21T11:30:00Z"
  }
];

export const initialMandiPrices: MandiPriceItem[] = [
  {
    id: "m1",
    cropName: "Tomato (Red)",
    marketName: "G bowli APMC Mandi, Hyderabad",
    state: "Telangana",
    minPrice: 28,
    maxPrice: 36,
    modalPrice: 32,
    trend: "up",
    changePercent: 6.5,
    lastUpdated: "Today 10:00 AM"
  },
  {
    id: "m2",
    cropName: "Onion (Medium)",
    marketName: "Bowenpally Market, Secunderabad",
    state: "Telangana",
    minPrice: 32,
    maxPrice: 42,
    modalPrice: 38,
    trend: "stable",
    changePercent: 0.0,
    lastUpdated: "Today 09:30 AM"
  },
  {
    id: "m3",
    cropName: "Potato (Jyoti)",
    marketName: "Koyambedu Wholesale, Chennai",
    state: "Tamil Nadu",
    minPrice: 22,
    maxPrice: 28,
    modalPrice: 25,
    trend: "down",
    changePercent: -3.2,
    lastUpdated: "Today 08:45 AM"
  },
  {
    id: "m4",
    cropName: "Green Chilli",
    marketName: "Guntur Mirchi Yard",
    state: "Andhra Pradesh",
    minPrice: 55,
    maxPrice: 70,
    modalPrice: 62,
    trend: "up",
    changePercent: 8.1,
    lastUpdated: "Today 11:15 AM"
  },
  {
    id: "m5",
    cropName: "Brinjal (Eggplant)",
    marketName: "Yeshwanthpur APMC, Bengaluru",
    state: "Karnataka",
    minPrice: 28,
    maxPrice: 38,
    modalPrice: 34,
    trend: "stable",
    changePercent: 1.2,
    lastUpdated: "Today 09:00 AM"
  }
];

export const initialOrders: Order[] = [
  {
    id: "ORD-9012",
    listingId: "p1",
    cropName: "Fresh Red Tomatoes",
    cropImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    farmerId: "f1",
    farmerName: "Rameshwar Patel",
    farmerPhone: "+91 98765 43210",
    sellerId: "s1",
    sellerName: "Sri Krishna Vegetable Retail",
    sellerPhone: "+91 91234 56789",
    deliveryAddress: "Shop #14, Rythu Bazar, Kukatpally, Hyderabad",
    quantityKg: 100,
    pricePerKg: 22,
    totalAmount: 2350, // 2200 + 150 transport
    status: "In Transit",
    transportOptIn: true,
    paymentStatus: "Paid via UPI",
    orderDate: "2026-07-22 08:30 AM",
    estimatedDelivery: "Today, 02:00 PM"
  },
  {
    id: "ORD-8841",
    listingId: "p3",
    cropName: "Green Chillies",
    cropImage: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
    farmerId: "f3",
    farmerName: "Mallesham Reddy",
    farmerPhone: "+91 94401 22334",
    sellerId: "s1",
    sellerName: "Sri Krishna Vegetable Retail",
    sellerPhone: "+91 91234 56789",
    deliveryAddress: "Shop #14, Rythu Bazar, Kukatpally, Hyderabad",
    quantityKg: 30,
    pricePerKg: 45,
    totalAmount: 1350,
    status: "Accepted",
    transportOptIn: false,
    paymentStatus: "Pending UPI",
    orderDate: "2026-07-22 09:45 AM",
    estimatedDelivery: "Tomorrow, 10:00 AM"
  }
];

export const govtSchemes: GovtScheme[] = [
  {
    id: "sch1",
    title: "PM-KISAN Samman Nidhi",
    category: "Direct Income Support",
    description: "Provides financial benefit of ₹6,000 per year in three equal installments to all landholding farmers' families.",
    eligibility: "Small & Marginal Farmers with cultivable landholding",
    benefit: "₹6,000 / year direct bank transfer (DBT)",
    applyLink: "https://pmkisan.gov.in"
  },
  {
    id: "sch2",
    title: "PM Fasal Bima Yojana (PMFBY)",
    category: "Crop Insurance",
    description: "Comprehensive risk coverage for crops against natural non-preventable risks from pre-sowing to post-harvest.",
    eligibility: "All farmers growing notified crops in notified areas",
    benefit: "Max 2% premium for Kharif and 1.5% for Rabi crops",
    applyLink: "https://pmfby.gov.in"
  },
  {
    id: "sch3",
    title: "Soil Health Card Scheme",
    category: "Soil & Nutrient Testing",
    description: "Helps farmers test soil health and receive customized recommendations on fertilizer doses for maximum yield.",
    eligibility: "All agricultural land holders",
    benefit: "Free soil testing and customized N-P-K report card",
    applyLink: "https://soilhealth.dac.gov.in"
  },
  {
    id: "sch4",
    title: "Sub-Mission on Agricultural Mechanization (SMAM)",
    category: "Subsidized Equipment",
    description: "Assistance for purchasing tractors, harvesters, seeders, and drone sprayers at subsidized rates.",
    eligibility: "Farmer Groups, FPOs, and Individual Farmers",
    benefit: "40% to 50% subsidy on farm machinery",
    applyLink: "https://agrimachinery.nic.in"
  }
];

export const sampleDiseasePhotos = [
  {
    name: "Tomato Late Blight (ఆకు మచ్చ / లేట్ బ్లైట్)",
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=500&auto=format&fit=crop&q=80",
    crop: "Tomato",
    symptoms: "Water-soaked dark lesions on leaves, white mold underneath during high humidity.",
    organic: "Spray 5% Neem leaf extract or diluted sour buttermilk emulsion every 7 days.",
    chemical: "Apply Copper Oxychloride 3g/L or Mancozeb 2g/L water."
  },
  {
    name: "Cotton Leaf Curl Virus (ఆకు చుట్ట వ్యాధి)",
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&auto=format&fit=crop&q=80",
    crop: "Cotton / Chilli",
    symptoms: "Upward curling of leaves, leaf thickening, stunted plant growth.",
    organic: "Yellow sticky traps (10/acre) to catch whiteflies, spray Panchagavya.",
    chemical: "Spray Imidacloprid 17.8 SL @ 0.5 ml/L to control whitefly vector."
  },
  {
    name: "Rice Blast / Leaf Spot (వరి అగ్గి తెగులు)",
    imageUrl: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=500&auto=format&fit=crop&q=80",
    crop: "Paddy / Rice",
    symptoms: "Eye-shaped spindle lesions with brownish margins on leaf blades.",
    organic: "Spray Trichoderma viride @ 5g/L or vermiwash spray.",
    chemical: "Spray Tricyclazole 75 WP @ 0.6g/L."
  }
];
