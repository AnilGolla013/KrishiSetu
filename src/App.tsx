import React, { useState, useEffect } from 'react';
import { UserRole, Language, ProductListing, Order, UserProfile } from './types';
import { Header } from './components/Header';
import { FarmerDashboard } from './components/FarmerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';

import { MandiPricesModal } from './components/MandiPricesModal';
import { AiCropDoctorModal } from './components/AiCropDoctorModal';
import { AiPricePredictorModal } from './components/AiPricePredictorModal';
import { KisanMitraChatModal } from './components/KisanMitraChatModal';
import { GovtSchemesModal } from './components/GovtSchemesModal';
import { ChatModal } from './components/ChatModal';
import { AuthModal } from './components/AuthModal';

import { initialProductListings, initialOrders } from './data/mockData';
import { getStoredUser, clearStoredAuth, fetchWithAuth } from './lib/auth';

export default function App() {
  const [role, setRole] = useState<UserRole>('farmer');
  const [language, setLanguage] = useState<Language>('en');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Listings & Orders State
  const [listings, setListings] = useState<ProductListing[]>(initialProductListings);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Modals
  const [isMandiOpen, setIsMandiOpen] = useState(false);
  const [isCropDoctorOpen, setIsCropDoctorOpen] = useState(false);
  const [isPricePredictorOpen, setIsPricePredictorOpen] = useState(false);
  const [isKisanMitraOpen, setIsKisanMitraOpen] = useState(false);
  const [isGovtSchemesOpen, setIsGovtSchemesOpen] = useState(false);
  const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);

  // Sync with API
  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
        }
      })
      .catch((err) => console.log("Using initial listings state:", err));

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch((err) => console.log("Using initial orders state:", err));

    // Verify authenticated user session
    fetchWithAuth("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((user) => {
        if (user) {
          setCurrentUser(user);
          if (user.role) setRole(user.role);
        }
      })
      .catch((err) => console.log("Session verify error:", err));
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role) {
      setRole(user.role);
    }
  };

  // Handlers
  const handleAddListing = async (newListingData: Partial<ProductListing>) => {
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newListingData)
      });
      const saved = await res.json();
      setListings((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Failed to add listing on API:", err);
      const fallback: ProductListing = {
        id: "p_" + Date.now(),
        farmerId: "f1",
        farmerName: "Rameshwar Patel",
        farmerPhone: "+91 98765 43210",
        farmerLocation: "Medak, Telangana",
        distanceKm: 4.2,
        cropName: newListingData.cropName || "Produce",
        category: newListingData.category || "Vegetable",
        pricePerKg: newListingData.pricePerKg || 25,
        mandiPricePerKg: Math.round((newListingData.pricePerKg || 25) * 1.35),
        quantityAvailableKg: newListingData.quantityAvailableKg || 100,
        minimumOrderKg: newListingData.minimumOrderKg || 10,
        harvestDate: newListingData.harvestDate || "Today Morning",
        organic: Boolean(newListingData.organic),
        description: newListingData.description || "Fresh harvest produce",
        imageUrl: newListingData.imageUrl || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        qualityGrade: "Grade A (Premium)",
        createdAt: new Date().toISOString()
      };
      setListings((prev) => [fallback, ...prev]);
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await fetch(`/api/listings/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete error:", err);
    }
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const handlePlaceOrder = async (orderData: any) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      const savedOrder = await res.json();
      setOrders((prev) => [savedOrder, ...prev]);

      setListings((prev) =>
        prev.map((l) =>
          l.id === orderData.listingId
            ? { ...l, quantityAvailableKg: Math.max(0, l.quantityAvailableKg - orderData.quantityKg) }
            : l
        )
      );
    } catch (err) {
      console.error("Place order failed:", err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error("Update status failed:", err);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }
  };

  const handleRateOrder = async (orderId: string, rating: number, review: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratingGiven: rating, reviewText: review })
      });
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error("Rate order failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#1A2E1A] font-sans flex flex-col">
      {/* Header Bar */}
      <Header
        role={role}
        setRole={setRole}
        language={language}
        setLanguage={setLanguage}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenMandi={() => setIsMandiOpen(true)}
        onOpenCropDoctor={() => setIsCropDoctorOpen(true)}
        onOpenPricePredictor={() => setIsPricePredictorOpen(true)}
        onOpenKisanMitra={() => setIsKisanMitraOpen(true)}
        onOpenGovtSchemes={() => setIsGovtSchemesOpen(true)}
      />

      {/* Main Content View based on Active Role */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {role === 'farmer' && (
          <FarmerDashboard
            language={language}
            listings={listings}
            orders={orders}
            onAddListing={handleAddListing}
            onDeleteListing={handleDeleteListing}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenChat={(order) => setActiveChatOrder(order)}
          />
        )}

        {role === 'seller' && (
          <SellerDashboard
            language={language}
            listings={listings}
            myOrders={orders.filter((o) => o.sellerId === "s1")}
            onPlaceOrder={handlePlaceOrder}
            onOpenChat={(order) => setActiveChatOrder(order)}
            onRateOrder={handleRateOrder}
          />
        )}

        {role === 'admin' && (
          <AdminDashboard
            listings={listings}
            onDeleteListing={handleDeleteListing}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A2E1A] text-[#D8F3DC] py-6 text-xs text-center border-t border-[#2D6A4F] mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-bold text-[#D8F3DC] text-sm">
            🌾 KisanDirect — Empowering Indian Agriculture • Direct Farmer-to-Seller Marketplace
          </p>
          <p className="text-[#9BB19B] font-medium">
            Regional Languages Support: Telugu, Hindi, Tamil, Kannada, Marathi & English • AI Crop Doctor & APMC Mandi Intelligence
          </p>
        </div>
      </footer>

      {/* Feature Modals */}
      <MandiPricesModal
        isOpen={isMandiOpen}
        onClose={() => setIsMandiOpen(false)}
      />

      <AiCropDoctorModal
        isOpen={isCropDoctorOpen}
        onClose={() => setIsCropDoctorOpen(false)}
      />

      <AiPricePredictorModal
        isOpen={isPricePredictorOpen}
        onClose={() => setIsPricePredictorOpen(false)}
      />

      <KisanMitraChatModal
        isOpen={isKisanMitraOpen}
        onClose={() => setIsKisanMitraOpen(false)}
        language={language}
      />

      <GovtSchemesModal
        isOpen={isGovtSchemesOpen}
        onClose={() => setIsGovtSchemesOpen(false)}
      />

      <ChatModal
        isOpen={Boolean(activeChatOrder)}
        onClose={() => setActiveChatOrder(null)}
        order={activeChatOrder}
        currentUserId={role === 'farmer' ? 'f1' : 's1'}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialRole={role}
      />
    </div>
  );
}
