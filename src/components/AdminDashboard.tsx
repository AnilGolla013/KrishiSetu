import React, { useState } from 'react';
import { UserProfile, ProductListing } from '../types';
import { initialFarmers } from '../data/mockData';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
  BadgeCheck
} from 'lucide-react';

interface AdminDashboardProps {
  listings: ProductListing[];
  onDeleteListing: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ listings, onDeleteListing }) => {
  const [users, setUsers] = useState<UserProfile[]>([
    ...initialFarmers,
    {
      id: "f5",
      name: "Suresh Kumar",
      phone: "+91 97000 11223",
      role: "farmer",
      villageOrCity: "Nalgonda",
      district: "Nalgonda",
      state: "Telangana",
      rating: 0,
      reviewsCount: 0,
      verified: false,
      farmSizeAcres: 4.5
    },
    {
      id: "s1",
      name: "Sri Krishna Vegetable Retail",
      phone: "+91 91234 56789",
      role: "seller",
      villageOrCity: "Kukatpally, Hyderabad",
      district: "Hyderabad",
      state: "Telangana",
      rating: 4.8,
      reviewsCount: 19,
      verified: true,
      shopName: "Sri Krishna Veggies"
    }
  ]);

  const toggleVerifyUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
  };

  const pendingVerification = users.filter(u => !u.verified);

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E0E7DE]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-bold px-3 py-0.5 rounded-full border border-[#B7E4C7] inline-block mb-1">
              Admin & Governance Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E1A]">
              KisanDirect Platform Admin
            </h2>
            <p className="text-xs text-[#5C715C] mt-1 font-medium">
              Manage accounts, verify farmer credentials, review complaints, and monitor direct agricultural trade.
            </p>
          </div>

          <div className="bg-[#F4F7F2] p-3.5 rounded-xl border border-[#E0E7DE] text-right">
            <span className="text-[10px] text-[#5C715C] uppercase font-bold block">Middlemen Commission Eliminated</span>
            <span className="text-2xl font-black text-[#2D6A4F]">₹2,84,500</span>
            <span className="text-[10px] text-[#2D6A4F] font-bold block">100% Passed to Farmers</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F0F5F0]">
          <div className="bg-[#F4F7F2] p-3.5 rounded-xl border border-[#E0E7DE]">
            <span className="text-xs text-[#5C715C] block font-semibold">Registered Farmers</span>
            <span className="text-xl font-black text-[#1A2E1A] mt-0.5">{users.filter(u => u.role === 'farmer').length}</span>
          </div>
          <div className="bg-[#F4F7F2] p-3.5 rounded-xl border border-[#E0E7DE]">
            <span className="text-xs text-[#5C715C] block font-semibold">Pending Verifications</span>
            <span className="text-xl font-black text-[#2D6A4F] mt-0.5">{pendingVerification.length}</span>
          </div>
          <div className="bg-[#F4F7F2] p-3.5 rounded-xl border border-[#E0E7DE]">
            <span className="text-xs text-[#5C715C] block font-semibold">Active Crop Listings</span>
            <span className="text-xl font-black text-[#1A2E1A] mt-0.5">{listings.length}</span>
          </div>
          <div className="bg-[#F4F7F2] p-3.5 rounded-xl border border-[#E0E7DE]">
            <span className="text-xs text-[#5C715C] block font-semibold">Platform Health Score</span>
            <span className="text-xl font-black text-[#2D6A4F] mt-0.5">99.4%</span>
          </div>
        </div>
      </div>

      {/* Verification Requests */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E0E7DE]">
        <h3 className="text-lg font-bold text-[#1A2E1A] mb-3 flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-[#2D6A4F]" />
          <span>Farmer & Buyer Verification Requests</span>
        </h3>

        <div className="space-y-3">
          {users.map((usr) => (
            <div
              key={usr.id}
              className="bg-[#FBFDFA] p-3.5 rounded-xl border border-[#E0E7DE] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1A2E1A] text-sm">{usr.name}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    usr.role === 'farmer' ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'bg-[#E1F5FE] text-[#0288D1]'
                  }`}>
                    {usr.role}
                  </span>
                  {usr.verified && (
                    <span className="bg-[#2D6A4F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5C715C] mt-0.5">
                  Phone: {usr.phone} • Location: {usr.villageOrCity}, {usr.district}
                </p>
              </div>

              <button
                onClick={() => toggleVerifyUser(usr.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  usr.verified
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-[#2D6A4F] text-white border-[#1B4332] hover:bg-[#1B4332]'
                }`}
              >
                {usr.verified ? 'Revoke Verification' : 'Verify Credentials'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Manage Active Produce Listings */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E0E7DE]">
        <h3 className="text-lg font-bold text-[#1A2E1A] mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2D6A4F]" />
          <span>Active Marketplace Listings Moderation</span>
        </h3>

        <div className="space-y-3">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-[#FBFDFA] p-3.5 rounded-xl border border-[#E0E7DE] flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.cropName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E0E7DE]"
                />
                <div>
                  <h4 className="font-bold text-[#1A2E1A] text-sm">{item.cropName}</h4>
                  <p className="text-xs text-[#5C715C]">
                    Farmer: {item.farmerName} • Rate: ₹{item.pricePerKg}/kg • Stock: {item.quantityAvailableKg} kg
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDeleteListing(item.id)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Spam/Fake</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
