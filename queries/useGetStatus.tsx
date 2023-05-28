import { showNotification } from "@mantine/notifications";
import { useQuery } from "react-query";

async function getStatus() {
  try {
    const res = await fetch(`http://localhost:8000/`, {
      method: "GET",
    });
    if (res.status === 200) {
      return true;
    } else {
      throw new Error("Server is Offline");
    }
  } catch (error: any) {
    throw new Error("Server is Offline");
  }
}

export default function useGetStatus() {
  return useQuery(["status"], () => getStatus(), {
    refetchInterval: 10000,
    onError: (error: any) => {
      showNotification({
        message: error.message,
        color: "red",
        loading: false,
      });
    },
  });
}
