import React, { useState } from 'react';
import { PriceForecastResult } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Bot,
  Sparkles,
  Loader2,
  Calendar,
  IndianRupee,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface AiPricePredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiPricePredictorModal: React.FC<AiPricePredictorModalProps> = ({ isOpen, onClose }) => {
  const [cropName, setCropName] = useState('Red Tomatoes');
  const [region, setRegion] = useState('Telangana & AP Markets');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<PriceForecastResult | null>({
    cropName: 'Red Tomatoes',
    currentPrice: 28,
    predictedPrice7Days: 34,
    predictedPrice14Days: 38,
    trendDirection: 'rising',
    confidenceScore: 0.88,
    keyFactors: [
      'Monsoon rains in Western Ghats delaying fresh harvest arrivals in wholesale mandis',
      'Increased retail demand from Hyderabad & Secunderabad urban supermarkets',
      'Diesel transport tariffs holding steady across South India'
    ],
    recommendation: 'Hold 30% of tomato harvest for 4-5 days. Wholesale prices expected to jump by ₹6/kg due to supply deficit.'
  });

  if (!isOpen) return null;

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/price-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropName, region })
      });
      const data = await res.json();
      setForecast(data);
    } catch (err) {
      console.error("Price predict error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#D8F3DC]">AI Market Price Forecast</h3>
              <p className="text-xs text-[#D8F3DC]/80">7-Day & 14-Day Agricultural Price Trend Predictions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#D8F3DC] hover:text-white text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Select Crop</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
              >
                <option value="Red Tomatoes">Red Tomatoes (టమోటా)</option>
                <option value="Nasik Onions">Nasik Onions (ఉల్లిపాయ)</option>
                <option value="Green Chillies">Green Chillies (పచ్చిమిర్చి)</option>
                <option value="Jyoti Potato">Potato (ఆలుగడ్డ)</option>
                <option value="Green Brinjal">Brinjal / Eggplant (వంకాయ)</option>
                <option value="Fresh Spinach">Spinach (పాలకూర)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Market Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
              >
                <option value="Telangana & AP Markets">Telangana & Andhra Pradesh</option>
                <option value="Karnataka Markets">Karnataka (Bengaluru)</option>
                <option value="Tamil Nadu Markets">Tamil Nadu (Chennai Koyambedu)</option>
                <option value="Maharashtra Mandis">Maharashtra (Pune & Mumbai)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Analyzing APMC Mandi Trends...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D8F3DC]" />
                <span>Generate Price Forecast</span>
              </>
            )}
          </button>

          {/* Forecast Cards */}
          {forecast && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F4F7F2] p-3 rounded-xl border border-[#E0E7DE] text-center">
                  <span className="text-[10px] text-[#5C715C] uppercase font-bold block">Current Rate</span>
                  <span className="text-lg font-black text-[#1A2E1A]">₹{forecast.currentPrice}/kg</span>
                  <span className="text-[9px] text-[#5C715C] block">Today's Average</span>
                </div>

                <div className="bg-[#FFF4E5] p-3 rounded-xl border border-[#FFE8CC] text-center">
                  <span className="text-[10px] text-[#D97706] uppercase font-bold block">7-Day Forecast</span>
                  <span className="text-lg font-black text-[#B45309]">₹{forecast.predictedPrice7Days}/kg</span>
                  <span className="text-[9px] text-[#D97706] font-bold block flex items-center justify-center gap-0.5">
                    <TrendingUp className="w-3 h-3 text-[#D97706]" />
                    +{Math.round(((forecast.predictedPrice7Days - forecast.currentPrice) / forecast.currentPrice) * 100)}%
                  </span>
                </div>

                <div className="bg-[#D8F3DC] p-3 rounded-xl border border-[#B7E4C7] text-center">
                  <span className="text-[10px] text-[#2D6A4F] uppercase font-bold block">14-Day Forecast</span>
                  <span className="text-lg font-black text-[#2D6A4F]">₹{forecast.predictedPrice14Days}/kg</span>
                  <span className="text-[9px] text-[#2D6A4F] font-bold block">Expected Peak</span>
                </div>
              </div>

              {/* AI Strategic Recommendation Box */}
              <div className="bg-[#1A2E1A] text-white p-4 rounded-xl space-y-2 border border-[#2D6A4F]">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#D8F3DC]" />
                  <strong className="text-xs font-bold text-[#D8F3DC]">AI Selling Strategy Recommendation</strong>
                </div>
                <p className="text-xs text-[#9BB19B] leading-relaxed font-medium">{forecast.recommendation}</p>
              </div>

              {/* Key Factors */}
              <div>
                <strong className="text-xs text-[#1A2E1A] block mb-1 font-bold">Key Market Drivers:</strong>
                <ul className="list-disc list-inside text-xs text-[#5C715C] space-y-1">
                  {forecast.keyFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
