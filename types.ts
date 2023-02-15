export interface FormValues {
  positive: string;
  negative: string;
}

export interface FullFormValues {
  positive: string;
  negative: string;
  cfgScale: number;
  denoiseStrength: number;
}

export interface GenerateWaifuValues {
  prevBlob: string | undefined | null;
  values: FullFormValues | null;
}
