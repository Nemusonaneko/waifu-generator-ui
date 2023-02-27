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
  NumberInput,
} from "@mantine/core";
import useGenerateWaifu from "../../queries/useGenerateWaifu";
import DownloadButton from "../DownloadButton";
import { useForm } from "@mantine/form";
import { FormValues, HistoryValues } from "../../types";
import GeneratedPrompt from "../GeneratedPrompt";
import useGetQueue from "../../queries/useGetQueue";
import useGetStatus from "../../queries/useGetStatus";
import { showNotification } from "@mantine/notifications";
import React from "react";
import { useQueryClient } from "react-query";

const SIXTY_SEC = 60 * 1e3;
const THIRTY_SEC = 30 * 1e3;
const FIFTEEN_SEC = 15 * 1e3;

export default function Waifu() {
  const [countdown, setCountdown] = React.useState<number>(0);
  const [nextTime, setNextTime] = React.useState<number>(Date.now());
  const [cfgScale, setCfgScale] = React.useState<number>(10);
  const [seed, setSeed] = React.useState<number>(-1);
  const [denoiseStrength, setDenoiseStrength] = React.useState<number>(0.5);
  const [model, setModel] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const interval = setInterval(() => {
      const time = Math.floor((nextTime - Date.now()) / 1e3);
      setCountdown(0 > time ? 0 : time);
    }, 1e3);
    return () => clearInterval(interval);
  }, [countdown, nextTime]);

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
        if (amtInQueue >= 50) {
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

        const cooldown =
          20 > amtInQueue
            ? FIFTEEN_SEC
            : 30 > amtInQueue
            ? THIRTY_SEC
            : SIXTY_SEC;
        setNextTime(Date.now() + cooldown);
      } else {
        setNextTime(Date.now() + FIFTEEN_SEC);
      }
      generate(
        {
          values: {
            positive: values.positive,
            negative: values.negative,
            cfgScale: cfgScale,
            denoiseStrength: denoiseStrength,
            model: model,
            seed: seed,
          },
        },
        {
          onSuccess: (data) => {
            let current: HistoryValues[] = JSON.parse(
              localStorage.getItem("history") ?? "[]"
            );
            current.unshift({
              imgUrl: data.url,
              base64: data.base64,
              positive: data.positive,
              negative: data.negative,
              cfgScale: data.cfgScale,
              denoiseStrength: data.denoiseStrength,
              model: data.model,
              seed: data.seed,
            });
            localStorage.setItem("history", JSON.stringify(current));
            queryClient.invalidateQueries();
          },
        }
      );
    });
  };

  return (
    <>
      <Box pb={10} sx={{ width: 768 }}>
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
            seed={waifuData.seed}
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
            <Box sx={{ width: 184 }}>
              <Text size="sm">Model</Text>
              <Select
                value={model}
                placeholder="Choose Model"
                disabled={generating}
                data={[
                  { value: "anything", label: "Anything V4.5" },
                  { value: "aom", label: "AOM3" },
                  { value: "counterfeit", label: "Counterfeit V2.5" },
                ]}
                onChange={setModel}
              />
            </Box>
            <Box sx={{ width: 184 }}>
              <Text size="sm">Seed</Text>
              <NumberInput
                hideControls
                value={seed}
                onChange={(s) => setSeed(s ?? -1)}
              />
            </Box>
            <Box sx={{ width: 184 }}>
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
            <Box sx={{ width: 184 }}>
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
