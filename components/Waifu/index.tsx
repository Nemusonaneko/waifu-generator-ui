import {
  LoadingOverlay,
  Image,
  Center,
  Box,
  Button,
  Group,
  Textarea,
  Text,
} from "@mantine/core";
import useGenerateWaifu from "../../queries/useGenerateWaifu";
import DownloadButton from "../DownloadButton";
import { useForm } from "@mantine/form";
import { FormValues } from "../../types";
import GeneratedPrompt from "../GeneratedPrompt";
import React from "react";
import useGetStatus from "../../queries/useGetStatus";
import { showNotification } from "@mantine/notifications";

export default function Waifu() {
  const [countdown, setCountdown] = React.useState<number>(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const { refetch: fetchStatus, data: amtInQueue } = useGetStatus();

  const {
    mutate: generate,
    data: waifuData,
    isLoading: generating,
  } = useGenerateWaifu();

  const form = useForm({
    initialValues: {
      positive: "",
      negative: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    fetchStatus().then(() => {
      if (amtInQueue) {
        if (amtInQueue >= 30) {
          showNotification({
            message:
              "Too many being generated atm. High chance of it timing out.",
            color: "red",
            loading: false,
          });
          return;
        }
        const eta = amtInQueue * 1.8;
        showNotification({
          message: `There are ${amtInQueue} ppl in queue (ETA ${eta.toFixed(
            0
          )} sec)`,
          color: "yellow",
          loading: true,
        });
        setCountdown(
          eta < 10 ? 20 : eta < 20 ? 30 : eta < 30 ? 40 : eta < 40 ? 50 : 60
        );
      } else {
        setCountdown(60);
      }
      generate({ prevBlob: waifuData?.url, values: values, random: false });
    });
  };

  return (
    <>
      <Box pb={10}>
        <Center>
          <div style={{ width: 512, height: 512, position: "relative" }}>
            <LoadingOverlay visible={generating} overlayBlur={3} />
            <Image
              alt="waifu"
              height={512}
              width={512}
              withPlaceholder={!waifuData}
              src={waifuData?.url}
            />
          </div>
        </Center>
        <Center>
          <Box sx={{ width: 512 }} pt={5}>
            <Group position="right">
              <DownloadButton generating={generating} url={waifuData?.url} />
            </Group>
          </Box>
        </Center>
        {waifuData && (
          <GeneratedPrompt
            positive={waifuData.positive}
            negative={waifuData.negative}
          />
        )}
        <form
          onSubmit={form.onSubmit((values: FormValues) => onSubmit(values))}
        >
          <Textarea
            label="Positive Prompts"
            placeholder="What you want the AI to include"
            {...form.getInputProps("positive")}
            disabled={generating}
            pb={3}
          />
          <Textarea
            label="Negative Prompts"
            placeholder="What you want the AI to avoid"
            {...form.getInputProps("negative")}
            disabled={generating}
          />
          <Group position="right" mt="md">
            {/* <Button
              radius="md"
              size="md"
              onClick={onRandom}
              disabled={generating || countdown > 0}
            >
              Surprise Me {countdown > 0 && `(${countdown})`}
            </Button> */}
            <Text size="sm">{`Being Generated: ${
              amtInQueue ? amtInQueue : "idk"
            }`}</Text>
            <Button
              radius="md"
              size="md"
              type="submit"
              disabled={generating || countdown > 0}
            >
              Generate {countdown > 0 && `(${countdown})`}
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
