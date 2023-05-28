import { showNotification } from "@mantine/notifications";
import { useQuery } from "react-query";

async function getQueue(model: string | null) {
  try {
    if (!model) {
      // showNotification({
      //   message: "Choose a model",
      //   color: "yellow",
      //   loading: false,
      // });
      return;
    }
    const res = await fetch(
      `http://localhost:8000/queue/${model.toLowerCase()}`,
      {
        method: "GET",
      }
    );
    if (res.status === 200) {
      return Number(await res.text());
    } else {
      throw new Error("Failed to get queue");
    }
  } catch (error: any) {
    throw new Error("Failed to get queue");
  }
}

export default function useGetQueue(model: string | null) {
  return useQuery(["queue", model], () => getQueue(model), {
    refetchInterval: 1000,
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
    onError: (error: any) => {
      showNotification({
        message: error.message,
        color: "red",
        loading: false,
      });
    },
  });
}
