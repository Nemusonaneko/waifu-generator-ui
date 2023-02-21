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
      const buffer = Buffer.from(await res.text(), "base64");
      const blob = new Blob([buffer]);
      const url = URL.createObjectURL(blob);
      return {
        url,
        positive: values.positive,
        negative: values.negative,
        cfgScale: values.cfgScale,
        denoiseStrength: values.denoiseStrength,
        model: values.model,
      };
    } else if (res.status === 429) {
      throw new Error("Rate limit reached. Try again later");
    } else if (res.status === 503) {
      throw new Error("Server not ready to take request");
    } else if (res.status === 404) {
      throw new Error("Error in server response");
    } else {
      throw new Error(
        `Something went wrong status: ${res.status} message: ${res.statusText}`
      );
    }
  } catch (error: any) {
    throw new Error(`Something went wrong ${error}`);
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
