import { Box, Button, Center, Group, Modal, Text } from "@mantine/core";
import { HistoryValues } from "../../types";
import Image from "next/image";
import React from "react";
import { useQueryClient } from "react-query";
import Tink from "../../public/think.png";
import DownloadButton from "./DownloadButton";
import { translateModel } from "../../utils/models";
import { useWindowSize } from "../../hooks/useWindowSize";

export default function HistoryImage({
  index,
  historyData,
}: {
  index: number;
  historyData: HistoryValues;
}) {
  const [modalOpened, setModalOpened] = React.useState<boolean>(false);
  const queryClient = useQueryClient();
  const [url, setUrl] = React.useState<any>();

  React.useEffect(() => {
    try {
      const buffer = Buffer.from(historyData.base64, "base64");
      const blob = new Blob([buffer]);
      setUrl(URL.createObjectURL(blob));
    } catch {
      setUrl(Tink);
    }
  }, [index, historyData]);

  function onDelete() {
    let current: HistoryValues[] = JSON.parse(
      localStorage.getItem("history") ?? "[]"
    );
    current.splice(index, 1);
    localStorage.setItem("history", JSON.stringify(current));
    queryClient.invalidateQueries();
    setModalOpened(false);
  }

  const windowSize = useWindowSize();

  const isLg = windowSize && windowSize.width && windowSize.width >= 1024;

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
        size={isLg ? "50%" : "100%"}
      >
        <Box sx={{ width: "100%" }}>
          <Center>
            <Image src={url} alt="img" width={isLg ? 400 : 300} height={isLg ? 400 : 300} />
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
