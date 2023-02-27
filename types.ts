export interface FormValues {
  positive: string;
  negative: string;
}

export interface FullFormValues {
  positive: string;
  negative: string;
  cfgScale: number;
  denoiseStrength: number;
  model: string | null;
  seed: number;
}

export interface GenerateWaifuValues {
  values: FullFormValues | null;
}

export interface HistoryValues {
  imgUrl: string;
  positive: string;
  negative: string;
  cfgScale: number;
  denoiseStrength: number;
  model: string;
  seed: number;
}
