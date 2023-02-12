import { showNotification } from "@mantine/notifications";
import { useQuery } from "react-query";

async function getStatus() {
  try {
    const res = await fetch("https://waifus-api.nemusona.com/queue", {
      method: "GET",
    });
    if (res.status === 200) {
      const result = await res.json();
      return (
        Number(result.active) + Number(result.delayed) + Number(result.waiting)
      );
    } else {
      throw new Error("Server Offline");
    }
  } catch (error: any) {
    throw new Error("Server Offline");
  }
}

export default function useGetStatus() {
  return useQuery(["status"], () => getStatus(), {
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
    onError: () => {
      showNotification({
        message: "Server is down",
        color: "red",
        loading: false,
      });
    },
  });
}
