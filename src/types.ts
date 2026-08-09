export type Language = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'mr';

export type UserRole = 'farmer' | 'seller' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  villageOrCity: string;
  state: string;
  district: string;
  distanceKm?: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  avatarUrl?: string;
  verificationDocumentUrl?: string;
  farmSizeAcres?: number;
  shopName?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface ProductListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  distanceKm: number;
  cropName: string;
  category: 'Vegetable' | 'Fruit' | 'Grain' | 'Greens' | 'Spices';
  pricePerKg: number;
  mandiPricePerKg: number;
  quantityAvailableKg: number;
  minimumOrderKg: number;
  harvestDate: string; // ISO or YYYY-MM-DD
  organic: boolean;
  description: string;
  imageUrl: string;
  qualityGrade: 'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C (Bulk)';
  createdAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  cropName: string;
  cropImage: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  deliveryAddress: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  status: 'Pending' | 'Accepted' | 'In Transit' | 'Delivered' | 'Cancelled' | 'Rejected';
  transportOptIn: boolean;
  paymentStatus: 'Pending UPI' | 'Paid via UPI' | 'Cash on Delivery';
  orderDate: string;
  estimatedDelivery: string;
  ratingGiven?: number;
  reviewText?: string;
}

export interface MandiPriceItem {
  id: string;
  cropName: string;
  marketName: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: string;
  audioUrl?: string;
}

export interface DiseaseAnalysisResult {
  cropName: string;
  diseaseName: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptoms: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventiveMeasures: string[];
}

export interface PriceForecastResult {
  cropName: string;
  currentPrice: number;
  predictedPrice7Days: number;
  predictedPrice14Days: number;
  trendDirection: 'rising' | 'falling' | 'stable';
  confidenceScore: number;
  keyFactors: string[];
  recommendation: string;
}

export interface GovtScheme {
  id: string;
  title: string;
  category: string;
  description: string;
  eligibility: string;
  benefit: string;
  applyLink: string;
}
