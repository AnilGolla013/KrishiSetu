import React, { useState } from 'react';
import { ProductListing, Order, Language } from '../types';
import { translations } from '../data/translations';
import {
  PlusCircle,
  Tractor,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Phone,
  Clock,
  ShieldCheck,
  Package,
  IndianRupee,
  Calendar,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface FarmerDashboardProps {
  language: Language;
  listings: ProductListing[];
  orders: Order[];
  onAddListing: (listing: Partial<ProductListing>) => void;
  onDeleteListing: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onOpenChat: (order: Order) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  language,
  listings,
  orders,
  onAddListing,
  onDeleteListing,
  onUpdateOrderStatus,
  onOpenChat
}) => {
  const t = translations[language] || translations.en;
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [cropName, setCropName] = useState('Fresh Red Tomatoes (టమోటా)');
  const [category, setCategory] = useState<'Vegetable' | 'Fruit' | 'Grain' | 'Greens' | 'Spices'>('Vegetable');
  const [pricePerKg, setPricePerKg] = useState('24');
  const [quantityKg, setQuantityKg] = useState('300');
  const [minimumOrderKg, setMinimumOrderKg] = useState('20');
  const [harvestDate, setHarvestDate] = useState('Today (Morning 6 AM)');
  const [organic, setOrganic] = useState(true);
  const [description, setDescription] = useState('Freshly harvested organic produce directly from Medak farm.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80');

  // Calculated Metrics
  const farmerId = "f1";
  const farmerListings = listings.filter(l => l.farmerId === farmerId);
  const farmerOrders = orders.filter(o => o.farmerId === farmerId);

  const totalEarnings = farmerOrders
    .filter(o => o.status === 'Delivered' || o.status === 'In Transit' || o.status === 'Accepted')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingOrders = farmerOrders.filter(o => o.status === 'Pending');

  const presetCrops = [
    { name: "Red Tomatoes (టమోటా / टमाटर)", category: "Vegetable", avgPrice: 22, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80" },
    { name: "Nasik Onions (ఉల్లిపాయ / प्याज)", category: "Vegetable", avgPrice: 28, image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80" },
    { name: "Green Chillies (పచ్చిమిర్చి / मिर्च)", category: "Spices", avgPrice: 45, image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80" },
    { name: "Organic Spinach (పాలకూర / पालक)", category: "Greens", avgPrice: 18, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80" },
    { name: "Green Brinjal (వంకాయ / बैंगन)", category: "Vegetable", avgPrice: 24, image: "https://images.unsplash.com/photo-1628773822503-930a8585e33b?w=600&auto=format&fit=crop&q=80" },
  ];

  const handleSelectPreset = (preset: typeof presetCrops[0]) => {
    setCropName(preset.name);
    setCategory(preset.category as any);
    setPricePerKg(preset.avgPrice.toString());
    setImageUrl(preset.image);
  };

  const handleSubmitNewCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !pricePerKg || !quantityKg) return;

    onAddListing({
      farmerId: "f1",
      farmerName: "Rameshwar Patel",
      farmerPhone: "+91 98765 43210",
      farmerLocation: "Medak, Telangana",
      distanceKm: 4.2,
      cropName,
      category,
      pricePerKg: Number(pricePerKg),
      quantityAvailableKg: Number(quantityKg),
      minimumOrderKg: Number(minimumOrderKg),
      harvestDate,
      organic,
      description,
      imageUrl,
      qualityGrade: "Grade A (Premium)"
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Farmer Greeting & Header Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E0E7DE] relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1 border border-[#B7E4C7]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                {t.verifiedFarmer}
              </span>
              <span className="text-[#5C715C] text-xs font-medium">Medak, Telangana</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E1A]">
              {t.welcomeFarmer}
            </h2>
            <p className="text-xs text-[#5C715C] mt-1 font-medium">
              Rameshwar Patel • 8.5 Acres Organic Farm • Direct Buyer Network
            </p>
          </div>

          <button
            id="add-crop-btn"
            onClick={() => setShowAddModal(true)}
            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-white" />
            <span>{t.addCrop}</span>
          </button>
        </div>

        {/* Clean Minimalist Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F0F5F0]">
          <div className="bg-[#F4F7F2] p-4 rounded-xl border border-[#E0E7DE] flex flex-col justify-between">
            <span className="text-xs text-[#5C715C] font-semibold uppercase tracking-wider block">{t.earnings}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#1A2E1A]">
                ₹{totalEarnings.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#2D6A4F] font-bold bg-[#D8F3DC] px-2 py-0.5 rounded-md">+12%</span>
            </div>
            <span className="text-[10px] text-[#5C715C] mt-1 block">100% directly to bank</span>
          </div>

          <div className="bg-[#F4F7F2] p-4 rounded-xl border border-[#E0E7DE] flex flex-col justify-between">
            <span className="text-xs text-[#5C715C] font-semibold uppercase tracking-wider block">{t.activeListings}</span>
            <span className="text-2xl font-black text-[#1A2E1A] mt-2">
              {farmerListings.length} Produce
            </span>
            <span className="text-[10px] text-[#5C715C] mt-1 block">Ready for local buyers</span>
          </div>

          <div className="bg-[#F4F7F2] p-4 rounded-xl border border-[#E0E7DE] flex flex-col justify-between">
            <span className="text-xs text-[#5C715C] font-semibold uppercase tracking-wider block">{t.receivedOrders}</span>
            <span className="text-2xl font-black text-[#1A2E1A] mt-2">
              {farmerOrders.length} Orders
            </span>
            <span className="text-[10px] text-[#2D6A4F] font-bold mt-1 block">{pendingOrders.length} pending action</span>
          </div>

          <div className="bg-[#F4F7F2] p-4 rounded-xl border border-[#E0E7DE] flex flex-col justify-between">
            <span className="text-xs text-[#5C715C] font-semibold uppercase tracking-wider block">Farmer Rating</span>
            <span className="text-2xl font-black text-[#1A2E1A] mt-2">
              4.9 ★
            </span>
            <span className="text-[10px] text-[#5C715C] mt-1 block">From 38 local sellers</span>
          </div>
        </div>
      </div>

      {/* Orders Received Section */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#E0E7DE] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#2D6A4F]" />
            <h3 className="text-lg font-bold text-[#1A2E1A]">{t.receivedOrders}</h3>
            {pendingOrders.length > 0 && (
              <span className="bg-[#FFF4E5] text-[#D97706] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#FFE8CC]">
                {pendingOrders.length} Action Needed
              </span>
            )}
          </div>
        </div>

        {farmerOrders.length === 0 ? (
          <p className="text-xs text-[#5C715C] py-6 text-center font-medium">No order requests received yet.</p>
        ) : (
          <div className="space-y-3">
            {farmerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FBFDFA] hover:bg-[#F4F7F2] rounded-xl p-4 border border-[#E0E7DE] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={order.cropImage}
                    alt={order.cropName}
                    className="w-14 h-14 rounded-xl object-cover border border-[#E0E7DE] flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#1A2E1A] text-base">{order.cropName}</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#2D6A4F]">
                        {order.quantityKg} kg
                      </span>
                      <span className="text-xs text-[#5C715C]">• Order #{order.id}</span>
                    </div>

                    <p className="text-xs text-[#5C715C] mt-1">
                      Buyer: <strong className="text-[#1A2E1A]">{order.sellerName}</strong> ({order.sellerPhone})
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#5C715C] mt-1 flex-wrap">
                      <span>Delivery: {order.deliveryAddress}</span>
                      <span>• Total: <strong className="text-[#2D6A4F] font-black">₹{order.totalAmount}</strong></span>
                      <span>• Payment: <strong className="text-[#1A2E1A]">{order.paymentStatus}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-[#E0E7DE]">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    order.status === 'Accepted' || order.status === 'In Transit'
                      ? 'bg-[#E1F5FE] text-[#0288D1] border-[#B3E5FC]'
                      : order.status === 'Delivered'
                      ? 'bg-[#D8F3DC] text-[#2D6A4F] border-[#B7E4C7]'
                      : order.status === 'Pending'
                      ? 'bg-[#FFF4E5] text-[#D97706] border-[#FFE8CC]'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {order.status}
                  </span>

                  <button
                    onClick={() => onOpenChat(order)}
                    className="bg-[#F0F5F0] hover:bg-[#E0E7DE] text-[#1A2E1A] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    title="Chat with Buyer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Chat</span>
                  </button>

                  {order.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Accepted')}
                        className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.accept}</span>
                      </button>

                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Rejected')}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t.reject}</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'Accepted' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'In Transit')}
                      className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Tractor className="w-3.5 h-3.5" />
                      <span>Start Transport</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Crop Listings Grid */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#E0E7DE] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tractor className="w-5 h-5 text-[#2D6A4F]" />
            <h3 className="text-lg font-bold text-[#1A2E1A]">{t.myListings}</h3>
          </div>
          <span className="text-xs text-[#5C715C] font-semibold">
            {farmerListings.length} Active Listings
          </span>
        </div>

        {farmerListings.length === 0 ? (
          <div className="text-center py-8 bg-[#F4F7F2] rounded-xl border border-dashed border-[#E0E7DE]">
            <Tractor className="w-10 h-10 text-[#5C715C] mx-auto mb-2" />
            <p className="text-xs text-[#1A2E1A] font-bold">You have no active crop listings.</p>
            <p className="text-xs text-[#5C715C] mt-1">Click "Sell My Crop" to start selling directly to sellers!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 bg-[#2D6A4F] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Add First Crop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmerListings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E0E7DE] rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow relative group"
              >
                <div className="relative h-44 overflow-hidden bg-[#F4F7F2]">
                  <img
                    src={item.imageUrl}
                    alt={item.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#1A2E1A]/90 text-[#D8F3DC] text-xs font-extrabold px-3 py-1 rounded-lg shadow-xs">
                    ₹{item.pricePerKg}/kg
                  </span>
                  {item.organic && (
                    <span className="absolute top-3 right-3 bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#B7E4C7]">
                      ORGANIC
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-[#1A2E1A] text-base line-clamp-1">{item.cropName}</h4>

                  <div className="grid grid-cols-2 gap-2 my-3 text-xs text-[#5C715C] bg-[#F4F7F2] p-3 rounded-xl border border-[#E0E7DE]">
                    <div>
                      <span className="text-[#5C715C] block text-[10px] uppercase font-bold">Stock Left</span>
                      <strong className="text-[#1A2E1A] text-sm">{item.quantityAvailableKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-[#5C715C] block text-[10px] uppercase font-bold">Mandi Rate</span>
                      <span className="text-[#2D6A4F] font-bold text-sm">₹{item.mandiPricePerKg}/kg</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C715C] line-clamp-2">{item.description}</p>

                  <div className="mt-4 pt-3 border-t border-[#F0F5F0] flex items-center justify-between text-xs text-[#5C715C]">
                    <span>Harvest: {item.harvestDate}</span>

                    <button
                      onClick={() => onDeleteListing(item.id)}
                      className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 font-bold"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ADD CROP LISTING */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-8">
            <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-[#D8F3DC]" />
                <h3 className="font-bold text-lg text-[#D8F3DC]">{t.addCrop}</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#D8F3DC] hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewCrop} className="p-5 space-y-4">
              {/* Quick Preset Selector */}
              <div>
                <label className="text-xs font-bold text-[#1A2E1A] mb-1.5 block">Quick Vegetable Templates:</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {presetCrops.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="bg-[#F4F7F2] hover:bg-[#D8F3DC] text-[#1A2E1A] hover:text-[#2D6A4F] border border-[#E0E7DE] text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{preset.name.split(' ')[0]}</span>
                      <span className="text-[#2D6A4F] font-bold">₹{preset.avgPrice}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Name */}
              <div>
                <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">Crop / Vegetable Name *</label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Red Tomatoes (టమోటా)"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                />
              </div>

              {/* Category & Organic */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                  >
                    <option value="Vegetable">Vegetable</option>
                    <option value="Greens">Greens / Leafy</option>
                    <option value="Spices">Spices / Chillies</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Grain">Grain</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={organic}
                      onChange={(e) => setOrganic(e.target.checked)}
                      className="w-4 h-4 text-[#2D6A4F] rounded focus:ring-[#2D6A4F]"
                    />
                    <span className="text-xs font-bold text-[#2D6A4F]">100% Organic Farmed</span>
                  </label>
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">Your Price per kg (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl font-bold text-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#5C715C] block mt-1">Average Mandi Rate: ₹32/kg</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">Quantity Available (kg) *</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Harvest Date & Min Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">Harvest Status</label>
                  <select
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                  >
                    <option value="Today (Morning 6 AM)">Today Morning Harvest</option>
                    <option value="Yesterday Harvest">Yesterday Harvest</option>
                    <option value="Harvesting Tomorrow">Harvesting Tomorrow</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">Minimum Order (kg)</label>
                  <input
                    type="number"
                    value={minimumOrderKg}
                    onChange={(e) => setMinimumOrderKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">Short Notes for Buyers</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#E0E7DE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#5C715C] hover:bg-[#F4F7F2] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-5 py-2.5 text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Publish Crop Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
