
import { GoogleGenAI } from "@google/genai";
import { GenerationSettings, UploadedImage, GeneratedImage } from "../types";
import { SCENE_PRESETS } from "../constants";

const getSceneDescription = (sceneId: string) => {
  const scene = SCENE_PRESETS.find(s => s.id === sceneId);
  return scene ? scene.description : '';
};

const generateSingleVariation = async (
  ai: GoogleGenAI,
  mainImage: UploadedImage,
  refImages: UploadedImage[],
  settings: GenerationSettings,
  variationId: number
): Promise<GeneratedImage> => {
  const model = settings.modelType === 'pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  let variationPrompt = "";
  let variationName = "";

  switch (variationId) {
    case 1:
      variationName = "Hero Shot";
      variationPrompt = "Front-facing hero shot, centered composition, perfect lighting for e-commerce listing.";
      break;
    case 2:
      variationName = "3/4 Angle";
      variationPrompt = "3/4 perspective angle, dynamic lighting highlighting textures and edges.";
      break;
    case 3:
      variationName = "Close-up Detail";
      variationPrompt = "Close-up macro shot focusing on material details and logo quality, shallow depth of field.";
      break;
    case 4:
      variationName = "Lifestyle Stylized";
      variationPrompt = "Lifestyle context with creative prop arrangement, atmospheric lighting.";
      break;
  }

  const sceneDesc = getSceneDescription(settings.scene);
  const objectDesc = settings.objectType ? `Include ${settings.objectType} as a prop.` : "";
  const styleDesc = settings.style === 'TRUNG TINH / NGOT' ? 'Neutral, sweet, soft pastel tones.' : 'Bold, sharp, masculine, high contrast.';
  const modeDesc = settings.mode === 'MANOCANH' ? 'Display on a professional mannequin.' : 'Flatlay arrangement.';
  
  const fullPrompt = `
    ${settings.customPrompt}
    
    Specific Instructions for this image:
    - Variation Style: ${variationPrompt}
    - Scene Environment: ${sceneDesc}
    - Mode: ${modeDesc}
    - Aesthetic Style: ${styleDesc}
    - Props: ${objectDesc}
    
    REQUIREMENTS:
    - High realism, professional product photography.
    - Do NOT include text or watermarks.
    - Respect the product's original look from the reference image provided.
  `;

  const parts: any[] = [];
  
  parts.push({
    inlineData: {
      data: mainImage.base64,
      mimeType: mainImage.file.type
    }
  });

  refImages.forEach(img => {
     parts.push({
      inlineData: {
        data: img.base64,
        mimeType: img.file.type
      }
    });
  });

  parts.push({ text: fullPrompt });

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts },
    config: {
      imageConfig: {
        imageSize: settings.modelType === 'pro' ? '1K' : undefined,
        aspectRatio: settings.aspectRatio
      }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) {
      throw new Error("Không tìm thấy dữ liệu ảnh trong phản hồi của AI.");
  }

  return {
    id: `${Date.now()}-${variationId}`,
    url: imageUrl,
    prompt: fullPrompt,
    variationName
  };
};

export const generateProductPhotos = async (
  mainImage: UploadedImage,
  refImages: UploadedImage[],
  settings: GenerationSettings,
  onProgress: (msg: string) => void,
  customApiKey?: string
): Promise<GeneratedImage[]> => {
  
  const ensureKey = async () => {
    // If we have a custom key, we don't need to check AI Studio
    if (customApiKey) return;

    if ((window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        onProgress("Vui lòng chọn API Key cá nhân (Paid) để tránh lỗi 429...");
        await (window as any).aistudio.openSelectKey();
      }
    }
  };

  // Luôn khuyến khích dùng key riêng khi tạo nhiều biến thể để tránh quota chung
  await ensureKey();

  const results: GeneratedImage[] = [];
  const variationIds = [1, 2, 3, 4];

  onProgress(`Khởi tạo Studio ${settings.modelType.toUpperCase()}...`);

  for (const id of variationIds) {
    let retryCount = 0;
    const maxRetries = 2; // Tăng số lần thử lại cho 429

    while (retryCount <= maxRetries) {
      try {
        onProgress(`Đang tạo biến thể ${id}/4...`);
        
        // Use custom key if provided, otherwise fallback to process.env.API_KEY (which is injected by platform)
        const apiKey = customApiKey || process.env.API_KEY || '';
        const ai = new GoogleGenAI({ apiKey });
        const result = await generateSingleVariation(ai, mainImage, refImages, settings, id);
        results.push(result);
        
        // Delay giữa các lần gọi để tránh spam API gây lỗi 429
        // Tăng delay lên 2.5 giây để ổn định hơn
        if (id < 4) await new Promise(r => setTimeout(r, 2500));
        break; 
        
      } catch (error: any) {
        console.error(`Lỗi tại biến thể ${id}:`, error);
        
        const errorMessage = error.message || JSON.stringify(error);
        const isQuotaError = errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED");
        const isPermissionError = errorMessage.includes("403") || errorMessage.includes("PERMISSION_DENIED");
        const isNotFoundError = errorMessage.includes("Requested entity was not found");

        if ((isQuotaError || isPermissionError || isNotFoundError) && retryCount < maxRetries) {
          const msg = isQuotaError 
            ? "HẾT HẠN MỨC (429). Đang chờ 5s và yêu cầu Key mới..." 
            : "LỖI PHÂN QUYỀN (403). Vui lòng chọn lại Key...";
          
          onProgress(msg);
          
          // Chờ lâu hơn một chút nếu là lỗi quota
          await new Promise(r => setTimeout(r, 5000));
          
          // Mở lại bảng chọn Key nếu không có custom key
          if (!customApiKey && (window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
          }
          
          retryCount++;
          onProgress(`Thử lại lần ${retryCount} cho biến thể ${id}/4...`);
          continue; 
        }
        
        if (results.length === 0) {
          throw new Error(`Lỗi hệ thống (${errorMessage}). Vui lòng dùng API Key cá nhân từ một dự án Google Cloud có bật Billing để không bị giới hạn.`);
        }
        // Nếu đã tạo được ít nhất 1 ảnh thì cứ tiếp tục qua ảnh sau
        break; 
      }
    }
  }

  if (results.length === 0) {
    throw new Error("Không thể hoàn tất tạo ảnh. Hãy chắc chắn bạn đang dùng API Key có hiệu lực và còn hạn mức.");
  }

  onProgress("Hoàn tất bộ ảnh!");
  return results;
};
