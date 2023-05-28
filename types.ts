export interface FormValues {
  positivePrompts: string;
  negativePrompts: string;
  cfgScale: number;
  denoiseStrength: number;
  seed: number;
  modelUsed: string
}

export interface SubmitValues {
  positivePrompts: string;
  negativePrompts: string;
  cfgScale: number;
  denoiseStrength: number;
  seed: number;
}

export interface HistoryValues {
  imgUrl: string;
  base64: string;
  positive: string;
  negative: string;
  cfgScale: number;
  denoiseStrength: number;
  model: string;
  seed: number;
}