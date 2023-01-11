import { useMutation } from "react-query";
import { GenerateWaifuValues } from "../types";
import { showNotification } from "@mantine/notifications";

async function generateWaifu({
  prevBlob,
  values,
  random,
}: GenerateWaifuValues) {
  try {
    if (prevBlob) {
      URL.revokeObjectURL(prevBlob);
    }
    const body = random
      ? JSON.stringify({})
      : JSON.stringify({
          prompt: values?.positive || "",
          negative_prompt: values?.negative || "",
        });
    const res = await fetch(`https://waifus-api.nemusona.com/api/generate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: body,
    });
    if (res.status === 200) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      return { url, positive: values?.positive, negative: values?.negative };
    } else if (res.status === 429) {
      throw new Error("Rate limit reached. Try again later");
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export default function useGenerateWaifu() {
  return useMutation(
    ({ prevBlob, values, random }: GenerateWaifuValues) =>
      generateWaifu({ prevBlob, values, random }),
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
          message: error.toString(),
          color: "red",
          loading: false,
        });
      },
      onMutate: () => {
        showNotification({
          message: "Generating waifu",
          color: "yellow",
          loading: false,
        });
      },
    }
  );
}
