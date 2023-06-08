import { showNotification } from "@mantine/notifications";
import { useQuery } from "react-query";

export default function useGetQueue(model: string | null) {
  async function getQueue(model: string | null) {
    try {
      if (!model) return;
      const res = await fetch(
        `https://waifus-api.nemusona.com/job/queue/${model.toLowerCase()}`,
        { method: "GET" }
      );
      if (res.status === 200) {
        return Number(await res.text());
      } else {
        throw new Error("Failed to get queue");
      }
    } catch (error) {
      throw new Error("Failed to get queue");
    }
  }

  return useQuery(["queue", model], () => getQueue(model), {
    refetchInterval: 5000,
    onError: (error: any) => {
      showNotification({
        message: error.message,
        color: "red",
        loading: false,
      });
    },
  });
}
