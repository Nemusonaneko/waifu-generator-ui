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
}

export interface GenerateWaifuValues {
  values: FullFormValues | null;
}
