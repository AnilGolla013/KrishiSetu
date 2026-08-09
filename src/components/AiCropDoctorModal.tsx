import React, { useState } from 'react';
import { DiseaseAnalysisResult } from '../types';
import { sampleDiseasePhotos } from '../data/mockData';
import {
  Stethoscope,
  Upload,
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Loader2,
  Info
} from 'lucide-react';

interface AiCropDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCropDoctorModal: React.FC<AiCropDoctorModalProps> = ({ isOpen, onClose }) => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [imagePreview, setImagePreview] = useState<string>(sampleDiseasePhotos[0].imageUrl);
  const [userNotes, setUserNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnosis = async () => {
    setLoading(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/ai/disease-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: selectedCrop,
          imageBase64: imagePreview,
          userNotes
        })
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("AI Doctor failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#D8F3DC]">AI Crop Disease Doctor</h3>
              <p className="text-xs text-[#D8F3DC]/80">Instant Plant Pathologist Diagnosis using Leaf Health Vision</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#D8F3DC] hover:text-white text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Sample Photo Pickers */}
          <div>
            <label className="text-xs font-bold text-[#1A2E1A] mb-2 block">
              Choose Sample Diseased Leaf or Upload Your Crop Photo:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sampleDiseasePhotos.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImagePreview(sample.imageUrl);
                    setSelectedCrop(sample.crop);
                  }}
                  className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    imagePreview === sample.imageUrl
                      ? 'border-[#2D6A4F] bg-[#D8F3DC]/30 ring-2 ring-[#2D6A4F]'
                      : 'border-[#E0E7DE] hover:bg-[#F4F7F2]'
                  }`}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[#E0E7DE]"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-[#1A2E1A] block truncate">{sample.crop}</span>
                    <span className="text-[9px] text-[#5C715C] block truncate">{sample.name.split(' ')[1] || 'Disease'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Button & Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="relative h-44 bg-[#F4F7F2] rounded-2xl overflow-hidden border border-[#E0E7DE] flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Leaf Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 text-[#5C715C] mx-auto mb-1" />
                  <span className="text-xs text-[#5C715C] block font-medium">No photo uploaded</span>
                </div>
              )}
              <label className="absolute bottom-2 right-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-xs flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Crop Type</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                >
                  <option value="Tomato">Tomato (టమోటా / टमाटर)</option>
                  <option value="Onion">Onion (ఉల్లిపాయ / प्याज)</option>
                  <option value="Chilli">Chilli (పచ్చిమిర్చి / मिर्च)</option>
                  <option value="Paddy/Rice">Paddy / Rice (వరి / धान)</option>
                  <option value="Cotton">Cotton (పత్తి / कपास)</option>
                  <option value="Brinjal">Brinjal / Eggplant (వంకాయ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1A2E1A] block mb-1">Observed Symptoms / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Yellow spots on bottom leaves after rains..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleRunDiagnosis}
                disabled={loading}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Analyzing Leaf Health...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D8F3DC]" />
                    <span>Run AI Diagnosis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Analysis Result Display */}
          {analysisResult && (
            <div className="bg-[#F4F7F2] border border-[#E0E7DE] p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#E0E7DE] pb-2">
                <div>
                  <span className="text-[10px] text-[#2D6A4F] uppercase font-extrabold tracking-wide block">AI Diagnosis Result</span>
                  <h4 className="font-extrabold text-[#1A2E1A] text-lg">{analysisResult.diseaseName}</h4>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                    analysisResult.severity === 'High' || analysisResult.severity === 'Severe'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-[#FFF4E5] text-[#D97706] border-[#FFE8CC]'
                  }`}>
                    Severity: {analysisResult.severity}
                  </span>
                  <span className="text-[10px] text-[#5C715C] block mt-0.5 font-medium">
                    Confidence: {Math.round(analysisResult.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <strong className="text-xs text-[#1A2E1A] block mb-1 font-bold">Identified Symptoms:</strong>
                <ul className="list-disc list-inside text-xs text-[#5C715C] space-y-0.5">
                  {analysisResult.symptoms.map((symptom, idx) => (
                    <li key={idx}>{symptom}</li>
                  ))}
                </ul>
              </div>

              {/* Treatment Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-[#E0E7DE]">
                  <strong className="text-xs text-[#2D6A4F] flex items-center gap-1 mb-1 font-bold">
                    <Leaf className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    Organic Remedies (సేంద్రీయ చికిత్స)
                  </strong>
                  <ul className="text-[11px] text-[#5C715C] space-y-1 list-disc list-inside">
                    {analysisResult.organicTreatment.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E0E7DE]">
                  <strong className="text-xs text-[#1A2E1A] flex items-center gap-1 mb-1 font-bold">
                    <Stethoscope className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    Chemical Spray Solution
                  </strong>
                  <ul className="text-[11px] text-[#5C715C] space-y-1 list-disc list-inside">
                    {analysisResult.chemicalTreatment.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
