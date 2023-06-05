import { useMutation } from "react-query";
import { FormValues } from "../types";
import { showNotification } from "@mantine/notifications";

async function generateWaifu(values: FormValues) {
  try {
    if (!values) throw new Error("No values");
    if (!values.modelUsed) throw new Error("No model selected");
    const body = JSON.stringify({
      prompt: values?.positivePrompts || "",
      negative_prompt: values?.negativePrompts || "",
      cfg_scale: values?.cfgScale || 10,
      denoising_strength: values?.denoiseStrength || 0,
      seed: values?.seed,
    });
    const res: Response = await fetch(
      `https://waifus-api.nemusona.com/job/submit/${values.modelUsed.toLowerCase()}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://waifus.nemusona.com",
        },
        body: body,
      }
    );
    if (res.status === 201) {
      return await res.text();
    } else {
      throw new Error(`${res.status}:${res.statusText}`);
    }
  } catch (error: any) {
    throw new Error(`${error}`);
  }
}

export default function useGenerateWaifu() {
  return useMutation((values: FormValues) => generateWaifu(values), {
    onSuccess: () => {
      showNotification({
        message: "Submitted to Queue",
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
        message: "Submitting to queue",
        color: "yellow",
        loading: true,
      });
    },
  });
}
