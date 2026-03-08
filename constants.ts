import { ScenePreset, ObjectOption } from './types';

export const DEFAULT_PROMPT = `Premium studio product photography of the exact product from the reference image. Place it on a clean aesthetic set with soft cinematic lighting, shallow depth of field, realistic shadows, high resolution. Keep the product shape, color, logo, and details accurate. Add tasteful decor based on the selected scene preset. No text, no watermark, no extra products.`;

export const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 (Vuông)' },
  { id: '16:9', label: '16:9 (Ngang)' },
  { id: '9:16', label: '9:16 (Dọc)' },
];

export const SCENE_PRESETS: ScenePreset[] = [
  { id: 'MANOCANH', label: 'MANOCANH', description: 'Mannequin display scene, boutique showroom ambiance.' },
  { id: 'MANOCANH_2', label: 'MANOCANH 2', description: 'Alternate sophisticated mannequin composition.' },
  { id: 'VIEW_THOANG', label: 'VIEW THOANG', description: 'Airy bright window light, minimal white room, soft shadows.' },
  { id: 'GOC_DECOR', label: 'GOC DECOR', description: 'Styled corner with decor shelves, frames, cozy atmosphere.' },
  { id: 'MUA_DO', label: 'MUA DO', description: 'Festive red theme, lanterns, holiday decor, warm lighting.' },
];

export const OBJECT_OPTIONS: ObjectOption[] = [
  { id: 'none', label: 'None (Default)', value: '' },
  { id: 'flowers', label: 'Flowers', value: 'fresh flowers arrangement' },
  { id: 'gift_box', label: 'Gift Box', value: 'luxury gift box' },
  { id: 'fruit_tray', label: 'Fruit Tray', value: 'stylized fruit tray' },
  { id: 'lantern', label: 'Lantern Decor', value: 'traditional decorative lanterns' },
  { id: 'fur_rug', label: 'Fabric Fur Rug', value: 'soft fur rug texture' },
  { id: 'ceramic', label: 'Minimal Ceramic', value: 'minimalist ceramic props' },
];
