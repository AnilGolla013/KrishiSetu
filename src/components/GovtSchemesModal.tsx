import React from 'react';
import { govtSchemes } from '../data/mockData';
import {
  Landmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface GovtSchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GovtSchemesModal: React.FC<GovtSchemesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#D8F3DC]">Government Agricultural Schemes</h3>
              <p className="text-xs text-[#D8F3DC]/80">Official Subsidies, Income Support & Crop Insurance</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {govtSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-[#F4F7F2] p-4 rounded-xl border border-[#E0E7DE] space-y-2 hover:border-[#2D6A4F] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-[#1A2E1A] text-sm">{scheme.title}</h4>
                  <span className="bg-[#D8F3DC] text-[#2D6A4F] text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap border border-[#B7E4C7]">
                    {scheme.category}
                  </span>
                </div>

                <p className="text-xs text-[#5C715C] font-medium">{scheme.description}</p>

                <div className="bg-white p-2.5 rounded-lg border border-[#E0E7DE] text-xs space-y-1">
                  <div>
                    <strong className="text-[#1A2E1A] text-[11px]">Eligibility: </strong>
                    <span className="text-[#5C715C] text-[11px]">{scheme.eligibility}</span>
                  </div>
                  <div>
                    <strong className="text-[#2D6A4F] text-[11px]">Financial Benefit: </strong>
                    <span className="text-[#2D6A4F] font-bold text-[11px]">{scheme.benefit}</span>
                  </div>
                </div>

                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] pt-1"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
