import { useQuery } from "react-query";
import { HistoryValues } from "../types";

async function getQueue() {
  const result: HistoryValues[] = JSON.parse(
    localStorage.getItem("history") ?? "[]"
  );
  return result;
}

export default function useGetHistory() {
  return useQuery(["historyQuery"], () => getQueue(), {});
}
