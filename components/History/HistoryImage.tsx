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
  const newUrl = URL.createObjectURL(historyData.blob);
  const queryClient = useQueryClient();
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
        src={newUrl}
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
            <Image src={newUrl} alt="img" width={512} height={512} />
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
            <DownloadButton url={newUrl} generating={false} />
            <Button radius="md" size="xs" color="red" onClick={onDelete}>
              Delete
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
}
