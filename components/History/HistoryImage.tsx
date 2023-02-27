import { Box, Button, Center, Group, Modal } from "@mantine/core";
import { HistoryValues } from "../../types";
import Image from "next/image";
import React from "react";
import GeneratedPrompt from "../GeneratedPrompt";
import DownloadButton from "../DownloadButton";
import { useQueryClient } from "react-query";

export default function HistoryImage({
  index,
  historyData,
}: {
  index: number;
  historyData: HistoryValues;
}) {
  const [modalOpened, setModalOpened] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  let url;
  try {
    if (!historyData.base64) throw Error("No base64");
    const buffer = Buffer.from(historyData.base64, "base64");
    const blob = new Blob([buffer]);
    url = URL.createObjectURL(blob);
  } catch {
    url = historyData.imgUrl;
    throw new Error("Failed to get image");
  }
  function onDelete() {
    let current: HistoryValues[] = JSON.parse(
      localStorage.getItem("history") ?? "[]"
    );
    current.splice(index, 1);
    localStorage.setItem("history", JSON.stringify(current));
    queryClient.invalidateQueries();
    setModalOpened(false);
  }

  return (
    <>
      <Image
        src={url}
        alt="img"
        width={128}
        height={128}
        style={{ padding: 4 }}
        onClick={() => setModalOpened(true)}
      />

      <Modal
        title="Image"
        onClose={() => setModalOpened(false)}
        opened={modalOpened}
        size={544}
      >
        <Box sx={{ width: 512 }}>
          <Center>
            <Image src={url} alt="img" width={512} height={512} />
          </Center>
          <GeneratedPrompt
            positive={historyData.positive}
            negative={historyData.negative}
            cfgScale={historyData.cfgScale}
            denoiseStrength={historyData.denoiseStrength}
            model={historyData.model}
            seed={historyData.seed}
          />
          <Group position="right">
            <DownloadButton url={url} generating={false} />
            <Button radius="md" size="xs" color="red" onClick={onDelete}>
              Delete
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
}
