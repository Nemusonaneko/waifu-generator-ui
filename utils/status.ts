export default function translateStatus(status: string | null | undefined) {
  switch (status) {
    case "completed":
      return "Completed";
    case "delayed":
      return "In queue";
    case "waiting":
      return "In queue";
    case "active":
      return "Generating";
    case "failed":
      return "Failed";
    default:
      return "Not Generating";
  }
}
