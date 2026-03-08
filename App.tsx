
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Gallery from './components/Gallery';
import { UploadedImage, GeneratedImage, GenerationSettings } from './types';
import { DEFAULT_PROMPT, SCENE_PRESETS } from './constants';
import { generateProductPhotos } from './services/geminiService';
import { Camera, ShieldCheck, Key, X, Download } from 'lucide-react';

function App() {
  const [mainImage, setMainImage] = useState<UploadedImage | null>(null);
  const [refImage1, setRefImage1] = useState<UploadedImage | null>(null);
  const [refImage2, setRefImage2] = useState<UploadedImage | null>(null);
  
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio) {
        const status = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(status || !!customApiKey);
      } else {
        setHasKey(!!customApiKey);
      }
    };
    checkKey();
    const interval = setInterval(checkKey, 3000);
    return () => clearInterval(interval);
  }, [customApiKey]);

  const [settings, setSettings] = useState<GenerationSettings>({
    mode: 'FLATLAY',
    style: 'TRUNG TINH / NGOT',
    aspectRatio: '1:1',
    objectType: '',
    customPrompt: DEFAULT_PROMPT,
    scene: SCENE_PRESETS[0].id,
    modelType: 'flash' 
  });

  const handleGenerate = async () => {
    if (!mainImage) return;

    setIsGenerating(true);
    setProgressMsg('Khởi động AI Engine...');

    try {
      const refs = [refImage1, refImage2].filter(Boolean) as UploadedImage[];
      const results = await generateProductPhotos(mainImage, refs, settings, setProgressMsg, customApiKey);
      setGeneratedImages(results);
    } catch (error: any) {
      console.error(error);
      const isQuota = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
      if (isQuota) {
        setShowKeyInput(true);
        alert(
          `HẾT HẠN MỨC MIỄN PHÍ (429):\n\nHệ thống đã đạt giới hạn tạo ảnh miễn phí. \n\nVui lòng nhập API Key cá nhân của bạn để tiếp tục sử dụng.`
        );
      } else {
        alert(`LỖI HỆ THỐNG: ${error.message || 'Có lỗi xảy ra.'}`);
      }
    } finally {
      setIsGenerating(false);
      setProgressMsg('');
    }
  };

  const handleOpenKey = async () => {
    await (window as any).aistudio.openSelectKey();
  };

  const downloadImage = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `studio-manh-ai-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-xl shadow-orange-900/40 border border-orange-400/20">
             <Camera className="text-white" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tighter uppercase leading-none">Studio 2026 - Manh AI</h1>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 text-[8px] font-bold border border-slate-700">v2.1</span>
            </div>
            <p className="text-[9px] text-orange-500 font-black tracking-[0.3em] uppercase opacity-80 mt-1">Product Photography AI</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <button 
             onClick={() => setShowKeyInput(true)}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 ${hasKey ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-orange-500/50 bg-orange-500/10 text-orange-500 animate-pulse'}`}
           >
             <Key size={14} />
             <span className="text-[10px] font-black uppercase tracking-wider">{hasKey ? 'API Key: Active' : 'Setup API Key'}</span>
           </button>
           
           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all hidden sm:block ${settings.modelType === 'pro' ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-cyan-500 bg-cyan-500/10 text-cyan-500'}`}>
              {settings.modelType === 'pro' ? 'PREMIUM' : 'FREE'}
           </div>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyInput && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowKeyInput(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white tracking-tight uppercase">Cấu hình API Key</h3>
              <button onClick={() => setShowKeyInput(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Để sử dụng ổn định và không bị giới hạn, hãy nhập API Key Gemini của bạn. 
              Bạn có thể lấy key miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-orange-500 hover:underline">Google AI Studio</a>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Gemini API Key</label>
                <input 
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Nhập API Key của bạn tại đây..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all"
                />
              </div>

              {(window as any).aistudio && (
                <div className="pt-2">
                  <div className="relative flex items-center py-3">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">Hoặc dùng Key Studio</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                  </div>
                  <button 
                    onClick={handleOpenKey}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Chọn Key từ AI Studio
                  </button>
                </div>
              )}

              <button 
                onClick={() => setShowKeyInput(false)}
                className="w-full py-4 mt-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-black text-xs tracking-widest hover:brightness-110 transition-all"
              >
                LƯU THAY ĐỔI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        <Sidebar 
          settings={settings}
          setSettings={setSettings}
          mainImage={mainImage}
          setMainImage={setMainImage}
          refImage1={refImage1}
          setRefImage1={setRefImage1}
          refImage2={refImage2}
          setRefImage2={setRefImage2}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          progressMsg={progressMsg}
        />
        <Gallery 
          images={generatedImages} 
          onSelectImage={setSelectedImage}
        />
      </main>

      {/* Shared Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/98 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          />
          <div className="relative max-w-6xl w-full h-[85vh] md:h-full flex flex-col md:flex-row bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <div className="flex-1 bg-black flex items-center justify-center p-4 relative overflow-hidden">
               <img 
                 src={selectedImage.url} 
                 alt={selectedImage.variationName}
                 className="max-w-full max-h-full object-contain select-none"
               />
               <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-2.5 bg-slate-800/80 hover:bg-red-500 text-white rounded-full transition-all z-10 backdrop-blur-md"
               >
                 <X size={22} />
               </button>
            </div>
            
            <div className="w-full md:w-96 bg-[#162032] border-l border-slate-800 flex flex-col p-8">
              <div className="mb-10">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] block mb-3">PRODUCTION INFO</span>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tighter">{selectedImage.variationName}</h2>
                <div className="h-1.5 w-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full" />
              </div>

              <div className="flex-1 space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">AI PROMPT</label>
                  <div className="text-[11px] text-slate-300 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 italic leading-relaxed">
                    "{selectedImage.prompt}"
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center py-2 border-b border-slate-800/50 text-[11px]">
                     <span className="text-slate-500 font-bold uppercase">Format</span>
                     <span className="text-slate-300 font-mono">PNG 24-bit</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-slate-800/50 text-[11px]">
                     <span className="text-slate-500 font-bold uppercase">Resolution</span>
                     <span className="text-slate-300 font-mono">1024x1024 px</span>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => downloadImage(selectedImage.url, selectedImage.id)}
                className="w-full py-5 mt-8 bg-gradient-to-r from-orange-600 to-red-600 hover:brightness-110 text-white rounded-2xl font-black text-xs tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-900/20"
              >
                <Download size={18} />
                TẢI ẢNH GỐC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
