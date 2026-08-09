import React from 'react';
import { UserRole, Language, UserProfile } from '../types';
import { translations } from '../data/translations';
import {
  Sprout,
  Languages,
  UserCheck,
  TrendingUp,
  Stethoscope,
  Bot,
  Landmark,
  Store,
  Tractor,
  ShieldCheck,
  MapPin,
  User,
  LogOut,
  Key
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenMandi: () => void;
  onOpenCropDoctor: () => void;
  onOpenPricePredictor: () => void;
  onOpenKisanMitra: () => void;
  onOpenGovtSchemes: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  setRole,
  language,
  setLanguage,
  user,
  onOpenAuth,
  onLogout,
  onOpenMandi,
  onOpenCropDoctor,
  onOpenPricePredictor,
  onOpenKisanMitra,
  onOpenGovtSchemes,
}) => {
  const t = translations[language] || translations.en;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E0E7DE] shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-[#1A2E1A] py-1.5 px-4 text-xs font-medium text-[#D8F3DC] flex justify-between items-center overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="inline-block w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse"></span>
          <span>{t.noMiddlemen}</span>
          <span className="hidden sm:inline text-[#9BB19B]">•</span>
          <span className="hidden sm:inline">100% Direct Farmer Earnings</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#D8F3DC] text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
          <span>Medak & Hyderabad Region</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#2D6A4F] text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xs">
            🌾
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 text-[#1A2E1A]">
              {t.appName}
              <span className="bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#B7E4C7] uppercase tracking-wider">
                Direct
              </span>
            </h1>
            <p className="text-xs text-[#5C715C] hidden sm:block font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center/Right Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick AI & Tools Chips */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              id="mandi-prices-btn"
              onClick={onOpenMandi}
              className="bg-white hover:bg-[#F0F5F0] text-[#2D6A4F] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#E0E7DE] transition-colors cursor-pointer"
              title="View Live Mandi Rates"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="hidden md:inline">{t.mandiPrices}</span>
            </button>

            <button
              id="ai-crop-doctor-btn"
              onClick={onOpenCropDoctor}
              className="bg-white hover:bg-[#F0F5F0] text-[#2D6A4F] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#E0E7DE] transition-colors cursor-pointer"
              title="AI Crop Disease Doctor"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="hidden md:inline">{t.aiCropDoctor}</span>
            </button>

            <button
              id="ai-price-predict-btn"
              onClick={onOpenPricePredictor}
              className="bg-white hover:bg-[#F0F5F0] text-[#2D6A4F] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#E0E7DE] transition-colors cursor-pointer"
              title="AI Price Forecast"
            >
              <Bot className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="hidden md:inline">{t.aiPricePredict}</span>
            </button>

            <button
              id="kisan-mitra-btn"
              onClick={onOpenKisanMitra}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="AI Kisan Assistant"
            >
              <Sprout className="w-4 h-4 text-[#D8F3DC]" />
              <span>{t.kisanMitra}</span>
            </button>

            <button
              id="govt-schemes-btn"
              onClick={onOpenGovtSchemes}
              className="bg-white hover:bg-[#F0F5F0] text-[#2D6A4F] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#E0E7DE] transition-colors cursor-pointer"
              title="Government Schemes"
            >
              <Landmark className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="hidden lg:inline">{t.govtSchemes}</span>
            </button>
          </div>

          {/* User Auth Account Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-[#D8F3DC] border border-[#B7E4C7] p-1 pr-2.5 rounded-xl">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-lg object-cover border border-[#2D6A4F]" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <span className="text-[11px] font-extrabold text-[#1A2E1A] block leading-tight">{user.name}</span>
                <span className="text-[9px] font-bold text-[#2D6A4F] uppercase tracking-wider block">{user.role}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-[#2D6A4F] hover:text-rose-700 p-1 cursor-pointer transition-colors"
                title="Logout Account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Key className="w-3.5 h-3.5 text-[#D8F3DC]" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative flex items-center bg-[#F4F7F2] rounded-xl border border-[#E0E7DE] px-2.5 py-1.5 text-xs">
            <Languages className="w-3.5 h-3.5 text-[#2D6A4F] mr-1.5" />
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[#1A2E1A] font-bold focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="kn">కನ್ನಡ (Kannada)</option>
              <option value="mr">మరాఠీ (Marathi)</option>
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-[#F4F7F2] p-1 rounded-xl border border-[#E0E7DE]">
            <button
              onClick={() => setRole('farmer')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                role === 'farmer'
                  ? 'bg-[#2D6A4F] text-white shadow-xs'
                  : 'text-[#5C715C] hover:text-[#1A2E1A]'
              }`}
            >
              <Tractor className="w-3.5 h-3.5" />
              <span>{t.farmerRole}</span>
            </button>

            <button
              onClick={() => setRole('seller')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                role === 'seller'
                  ? 'bg-[#2D6A4F] text-white shadow-xs'
                  : 'text-[#5C715C] hover:text-[#1A2E1A]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t.sellerRole}</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-[#1A2E1A] text-white shadow-xs'
                  : 'text-[#5C715C] hover:text-[#1A2E1A]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.adminRole}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
