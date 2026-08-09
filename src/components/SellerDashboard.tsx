import React, { useState } from 'react';
import { ProductListing, Order, Language } from '../types';
import { translations } from '../data/translations';
import {
  Search,
  Filter,
  MapPin,
  Phone,
  MessageSquare,
  ShoppingCart,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingDown,
  Truck,
  Sparkles,
  Info
} from 'lucide-react';

interface SellerDashboardProps {
  language: Language;
  listings: ProductListing[];
  myOrders: Order[];
  onPlaceOrder: (orderData: any) => void;
  onOpenChat: (order: Order) => void;
  onRateOrder: (orderId: string, rating: number, review: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  language,
  listings,
  myOrders,
  onPlaceOrder,
  onOpenChat,
  onRateOrder
}) => {
  const t = translations[language] || translations.en;

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [maxDistance, setMaxDistance] = useState(30);
  const [organicOnly, setOrganicOnly] = useState(false);

  // Selected Product for Order Modal
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [orderQty, setOrderQty] = useState<number>(50);
  const [deliveryAddress, setDeliveryAddress] = useState('Shop #14, Rythu Bazar, Kukatpally, Hyderabad');
  const [transportOptIn, setTransportOptIn] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');

  // Rating Modal State
  const [ratingModalOrder, setRatingModalOrder] = useState<Order | null>(null);
  const [starCount, setStarCount] = useState(5);
  const [reviewComment, setReviewComment] = useState('Fresh quality vegetables delivered on time. Highly recommended farmer!');

  // Filter Logic
  const filteredListings = listings.filter((item) => {
    const matchesCategory = category === 'all' || item.category.toLowerCase() === category.toLowerCase();
    const matchesSearch =
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistance = item.distanceKm <= maxDistance;
    const matchesOrganic = !organicOnly || item.organic;

    return matchesCategory && matchesSearch && matchesDistance && matchesOrganic;
  });

  const handleOpenOrderModal = (product: ProductListing) => {
    setSelectedProduct(product);
    setOrderQty(product.minimumOrderKg || 20);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    onPlaceOrder({
      listingId: selectedProduct.id,
      quantityKg: orderQty,
      deliveryAddress,
      transportOptIn,
      paymentMethod,
      sellerId: "s1",
      sellerName: "Sri Krishna Vegetable Retail",
      sellerPhone: "+91 91234 56789"
    });

    setSelectedProduct(null);
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalOrder) return;

    onRateOrder(ratingModalOrder.id, starCount, reviewComment);
    setRatingModalOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Seller Header Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E0E7DE]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-0.5 rounded-full border border-[#B7E4C7] inline-block mb-1">
              Vegetable Seller & Retailer
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E1A]">
              {t.welcomeSeller}
            </h2>
            <p className="text-xs text-[#5C715C] mt-1 font-medium">
              Direct connection with Medak & Rangareddy farmers • Zero broker margin
            </p>
          </div>

          <div className="bg-[#F4F7F2] p-3.5 rounded-xl border border-[#E0E7DE] text-right">
            <span className="text-[10px] text-[#5C715C] uppercase font-bold block">Avg Direct Savings</span>
            <span className="text-xl font-black text-[#2D6A4F]">₹8 - ₹14 / kg</span>
            <span className="text-[10px] text-[#5C715C] block font-medium">vs APMC Mandi rates</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#E0E7DE] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-[#5C715C] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none bg-white text-[#1A2E1A]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none bg-white text-[#1A2E1A] font-medium"
            >
              <option value="all">{t.allCrops}</option>
              <option value="vegetable">Vegetables</option>
              <option value="greens">Greens & Leafy</option>
              <option value="spices">Spices & Chillies</option>
              <option value="fruit">Fruits</option>
            </select>
          </div>

          {/* Distance Filter Slider */}
          <div className="flex items-center gap-2 bg-[#F4F7F2] px-3 py-1.5 rounded-xl border border-[#E0E7DE]">
            <MapPin className="w-4 h-4 text-[#2D6A4F] flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-semibold text-[#5C715C]">
                <span>{t.distanceKm}:</span>
                <span className="text-[#2D6A4F] font-bold">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-[#2D6A4F] cursor-pointer h-1.5"
              />
            </div>
          </div>
        </div>

        {/* Organic Checkbox & Result Counter */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F0F5F0]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="w-4 h-4 text-[#2D6A4F] rounded focus:ring-[#2D6A4F]"
            />
            <span className="font-semibold text-[#1A2E1A]">{t.organicOnly}</span>
          </label>

          <span className="text-[#5C715C] font-medium">
            Showing <strong className="text-[#1A2E1A]">{filteredListings.length}</strong> farm produce listings nearby
          </span>
        </div>
      </div>

      {/* Available Farmer Produce Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map((listing) => {
          const savingsPerKg = listing.mandiPricePerKg - listing.pricePerKg;

          return (
            <div
              key={listing.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E0E7DE] shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Crop Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-[#F4F7F2]">
                  <img
                    src={listing.imageUrl}
                    alt={listing.cropName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />

                  {/* Price Badge */}
                  <div className="absolute top-3 left-3 bg-[#1A2E1A]/90 text-[#D8F3DC] font-black px-3 py-1 rounded-xl shadow-xs border border-[#2D6A4F] text-sm">
                    ₹{listing.pricePerKg} <span className="text-xs font-normal text-[#9BB19B]">/ kg</span>
                  </div>

                  {/* Distance Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#1A2E1A] text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 border border-[#E0E7DE]">
                    <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>{listing.distanceKm} km</span>
                  </div>

                  {/* Harvest Date Tag */}
                  <div className="absolute bottom-2 left-2 bg-[#2D6A4F]/90 text-[#D8F3DC] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#B7E4C7]">
                    {listing.harvestDate}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-[#1A2E1A] text-base leading-snug">{listing.cropName}</h3>
                    <p className="text-xs text-[#5C715C] mt-0.5">{listing.category} • {listing.qualityGrade}</p>
                  </div>

                  {/* Farmer Info */}
                  <div className="bg-[#F4F7F2] p-2.5 rounded-xl border border-[#E0E7DE] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#1A2E1A] text-xs">{listing.farmerName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      </div>
                      <span className="text-[11px] text-[#5C715C] block">{listing.farmerLocation}</span>
                    </div>

                    <a
                      href={`tel:${listing.farmerPhone}`}
                      className="bg-[#D8F3DC] hover:bg-[#B7E4C7] text-[#2D6A4F] p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-[#B7E4C7]"
                      title="Direct Call Farmer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  </div>

                  {/* Price Comparison Callout */}
                  <div className="bg-[#D8F3DC]/40 border border-[#B7E4C7] p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#5C715C] text-[10px] block font-bold uppercase">APMC Mandi Rate</span>
                      <span className="text-[#5C715C] font-bold line-through">₹{listing.mandiPricePerKg}/kg</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[#2D6A4F] font-extrabold flex items-center gap-0.5 text-sm">
                        <TrendingDown className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        Save ₹{savingsPerKg}/kg
                      </span>
                      <span className="text-[10px] text-[#5C715C] font-medium">Direct Farm Savings</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C715C] line-clamp-2">{listing.description}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleOpenOrderModal(listing)}
                  className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t.buyNow} (Min {listing.minimumOrderKg} kg)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seller Orders History Section */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#E0E7DE] p-6 mt-8">
        <h3 className="text-lg font-bold text-[#1A2E1A] mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#2D6A4F]" />
          <span>My Placed Orders</span>
        </h3>

        {myOrders.length === 0 ? (
          <p className="text-xs text-[#5C715C] text-center py-6 font-medium">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-3">
            {myOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-[#FBFDFA] p-4 rounded-xl border border-[#E0E7DE] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ord.cropImage}
                    alt={ord.cropName}
                    className="w-14 h-14 rounded-xl object-cover border border-[#E0E7DE]"
                  />
                  <div>
                    <h4 className="font-bold text-[#1A2E1A] text-sm">{ord.cropName}</h4>
                    <p className="text-xs text-[#5C715C]">
                      Farmer: {ord.farmerName} ({ord.farmerPhone})
                    </p>
                    <span className="text-xs text-[#5C715C]">
                      {ord.quantityKg} kg x ₹{ord.pricePerKg}/kg = <strong className="text-[#2D6A4F]">₹{ord.totalAmount}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    ord.status === 'In Transit' || ord.status === 'Accepted'
                      ? 'bg-[#E1F5FE] text-[#0288D1] border-[#B3E5FC]'
                      : ord.status === 'Delivered'
                      ? 'bg-[#D8F3DC] text-[#2D6A4F] border-[#B7E4C7]'
                      : 'bg-[#FFF4E5] text-[#D97706] border-[#FFE8CC]'
                  }`}>
                    {ord.status}
                  </span>

                  <button
                    onClick={() => onOpenChat(ord)}
                    className="bg-[#F0F5F0] text-[#1A2E1A] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#E0E7DE]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Chat</span>
                  </button>

                  {ord.status === 'Delivered' && !ord.ratingGiven && (
                    <button
                      onClick={() => setRatingModalOrder(ord)}
                      className="bg-[#2D6A4F] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer hover:bg-[#1B4332]"
                    >
                      <Star className="w-3.5 h-3.5 text-[#D8F3DC] fill-[#D8F3DC]" />
                      <span>{t.rateFarmer}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ORDER PRODUCE */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-6">
            <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#D8F3DC]">Order Fresh Produce</h3>
                <p className="text-xs text-[#D8F3DC]/80">{selectedProduct.cropName}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-[#D8F3DC] hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="p-5 space-y-4">
              {/* Product Summary Row */}
              <div className="flex items-center gap-3 bg-[#D8F3DC]/40 p-3 rounded-xl border border-[#B7E4C7]">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.cropName}
                  className="w-16 h-16 rounded-xl object-cover border border-[#B7E4C7]"
                />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-[#1A2E1A] text-sm">{selectedProduct.cropName}</p>
                  <p className="text-[#5C715C]">Farmer: {selectedProduct.farmerName} ({selectedProduct.farmerLocation})</p>
                  <p className="text-[#2D6A4F] font-bold">
                    Direct Rate: ₹{selectedProduct.pricePerKg}/kg (Mandi: ₹{selectedProduct.mandiPricePerKg}/kg)
                  </p>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div>
                <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">
                  Select Order Quantity (kg) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={selectedProduct.minimumOrderKg}
                    max={selectedProduct.quantityAvailableKg}
                    value={orderQty}
                    onChange={(e) => setOrderQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-[#E0E7DE] rounded-xl text-base font-bold text-[#1A2E1A] focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                  />
                  <span className="text-xs text-[#5C715C] whitespace-nowrap font-medium">
                    Max: {selectedProduct.quantityAvailableKg} kg
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">{t.deliverAddress} *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                />
              </div>

              {/* Transport Booking Option */}
              <div className="bg-[#F4F7F2] p-3 rounded-xl border border-[#E0E7DE]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transportOptIn}
                    onChange={(e) => setTransportOptIn(e.target.checked)}
                    className="w-4 h-4 text-[#2D6A4F] rounded focus:ring-[#2D6A4F]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#1A2E1A] flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      Include Local Transport Rickshaw (+₹150)
                    </span>
                    <span className="text-[#5C715C] block text-[11px]">
                      Verified driver will pick up from farm and deliver to your shop address.
                    </span>
                  </div>
                </label>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs font-bold text-[#1A2E1A] mb-1 block">Payment Options</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'bg-[#2D6A4F] text-white border-[#1B4332] shadow-xs'
                        : 'bg-[#F4F7F2] text-[#1A2E1A] border-[#E0E7DE]'
                    }`}
                  >
                    UPI (GPay / PhonePe)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'bg-[#2D6A4F] text-white border-[#1B4332] shadow-xs'
                        : 'bg-[#F4F7F2] text-[#1A2E1A] border-[#E0E7DE]'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>

              {/* Final Amount Breakdown */}
              <div className="bg-[#1A2E1A] text-white p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9BB19B] block">Total Price</span>
                  <span className="text-[10px] text-[#D8F3DC]">
                    ({orderQty} kg x ₹{selectedProduct.pricePerKg} {transportOptIn ? '+ ₹150 transport' : ''})
                  </span>
                </div>
                <span className="text-xl font-black text-[#D8F3DC]">
                  ₹{(orderQty * selectedProduct.pricePerKg) + (transportOptIn ? 150 : 0)}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-[#5C715C] hover:bg-[#F4F7F2] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-5 py-2.5 text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RATE FARMER */}
      {ratingModalOrder && (
        <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 border border-[#E0E7DE] space-y-4">
            <h3 className="font-bold text-[#1A2E1A] text-base">Rate Produce Quality & Farmer Service</h3>

            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStarCount(s)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${s <= starCount ? 'fill-[#2D6A4F] text-[#2D6A4F]' : 'text-[#E0E7DE]'}`} />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write feedback..."
              className="w-full p-3 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRatingModalOrder(null)}
                className="px-4 py-2 text-xs font-bold text-[#5C715C] hover:bg-[#F4F7F2] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRating}
                className="bg-[#2D6A4F] text-white font-bold px-4 py-2 text-xs rounded-xl cursor-pointer hover:bg-[#1B4332]"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
