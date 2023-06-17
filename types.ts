export interface FormValues {
  positivePrompts: string;
  negativePrompts: string;
  cfgScale: number;
  denoiseStrength: number;
  seed: number;
  modelUsed: string;
  session: number | string | undefined;
}

export interface SubmitValues {
  positivePrompts: string;
  negativePrompts: string;
  cfgScale: number;
  denoiseStrength: number;
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

export interface ResultValues {
  form: FormValues;
  jobId: string | null;
}
