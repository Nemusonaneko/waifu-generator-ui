import { useMutation } from "react-query";
import { GenerateWaifuValues } from "../types";
import { showNotification } from "@mantine/notifications";

async function generateWaifu({ values }: GenerateWaifuValues) {
  try {
    if (!values) throw new Error("No values");
    if (!values.model) throw new Error("No model selected");
    const body = JSON.stringify({
      prompt: values?.positive || "",
      negative_prompt: values?.negative || "",
      cfg_scale: values?.cfgScale || 10,
      denoising_strength: values?.denoiseStrength || 0,
      seed: values?.seed,
    });
    const res: Response = await fetch(
      `https://waifus-api.nemusona.com/generate/${values.model.toLowerCase()}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: body,
      }
    );
    if (res.status === 200) {
      const json = await res.json();
      const buffer = Buffer.from(json.base64, "base64");
      const blob = new Blob([buffer]);
      const url = URL.createObjectURL(blob);
      return {
        url,
        base64: json.base64,
        positive: json.positive,
        negative: json.negative,
        cfgScale: json.cfg_scale,
        denoiseStrength: json.denoising_strength,
        model: json.model,
        seed: json.seed,
      };
    } else {
      throw new Error(`${res.status}:${res.statusText}`);
    }
  } catch (error: any) {
    throw new Error(`${error}`);
  }
}

export default function useGenerateWaifu() {
  return useMutation(
    ({ values }: GenerateWaifuValues) => generateWaifu({ values }),
    {
      onSuccess: () => {
        showNotification({
          message: "Waifu generated",
          color: "green",
          loading: false,
        });
      },
      onError: (error: any) => {
        showNotification({
          message: error.message.toString(),
          color: "red",
          loading: false,
        });
      },
      onMutate: () => {
        showNotification({
          message: "Generating waifu",
          color: "yellow",
          loading: true,
        });
      },
    }
  );
}
