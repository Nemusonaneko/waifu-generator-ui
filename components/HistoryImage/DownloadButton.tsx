import { Box, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

export default function downloadButton({
  url,
  generating,
}: {
  url: string | undefined;
  generating: boolean;
}) {
  const onDownload = (data: string | undefined) => {
    if (!data) {
      showNotification({
        message: "No Data",
        color: "red",
        loading: false,
      });
      throw new Error("No Data");
    }
    try {
      const element = document.createElement("a");
      element.href = data;
      element.download = `${data}.png`;
      document.body.appendChild(element);
      element.click();
    } catch (error: any) {
      showNotification({
        message: error.message.toString(),
        color: "red",
        loading: false,
      });
      throw new Error(error.message);
    }
  };
  return (
    <>
        <Button
          radius="md"
          size="xs"
          onClick={() => onDownload(url)}
          disabled={generating || !url}
        >
          Download
        </Button>
    </>
  );
}