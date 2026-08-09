import React, { useState } from 'react';
import { MandiPriceItem } from '../types';
import { initialMandiPrices } from '../data/mockData';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface MandiPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MandiPricesModal: React.FC<MandiPricesModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mandiList, setMandiList] = useState<MandiPriceItem[]>(initialMandiPrices);
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setMandiList(prev => prev.map(m => ({
        ...m,
        modalPrice: m.modalPrice + (Math.random() > 0.5 ? 1 : -1),
        lastUpdated: "Just Now (Live Stream)"
      })));
      setRefreshing(false);
    }, 800);
  };

  const filtered = mandiList.filter(
    m => m.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         m.marketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         m.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#D8F3DC]">Live APMC Mandi Market Rates</h3>
              <p className="text-xs text-[#D8F3DC]/80">Government APMC & Wholesale Agricultural Mandis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="bg-[#1B4332] hover:bg-[#112D23] p-2 rounded-xl text-xs font-bold text-[#D8F3DC] flex items-center gap-1 cursor-pointer border border-[#2D6A4F]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#D8F3DC] hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#5C715C] absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by crop, Mandi, or State (e.g. Hyderabad, Tomato, Chennai)..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[#E0E7DE]">
            <table className="w-full text-left text-xs text-[#5C715C]">
              <thead className="bg-[#FBFDFA] text-[#5C715C] font-bold border-b border-[#E0E7DE] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Crop Name</th>
                  <th className="p-3">APMC Market Yard</th>
                  <th className="p-3 text-right">Min Rate</th>
                  <th className="p-3 text-right">Max Rate</th>
                  <th className="p-3 text-right">Modal Rate</th>
                  <th className="p-3 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5F0] font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F4F7F2] transition-colors">
                    <td className="p-3 font-bold text-[#1A2E1A]">{item.cropName}</td>
                    <td className="p-3 text-[#5C715C]">
                      <span className="block font-semibold text-[#1A2E1A]">{item.marketName}</span>
                      <span className="text-[10px] text-[#5C715C]">{item.state} • {item.lastUpdated}</span>
                    </td>
                    <td className="p-3 text-right">₹{item.minPrice}/kg</td>
                    <td className="p-3 text-right">₹{item.maxPrice}/kg</td>
                    <td className="p-3 text-right font-extrabold text-[#2D6A4F] text-sm">₹{item.modalPrice}/kg</td>
                    <td className="p-3 text-center">
                      {item.trend === 'up' && (
                        <span className="inline-flex items-center gap-0.5 text-[#2D6A4F] font-bold bg-[#D8F3DC] px-2.5 py-0.5 rounded-full border border-[#B7E4C7]">
                          <TrendingUp className="w-3 h-3" /> +{item.changePercent}%
                        </span>
                      )}
                      {item.trend === 'down' && (
                        <span className="inline-flex items-center gap-0.5 text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <TrendingDown className="w-3 h-3" /> {item.changePercent}%
                        </span>
                      )}
                      {item.trend === 'stable' && (
                        <span className="inline-flex items-center gap-0.5 text-[#5C715C] font-bold bg-[#F4F7F2] px-2.5 py-0.5 rounded-full border border-[#E0E7DE]">
                          <Minus className="w-3 h-3" /> Stable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
