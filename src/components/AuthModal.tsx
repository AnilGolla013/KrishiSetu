import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { uploadFileToFirebase } from '../lib/firebaseConfig';
import { setStoredAuth } from '../lib/auth';
import {
  User,
  Lock,
  Phone,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tractor,
  Store,
  ShieldCheck,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialRole = 'farmer'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<UserRole>(initialRole);

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [villageOrCity, setVillageOrCity] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('Telangana');
  const [farmSizeAcres, setFarmSizeAcres] = useState('');
  const [shopName, setShopName] = useState('');

  // Firebase Upload states
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [docBase64, setDocBase64] = useState<string | null>(null);
  const [docFileName, setDocFileName] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarBase64(result);
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setDocBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'register') {
        let avatarUrl: string | undefined = undefined;
        let verificationDocumentUrl: string | undefined = undefined;

        // Upload Avatar image to Firebase Storage if selected
        if (avatarBase64) {
          setUploadProgressMsg('Uploading Profile Image to Firebase Storage...');
          const folder = role === 'farmer' ? 'farmers' : role === 'seller' ? 'sellers' : 'documents';
          avatarUrl = await uploadFileToFirebase(avatarBase64, folder, avatarFileName);
        }

        // Upload Verification Document to Firebase Storage if selected
        if (docBase64) {
          setUploadProgressMsg('Uploading Verification Document to Firebase Storage...');
          verificationDocumentUrl = await uploadFileToFirebase(docBase64, 'documents', docFileName);
        }

        setUploadProgressMsg('Creating Account & Encrypting Password...');

        const regPayload = {
          name,
          phone,
          password,
          role,
          villageOrCity,
          district,
          state: stateName,
          farmSizeAcres: farmSizeAcres ? Number(farmSizeAcres) : undefined,
          shopName: shopName || undefined,
          avatarUrl,
          verificationDocumentUrl
        };

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(regPayload)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        setStoredAuth(data);
        onAuthSuccess(data.user);
        onClose();
      } else {
        // Login mode
        setUploadProgressMsg('Authenticating user...');
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Invalid phone or password');
        }

        setStoredAuth(data);
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
      setUploadProgressMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center font-extrabold text-lg">
              🌾
            </div>
            <div>
              <h3 className="font-bold text-base text-[#D8F3DC]">
                {mode === 'register' ? 'Register KisanDirect Account' : 'KisanDirect User Login'}
              </h3>
              <p className="text-xs text-[#D8F3DC]/80">
                Secure JWT Authentication & Firebase Storage Integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#D8F3DC] hover:text-white text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E0E7DE] bg-[#F4F7F2]">
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
                : 'text-[#5C715C] hover:text-[#1A2E1A]'
            }`}
          >
            New User Registration
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
                : 'text-[#5C715C] hover:text-[#1A2E1A]'
            }`}
          >
            Existing User Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="bg-rose-50 text-rose-800 p-3 rounded-xl border border-rose-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="flex-1 font-medium">{errorMessage}</span>
              </div>
              {errorMessage.toLowerCase().includes('already exists') && (
                <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-rose-700 font-semibold">Already registered with this number?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                    className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors shadow-xs"
                  >
                    Switch to Login
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Demo Credentials for Fast Testing */}
          {mode === 'login' && (
            <div className="bg-[#F4F7F2] p-2.5 rounded-xl border border-[#E0E7DE] space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-[#2D6A4F] flex items-center justify-between">
                <span>Quick Fill Demo Credentials:</span>
                <span className="text-[10px] text-[#5C715C] font-normal">Default Pass: password123</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => { setPhone('+91 98765 43210'); setPassword('password123'); setErrorMessage(''); }}
                  className="bg-white hover:bg-[#E0E7DE] border border-[#E0E7DE] text-[#1A2E1A] px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  🌾 Farmer (Rameshwar)
                </button>
                <button
                  type="button"
                  onClick={() => { setPhone('+91 91234 56789'); setPassword('password123'); setErrorMessage(''); }}
                  className="bg-white hover:bg-[#E0E7DE] border border-[#E0E7DE] text-[#1A2E1A] px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  🏪 Seller (Sri Krishna)
                </button>
                <button
                  type="button"
                  onClick={() => { setPhone('+91 99000 00000'); setPassword('password123'); setErrorMessage(''); }}
                  className="bg-white hover:bg-[#E0E7DE] border border-[#E0E7DE] text-[#1A2E1A] px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  🛡️ Admin (APMC)
                </button>
              </div>
            </div>
          )}

          {/* Role Selection */}
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-[#1A2E1A] block mb-1.5">Select Your Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    role === 'farmer'
                      ? 'bg-[#2D6A4F] text-white border-[#1B4332] shadow-xs'
                      : 'bg-[#F4F7F2] text-[#5C715C] border-[#E0E7DE] hover:border-[#2D6A4F]'
                  }`}
                >
                  <Tractor className="w-4 h-4" />
                  <span>Farmer (రైతు)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    role === 'seller'
                      ? 'bg-[#2D6A4F] text-white border-[#1B4332] shadow-xs'
                      : 'bg-[#F4F7F2] text-[#5C715C] border-[#E0E7DE] hover:border-[#2D6A4F]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Seller / Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'bg-[#1A2E1A] text-white border-[#1A2E1A] shadow-xs'
                      : 'bg-[#F4F7F2] text-[#5C715C] border-[#E0E7DE] hover:border-[#2D6A4F]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mandi Admin</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Name (Registration only) */}
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#5C715C] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rameshwar Patel / Sri Krishna Traders"
                  className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#5C715C] absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5C715C] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Encrypted using BCrypt"
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
              />
            </div>
          </div>

          {/* Additional details for Registration */}
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Village / City</label>
                  <input
                    type="text"
                    required
                    value={villageOrCity}
                    onChange={(e) => setVillageOrCity(e.target.value)}
                    placeholder="e.g. Medak / Kukatpally"
                    className="w-full px-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] block mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Medak / Hyderabad"
                    className="w-full px-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              {role === 'farmer' && (
                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Farm Land Size (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={farmSizeAcres}
                    onChange={(e) => setFarmSizeAcres(e.target.value)}
                    placeholder="e.g. 8.5 Acres"
                    className="w-full px-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              )}

              {role === 'seller' && (
                <div>
                  <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Shop / Business Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Sri Krishna Wholesale Retail"
                    className="w-full px-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              )}

              {/* Firebase Storage File Uploads Section */}
              <div className="border-t border-[#E0E7DE] pt-3 space-y-3">
                <strong className="text-xs font-bold text-[#2D6A4F] block">
                  ☁️ Firebase Storage File Uploads
                </strong>

                {/* Profile Image */}
                <div>
                  <label className="text-xs font-semibold text-[#1A2E1A] block mb-1">
                    Profile Photo ({role === 'farmer' ? 'farmers/' : role === 'seller' ? 'sellers/' : 'documents/'})
                  </label>
                  <div className="flex items-center gap-3">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-[#2D6A4F]" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#F4F7F2] border border-[#E0E7DE] flex items-center justify-center text-[#5C715C]">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <label className="flex-1 bg-[#F4F7F2] hover:bg-[#E0E7DE] border border-[#E0E7DE] px-3 py-2 rounded-xl text-xs font-bold text-[#2D6A4F] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{avatarFileName ? avatarFileName : 'Upload Profile Photo'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Verification Document */}
                <div>
                  <label className="text-xs font-semibold text-[#1A2E1A] block mb-1">
                    Verification Document (documents/)
                  </label>
                  <label className="w-full bg-[#F4F7F2] hover:bg-[#E0E7DE] border border-[#E0E7DE] px-3 py-2 rounded-xl text-xs font-bold text-[#2D6A4F] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{docFileName ? docFileName : 'Upload Kisan Card / Trade License Document'}</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleDocChange} className="hidden" />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{uploadProgressMsg || 'Processing...'}</span>
              </>
            ) : (
              <span>{mode === 'register' ? 'Create Account & Save to Database' : 'Login with JWT Authentication'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
