import { useQuery } from "react-query";

async function getSession() {
  const session = localStorage.getItem("session");
  if (session) return session;
  const newSession = `${Math.round(Date.now() / 1e3)}-${Math.round(
    Math.random() * 1000
  )}`;
  localStorage.setItem("session", newSession.toString());
  return newSession;
}

export default function useGetSession() {
  return useQuery(["sessionQuery"], () => getSession());
}
