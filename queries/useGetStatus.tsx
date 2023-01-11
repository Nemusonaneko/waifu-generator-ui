import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";

async function getStatus() {
  try {
    const res = await fetch("https://waifus-api.nemusona.com/api/status", {
      method: "GET",
    });
    if (res.status === 200) {
      return true;
    } else {
      throw new Error("Server Offline");
    }
  } catch (error: any) {
    throw new Error("Server Offline");
  }
}

export default function useGetStatus() {
  return useQuery(["status"], () => getStatus(), {
    refetchInterval: 10000,
    onSuccess: () => {
      // showNotification({
      //   message: "Server is active",
      //   color: "green",
      //   loading: false,
      // });
    },
    onError: () => {
      showNotification({
        message: "Server is down",
        color: "red",
        loading: false,
      });
    },
  });
}
