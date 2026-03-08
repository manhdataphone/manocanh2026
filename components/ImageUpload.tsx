import React, { useRef } from 'react';
import { Upload, X, Scissors } from 'lucide-react';
import { UploadedImage } from '../types';

interface ImageUploadProps {
  label: string;
  image: UploadedImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  required?: boolean;
  canCrop?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  image, 
  onUpload, 
  onRemove, 
  required = false,
  canCrop = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
        {image && canCrop && (
             <button className="text-[10px] bg-slate-700 hover:bg-slate-600 text-orange-400 px-2 py-0.5 rounded flex items-center gap-1 transition-colors">
                <Scissors size={10} />
                CHI CAT LAY
             </button>
        )}
      </div>

      <div 
        className={`
          relative w-full aspect-[4/3] rounded-lg border-2 border-dashed 
          ${image ? 'border-orange-500/50 bg-slate-800' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'}
          transition-all duration-200 group overflow-hidden
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {image ? (
          <>
            <img 
              src={image.previewUrl} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="bg-black/60 hover:bg-red-500/80 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            {/* Optional overlay hint */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none" />
          </>
        ) : (
          <div 
            onClick={triggerUpload}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-slate-300"
          >
            <Upload size={24} className="mb-2 opacity-50" />
            <span className="text-xs font-medium">TAI ANH</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
