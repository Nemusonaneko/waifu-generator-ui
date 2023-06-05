import { useMutation } from "react-query";
import { ResultValues } from "../types";
import { showNotification } from "@mantine/notifications";

async function getResult(values: ResultValues) {
  try {
    if (!values.form.modelUsed) throw new Error("No model");
    if (!values.jobId) throw new Error("No jobId");

    const res = await fetch(
      `https://waifus-api.nemusona.com/job/result/${values.form.modelUsed}/${values.jobId}`
    );

    if (res.status !== 200) throw new Error("Failed to fetch image");
    const json = await res.json();
    const buffer = Buffer.from(json.base64, "base64");
    const blob = new Blob([buffer]);
    const url = URL.createObjectURL(blob);
    return {
      url,
      base64: json.base64,
      positive: values.form.positivePrompts,
      negative: values.form.negativePrompts,
      cfgScale: values.form.cfgScale,
      denoiseStrength: values.form.denoiseStrength,
      model: values.form.modelUsed,
      seed: json.seed,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default function useGetResult() {
  return useMutation((values: ResultValues) => getResult(values), {
    onSuccess: () => {
      showNotification({
        message: "Waifu fetched",
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
        message: "Fetching waifu",
        color: "yellow",
        loading: true,
      });
    },
  });
}
