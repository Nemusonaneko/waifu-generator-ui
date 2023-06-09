import { showNotification } from "@mantine/notifications";
import { useQuery } from "react-query";

async function getGenStatus(
  model: string | null | undefined,
  jobId: string | null | undefined
) {
  try {
    if (!model) return null;
    if (!jobId) return null;
    const res = await fetch(
      `https://waifus-api.nemusona.com/job/status/${model}/${jobId}`
    );
    if (res.status === 200) {
      return await res.text();
    } else {
      throw new Error("Failed to get Status");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default function useGetGenStatus(
  model: string | null | undefined,
  jobId: string | null | undefined
) {
  return useQuery(
    ["genStatus", model, jobId],
    () => getGenStatus(model, jobId),
    {
      onError: (error: any) => {
        showNotification({
          message: error.message,
          color: "red",
          loading: false,
        });
      },
    }
  );
}
