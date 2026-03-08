
import React from 'react';
import { UploadedImage, GenerationSettings } from '../types';
import { SCENE_PRESETS, ASPECT_RATIOS } from '../constants';
import ImageUpload from './ImageUpload';
import { 
  Copy, Loader2, Sparkles, Zap, Crown, Maximize2 
} from 'lucide-react';

interface SidebarProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  mainImage: UploadedImage | null;
  setMainImage: (img: UploadedImage | null) => void;
  refImage1: UploadedImage | null;
  setRefImage1: (img: UploadedImage | null) => void;
  refImage2: UploadedImage | null;
  setRefImage2: (img: UploadedImage | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  progressMsg: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  settings,
  setSettings,
  mainImage,
  setMainImage,
  refImage1,
  setRefImage1,
  refImage2,
  setRefImage2,
  onGenerate,
  isGenerating,
  progressMsg,
}) => {
  const handleImageUpload = (file: File, setter: (img: UploadedImage | null) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setter({
        file,
        previewUrl: URL.createObjectURL(file),
        base64: (reader.result as string).split(',')[1]
      });
    };
    reader.readAsDataURL(file);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(settings.customPrompt);
  };

  return (
    <div className="w-full md:w-[380px] h-full flex flex-col bg-[#162032] border-r border-slate-700/50 overflow-hidden shadow-2xl z-10">
      {/* Tabs */}
      <div className="flex border-b border-slate-700/50 shrink-0">
        <button className="flex-1 py-4 text-[11px] font-black tracking-widest text-orange-500 border-b-2 border-orange-500 bg-orange-500/5 uppercase">
          THIẾT LẬP STUDIO
        </button>
        <button className="flex-1 py-4 text-[11px] font-black tracking-widest text-slate-500 cursor-not-allowed opacity-50 uppercase">
          VIDEO AI (Sắp có)
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8">
        
        {/* Model Selection */}
        <section>
          <h3 className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">CHỌN MODEL AI</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
               onClick={() => setSettings(s => ({ ...s, modelType: 'flash' }))}
               className={`flex flex-col items-center justify-center gap-1 py-3 px-2 border rounded-xl transition-all ${settings.modelType === 'flash' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}
            >
              <Zap size={14} />
              <span className="text-[9px] font-black uppercase">PHỔ THÔNG (FLASH)</span>
            </button>
            <button
               onClick={() => setSettings(s => ({ ...s, modelType: 'pro' }))}
               className={`flex flex-col items-center justify-center gap-1 py-3 px-2 border rounded-xl transition-all ${settings.modelType === 'pro' ? 'border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}
            >
              <Crown size={14} />
              <span className="text-[9px] font-black uppercase">CAO CẤP (PRO)</span>
            </button>
          </div>
          <p className="mt-2 text-[9px] text-slate-500 italic">* Model Flash nhanh và miễn phí, phù hợp tạo nhanh.</p>
        </section>

        {/* Input Setup & Uploads */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.2em]">THIẾT LẬP INPUT</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <button
               onClick={() => setSettings(s => ({ ...s, mode: 'FLATLAY' }))}
               className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${settings.mode === 'FLATLAY' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              FLATLAY
            </button>
            <button
               onClick={() => setSettings(s => ({ ...s, mode: 'MANOCANH' }))}
               className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${settings.mode === 'MANOCANH' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              MANOCANH
            </button>
          </div>

          <ImageUpload 
            label="SẢN PHẨM CHÍNH" 
            required 
            canCrop
            image={mainImage}
            onUpload={(f) => handleImageUpload(f, setMainImage)}
            onRemove={() => setMainImage(null)}
          />

          <div className="grid grid-cols-2 gap-3">
             <ImageUpload 
                label="THAM KHẢO 1" 
                image={refImage1}
                onUpload={(f) => handleImageUpload(f, setRefImage1)}
                onRemove={() => setRefImage1(null)}
              />
             <ImageUpload 
                label="THAM KHẢO 2" 
                image={refImage2}
                onUpload={(f) => handleImageUpload(f, setRefImage2)}
                onRemove={() => setRefImage2(null)}
              />
          </div>

          {/* Aspect Ratio Selection */}
          <div className="pt-2">
            <label className="text-[9px] font-bold text-slate-400 mb-2 block uppercase flex items-center gap-1.5">
              <Maximize2 size={10} className="text-orange-500" />
              Tỷ lệ khung hình:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSettings(s => ({ ...s, aspectRatio: ratio.id as any }))}
                  className={`py-2 text-[9px] font-black rounded-lg border transition-all ${
                    settings.aspectRatio === ratio.id 
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-900/20' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Scene & Prompt */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">BỐI CẢNH & PHONG CÁCH</h3>
          
          <div>
            <label className="text-[9px] font-bold text-slate-400 mb-2 block uppercase">Thư viện không gian:</label>
            <div className="flex flex-wrap gap-1.5">
              {SCENE_PRESETS.map(scene => (
                <button
                  key={scene.id}
                  onClick={() => setSettings(s => ({ ...s, scene: scene.id }))}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${settings.scene === scene.id ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-900/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                >
                  {scene.label}
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="text-[9px] font-bold text-slate-400 mb-2 block uppercase">Prompt tùy chỉnh:</label>
             <div className="relative">
                <textarea 
                  value={settings.customPrompt}
                  onChange={(e) => setSettings(s => ({ ...s, customPrompt: e.target.value }))}
                  rows={4}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-[11px] text-slate-300 focus:border-orange-500 outline-none resize-none leading-relaxed custom-scrollbar"
                />
                <button onClick={copyPrompt} className="absolute bottom-3 right-3 text-slate-600 hover:text-orange-500 transition-colors">
                  <Copy size={12} />
                </button>
             </div>
          </div>
        </section>
      </div>

      {/* FIXED GENERATE BUTTON AT BOTTOM */}
      <div className="p-5 border-t border-slate-700/50 bg-[#162032] shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <button
          onClick={onGenerate}
          disabled={!mainImage || isGenerating}
          className={`
            w-full py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3
            transition-all duration-300 active:scale-95
            ${!mainImage || isGenerating 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
              : settings.modelType === 'flash' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/40 hover:brightness-110'
                : 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl shadow-orange-900/40 hover:brightness-110'}
          `}
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span className="animate-pulse">{progressMsg || 'ĐANG XỬ LÝ...'}</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              TẠO ẢNH ({settings.modelType.toUpperCase()})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
