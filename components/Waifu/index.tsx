import {
  LoadingOverlay,
  Image,
  Center,
  Box,
  Button,
  Group,
  Textarea,
  Text,
  Slider,
  Select,
} from "@mantine/core";
import useGenerateWaifu from "../../queries/useGenerateWaifu";
import DownloadButton from "../DownloadButton";
import { useForm } from "@mantine/form";
import { FormValues } from "../../types";
import GeneratedPrompt from "../GeneratedPrompt";
import useGetQueue from "../../queries/useGetQueue";
import useGetStatus from "../../queries/useGetStatus";
import { showNotification } from "@mantine/notifications";
import React from "react";

export default function Waifu() {
  const [countdown, setCountdown] = React.useState<number>(0);
  const [cfgScale, setCfgScale] = React.useState(10);
  const [denoiseStrength, setDenoiseStrength] = React.useState<number>(0);
  const [model, setModel] = React.useState<string | null>(null);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const { refetch: fetchStatus, data: amtInQueue } = useGetQueue(model);
  const {} = useGetStatus();

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

  const onSubmit = (values: FormValues, cfgScale: number) => {
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
        showNotification({
          message: `There are ${amtInQueue} ppl in queue.`,
          color: "yellow",
          loading: true,
        });
        setCountdown(amtInQueue >= 15 ? 60 : 30);
      } else {
        setCountdown(60);
      }
      generate({
        values: {
          positive: values.positive,
          negative: values.negative,
          cfgScale: cfgScale,
          denoiseStrength: denoiseStrength,
          model: model,
        },
      });
    });
  };

  return (
    <>
      <Box pb={10} sx={{ width: 600 }}>
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
            cfgScale={waifuData.cfgScale}
            denoiseStrength={waifuData.denoiseStrength}
            model={waifuData.model}
          />
        )}
        <form
          onSubmit={form.onSubmit((values: FormValues) =>
            onSubmit(values, cfgScale)
          )}
        >
          <Textarea
            label="Positive Prompts"
            placeholder="What you want the AI to include"
            {...form.getInputProps("positive")}
            disabled={generating}
            pb={3}
            autosize
          />
          <Textarea
            label="Negative Prompts"
            placeholder="What you want the AI to avoid"
            {...form.getInputProps("negative")}
            disabled={generating}
            autosize
          />
          <Group spacing="xs" pt={5}>
            <Box sx={{ width: 192 }}>
              <Text size="sm">Model</Text>
              <Select
                value={model}
                placeholder="Choose Model"
                disabled={generating}
                data={[
                  { value: "anything", label: "Anything V4" },
                  { value: "aom", label: "AOM3" },
                  { value: "counterfeit", label: "Counterfeit V2.5" },
                ]}
                onChange={setModel}
              />
            </Box>
            <Box sx={{ width: 192 }}>
              <Text size="sm">CFG Scale</Text>
              <Slider
                pt={5}
                min={0}
                max={20}
                marks={[
                  { value: 0, label: "0" },
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                  { value: 15, label: "15" },
                  { value: 20, label: "20" },
                ]}
                value={cfgScale}
                onChange={setCfgScale}
                disabled={generating}
              />
            </Box>
            <Box sx={{ width: 192 }}>
              <Text size="sm">Denoise Strength</Text>
              <Slider
                pt={5}
                min={0}
                max={1}
                marks={[
                  { value: 0, label: "0" },
                  { value: 0.25, label: ".25" },
                  { value: 0.5, label: ".5" },
                  { value: 0.75, label: ".75" },
                  { value: 1, label: "1" },
                ]}
                value={Number(
                  (Math.round(denoiseStrength * 500) / 500).toFixed(2)
                )}
                onChange={setDenoiseStrength}
                step={0.05}
                disabled={generating}
              />
            </Box>
          </Group>
          <Group position="right" mt="md" pt={10}>
            {/* <Button
              radius="md"
              size="md"
              onClick={onRandom}
              disabled={generating || countdown > 0}
            >
              Surprise Me {countdown > 0 && `(${countdown})`}
            </Button> */}
            <Text size="sm">{`Currently Generating: ${
              amtInQueue ? amtInQueue : 0
            } Waifu(s)`}</Text>
            <Button
              radius="md"
              size="md"
              type="submit"
              disabled={generating || countdown > 0 || !model}
            >
              Generate {countdown > 0 && `(${countdown})`}
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
