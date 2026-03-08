
import React from 'react';
import { Download, Image as ImageIcon, Maximize2, ExternalLink } from 'lucide-react';
import { GeneratedImage } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
  onSelectImage: (img: GeneratedImage) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onSelectImage }) => {
  const downloadImage = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `studio-manh-ai-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => {
        downloadImage(img.url, img.id);
      }, index * 500);
    });
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0f172a] overflow-hidden relative">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0f172a]/95 backdrop-blur-md z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <h2 className="text-white font-black tracking-[0.3em] text-[10px] uppercase">
            WORK STATION / RESULTS
          </h2>
        </div>
        
        {images.length > 0 && (
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{images.length} VARIATIONS COMPLETED</span>
            <button 
              onClick={downloadAll}
              className="text-[10px] font-black tracking-widest text-white bg-orange-600 hover:bg-orange-500 flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-xl shadow-orange-900/20 active:scale-95"
            >
              <Download size={14} />
              DOWNLOAD ALL (.ZIP)
            </button>
          </div>
        )}
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-gradient-to-b from-slate-900 to-black">
        {images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <div className="relative mb-8">
              <div className="absolute -inset-10 bg-orange-500/5 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-40 h-40 border border-slate-800 rounded-[2.5rem] flex items-center justify-center bg-slate-800/20 backdrop-blur-xl">
                <ImageIcon size={64} className="text-slate-800" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-400 mb-2 uppercase tracking-tighter">Ready for Production</h3>
            <p className="text-[11px] text-slate-500 max-w-[320px] text-center leading-relaxed font-bold uppercase tracking-widest opacity-60">
              Upload your main product image and configure the studio parameters to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
            {images.map((img, idx) => (
              <div 
                key={img.id} 
                className="group relative rounded-[2rem] overflow-hidden bg-[#162032] border border-slate-800 shadow-2xl transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-2 animate-in fade-in zoom-in-95"
                style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
              >
                {/* Image Container */}
                <div 
                  className="aspect-square cursor-zoom-in relative overflow-hidden flex items-center justify-center bg-black"
                  onClick={() => onSelectImage(img)}
                >
                  <img 
                    src={img.url} 
                    alt={img.variationName} 
                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Maximize2 size={32} className="text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Footer Info */}
                <div className="p-6 bg-[#162032]/95 backdrop-blur-md border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-white text-sm font-black uppercase tracking-widest mb-1">{img.variationName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Studio Master Quality</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onSelectImage(img)}
                      className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
                    >
                      <ExternalLink size={20} />
                    </button>
                    <button 
                      onClick={() => downloadImage(img.url, img.id)}
                      className="bg-slate-800 hover:bg-orange-600 text-white p-3 rounded-2xl transition-all shadow-lg"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
