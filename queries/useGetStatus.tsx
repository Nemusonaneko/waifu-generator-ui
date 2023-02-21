import { showNotification } from "@mantine/notifications";
import { useQuery } from "react-query";

async function getStatus(model: string | null) {
  try {
    if (!model) throw new Error("No model selected");
    const res = await fetch(
      `https://waifus-api.nemusona.com/queue/${model.toLowerCase()}`,
      {
        method: "GET",
      }
    );
    if (res.status === 200) {
      return Number(await res.text());
    } else {
      throw new Error("Server Offline");
    }
  } catch (error: any) {
    throw new Error("Server Offline");
  }
}

export default function useGetStatus(model: string | null) {
  return useQuery(["status", model], () => getStatus(model), {
    refetchInterval: 5000,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    // onSuccess: () => {
    //   showNotification({
    //     message: "Server is active",
    //     color: "green",
    //     loading: false,
    //   });
    // },
    onError: () => {
      showNotification({
        message: "Server is down",
        color: "red",
        loading: false,
      });
    },
  });
}
