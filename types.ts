export interface FormValues {
  positive: string;
  negative: string;
}

export interface GenerateWaifuValues {
    prevBlob: string | undefined | null;
    values: FormValues | null;
    random: boolean;
}
