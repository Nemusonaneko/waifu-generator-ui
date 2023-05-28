import { Box, Button, Center, Group, Modal, Text } from "@mantine/core";
import { HistoryValues } from "../../types";
import Image from "next/image";
import React from "react";
import { useQueryClient } from "react-query";
import Tink from "../../public/think.png";
import DownloadButton from "./DownloadButton";
import { translateModel } from "../../utils/models";

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
    const buffer = Buffer.from(historyData.base64, "base64");
    const blob = new Blob([buffer]);
    url = URL.createObjectURL(blob);
  } catch {
    url = Tink;
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
        style={{ padding: 3 }}
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
          <Box sx={{ wordWrap: "break-word", overflow: "auto" }}>
            <Text size="lg" fw={500}>
              Prompt Information:
            </Text>
            <Text size="md">Positive Prompts:</Text>
            <Text size="sm">{historyData?.positive}</Text>
            <Text size="md">Negative Prompts:</Text>
            <Text size="sm">{historyData?.negative}</Text>
            <Text size="md">CFG Scale: {historyData?.cfgScale}</Text>
            <Text size="md">
              {`Denoise Strength: ${(
                Math.round(historyData?.denoiseStrength * 500) / 500
              ).toFixed(2)}`}
            </Text>
            <Text size="md">Seed: {historyData?.seed}</Text>
            <Text size="md">Model: {translateModel(historyData?.model)}</Text>
          </Box>
          <Group position="right">
            {typeof url === "string" && (
              <DownloadButton url={url} generating={false} />
            )}
            <Button radius="md" size="xs" color="red" onClick={onDelete}>
              Delete
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
}
