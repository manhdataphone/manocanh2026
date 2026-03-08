
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  variationName: string;
}

export interface GenerationSettings {
  mode: 'FLATLAY' | 'MANOCANH';
  style: 'TRUNG TINH / NGOT' | 'NAM GON';
  aspectRatio: '1:1' | '16:9' | '9:16';
  objectType: string;
  customPrompt: string;
  scene: string;
  modelType: 'flash' | 'pro';
}

export type ScenePreset = {
  id: string;
  label: string;
  description: string;
};

export type ObjectOption = {
  id: string;
  label: string;
  value: string;
};

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
}
