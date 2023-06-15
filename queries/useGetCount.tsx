import { showNotification } from "@mantine/notifications";
import { useQuery } from "react-query";

async function getCount() {
  try {
    const res = await fetch(`https://waifus-api.nemusona.com/job/count`);
    if (res.status === 200) {
      const result = await res.text();
      return JSON.parse(result);
    } else {
      throw new Error("Failed to get waifu count");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default function useGetCount() {
  return useQuery(["count"], () => getCount(), {
    refetchInterval: 60000,
    onError: (error: any) => {
      showNotification({
        message: error.message,
        color: "red",
        loading: false,
      });
    },
  });
}
