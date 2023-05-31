import Layout from "../layout";
import {
  Text,
  Button,
  Flex,
  Box,
  Stack,
  Textarea,
  Slider,
  NumberInput,
  Select,
  Center,
  Tooltip,
  UnstyledButton,
  Group,
} from "@mantine/core";
import Image from "next/image";
import DogO from "../public/DogO.png";
import React from "react";
import { HistoryValues, SubmitValues } from "../types";
import useGetQueue from "../queries/useGetQueue";
import useGetStatus from "../queries/useGetStatus";
import useGenerateWaifu from "../queries/useGenerateWaifu";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "react-query";
import History from "../components/HistoryImage/History";
import { useForm } from "@mantine/form";
import { translateModel } from "../utils/models";
import { questionMarkCircle, arrowPath } from "../public/icons";

const SIXTY_SEC = 60 * 1e3;
const THIRTY_SEC = 30 * 1e3;
const FIFTEEN_SEC = 15 * 1e3;

export default function Home() {
  const [countdown, setCountdown] = React.useState<number>(0);
  const [nextTime, setNextTime] = React.useState<number>(Date.now());
  const [model, setModel] = React.useState<string | null>(null);
  const [seed, setSeed] = React.useState<number>(-1);

  const form = useForm({
    initialValues: {
      positivePrompts: "",
      negativePrompts: "",
      cfgScale: 10,
      denoiseStrength: 0.5,
    },
  });

  const queryClient = useQueryClient();

  const {} = useGetStatus();
  const { refetch: fetchStatus, data: amtInQueue } = useGetQueue(model);
  const {
    mutate: generate,
    data: waifuData,
    isLoading: generating,
  } = useGenerateWaifu();

  React.useEffect(() => {
    const interval = setInterval(() => {
      const time = Math.floor((nextTime - Date.now()) / 1e3);
      setCountdown(0 > time ? 0 : time);
    }, 1e3);
    return () => clearInterval(interval);
  }, [countdown, nextTime]);

  const onSubmit = (values: SubmitValues) => {
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

        const cooldown = 20 > amtInQueue ? THIRTY_SEC : SIXTY_SEC;
        setNextTime(Date.now() + cooldown);
      } else {
        setNextTime(Date.now() + FIFTEEN_SEC);
      }
      generate(
        {
          positivePrompts: values.positivePrompts,
          negativePrompts: values.negativePrompts,
          cfgScale: values.cfgScale,
          denoiseStrength: values.denoiseStrength,
          modelUsed: model ?? "anything",
          seed: seed,
        },
        {
          onSuccess: (data) => {
            let current: HistoryValues[] = JSON.parse(
              localStorage.getItem("history") ?? "[]"
            );
            const toStore = {
              imgUrl: data.url,
              base64: data.base64,
              positive: data.positive,
              negative: data.negative,
              cfgScale: data.cfgScale,
              denoiseStrength: data.denoiseStrength,
              model: data.model,
              seed: data.seed,
            };
            const originalSize = JSON.stringify(current).length;
            current.unshift(toStore);
            try {
              localStorage.setItem("history", JSON.stringify(current));
              queryClient.invalidateQueries();
            } catch (error) {
              try {
                let count = 0;
                const storeSize = JSON.stringify(toStore).length;
                let currentSize = originalSize;
                while (currentSize + storeSize > originalSize) {
                  current.splice(current.length - 1, 1);
                  count++;
                  currentSize = JSON.stringify(current).length;
                }
                localStorage.setItem("history", JSON.stringify(current));
                showNotification({
                  message: `Removed the last ${count} images in history to free up localStorage`,
                  color: "yellow",
                  loading: false,
                });
                queryClient.invalidateQueries();
              } catch {
                showNotification({
                  message: "Unable to save image to history.",
                  color: "red",
                  loading: false,
                });
                queryClient.invalidateQueries();
              }
            }
          },
        }
      );
    });
  };

  return (
    <Layout>
      <Center>
        <Box w={1024}>
          <form onSubmit={form.onSubmit((x: SubmitValues) => onSubmit(x))}>
            <Flex gap="md">
              <Box sx={{ height: 512, width: 512 }}>
                <Image
                  alt="waifu"
                  height={512}
                  width={512}
                  src={waifuData?.url ?? DogO}
                />
                <Stack style={{ marginTop: "10px" }} spacing="md">
                  <div>
                    <Tooltip
                      position="top-start"
                      label="What you want the AI to produce in your image"
                    >
                      <Text size="sm" fw={500}>
                        Positive Prompts
                      </Text>
                    </Tooltip>
                    <Textarea
                      disabled={generating}
                      {...form.getInputProps("positivePrompts")}
                    />
                  </div>
                  <div>
                    <Tooltip
                      position="top-start"
                      label="The image model used to generate your image"
                    >
                      <Text size="sm" fw={500}>
                        Model
                      </Text>
                    </Tooltip>
                    <Select
                      value={model}
                      placeholder="Choose Model"
                      disabled={generating}
                      data={[
                        { value: "anything", label: "Anything V4.5" },
                        { value: "aom", label: "AOM3" },
                        { value: "counterfeit", label: "Counterfeit V3" },
                        // { value: "pastel", label: "Pastel Mix" },
                      ]}
                      onChange={setModel}
                    />
                  </div>
                  <div>
                    <Tooltip
                      position="top-start"
                      label="Can be used to reproduce images or generate similar images, use -1 for random seed"
                    >
                      <Text size="sm" fw={500}>
                        Seed
                      </Text>
                    </Tooltip>
                    <Group>
                      <NumberInput
                        hideControls
                        disabled={generating}
                        min={-1}
                        value={seed}
                        onChange={(x) => setSeed(Number(x ?? -1))}
                      />
                      <UnstyledButton
                        onClick={() =>
                          setSeed(waifuData?.seed ? waifuData.seed : -1)
                        }
                        style={{ width: 32, height: 32 }}
                      >
                        <Tooltip
                          position="top-start"
                          label="Reuse seed of last generation"
                        >
                          {arrowPath}
                        </Tooltip>
                      </UnstyledButton>
                      <UnstyledButton
                        onClick={() => setSeed(-1)}
                        style={{ width: 32, height: 32 }}
                      >
                        <Tooltip position="top-start" label="Random seed">
                          {questionMarkCircle}
                        </Tooltip>
                      </UnstyledButton>
                    </Group>
                  </div>
                  <Flex
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text>{`Queue: ${amtInQueue ?? 0} image(s)`}</Text>
                    <Button
                      style={{ right: 0, position: "absolute" }}
                      w={192}
                      radius="md"
                      size="md"
                      type="submit"
                      disabled={generating || countdown > 0 || !model}
                      loading={generating}
                      loaderPosition="right"
                    >
                      <Text size="md">
                        Generate {countdown > 0 && `(${countdown})`}
                      </Text>
                    </Button>
                  </Flex>
                </Stack>
              </Box>
              <Box>
                <Box
                  sx={{
                    height: 512,
                    width: 512,
                    wordWrap: "break-word",
                    overflow: "auto",
                  }}
                >
                  <Center>
                    <Text size="xl" fw={500}>
                      Prompt Information:
                    </Text>
                  </Center>
                  <Text size="md">Positive Prompts:</Text>
                  <Text size="sm">{waifuData?.positive}</Text>
                  <Text size="md">Negative Prompts:</Text>
                  <Text size="sm">{waifuData?.negative}</Text>
                  <Text size="md">CFG Scale: {waifuData?.cfgScale}</Text>
                  <Text size="md">
                    {`Denoise Strength: ${
                      waifuData?.denoiseStrength
                        ? (
                            Math.round(waifuData?.denoiseStrength * 500) / 500
                          ).toFixed(2)
                        : ""
                    }`}
                  </Text>
                  <Text size="md">Seed: {waifuData?.seed}</Text>
                  <Text size="md">
                    Model: {translateModel(waifuData?.model)}
                  </Text>
                </Box>
                <Stack style={{ marginTop: "10px" }} spacing="md">
                  <div>
                    <Tooltip
                      position="top-start"
                      label="What you want the AI to not produce in your image"
                    >
                      <Text size="sm" fw={500}>
                        Negative Prompts
                      </Text>
                    </Tooltip>
                    <Textarea
                      disabled={generating}
                      {...form.getInputProps("negativePrompts")}
                    />
                  </div>
                  <div>
                    <Tooltip
                      position="top-start"
                      label="Controls how closely the image will match your prompts. The higher it is, the closer it will be (up to a certain point) "
                    >
                      <Text size="sm" fw={500}>
                        CFG Scale
                      </Text>
                    </Tooltip>
                    <Slider
                      min={0}
                      max={20}
                      step={1}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 5, label: "5" },
                        { value: 10, label: "10" },
                        { value: 15, label: "15" },
                        { value: 20, label: "20" },
                      ]}
                      disabled={generating}
                      {...form.getInputProps("cfgScale")}
                    />
                  </div>
                  <div style={{ marginTop: "24px" }}>
                    <Tooltip
                      position="top-start"
                      label="Controls the variation in your generated image. The higher the strength, the more variance (up to certain point)"
                    >
                      <Text size="sm" fw={500}>
                        Denoise Strength
                      </Text>
                    </Tooltip>
                    <Slider
                      min={0}
                      max={1}
                      step={0.05}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 0.25, label: ".25" },
                        { value: 0.5, label: ".5" },
                        { value: 0.75, label: ".75" },
                        { value: 1, label: "1" },
                      ]}
                      disabled={generating}
                      {...form.getInputProps("denoiseStrength")}
                    />
                  </div>
                </Stack>
              </Box>
            </Flex>
          </form>
        </Box>
      </Center>
      <Center>
        <Box w={1024} pt={96}>
          <History />
        </Box>
      </Center>
    </Layout>
  );
}
