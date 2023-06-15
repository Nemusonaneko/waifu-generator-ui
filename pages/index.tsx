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
  Container,
} from "@mantine/core";
import Image from "next/image";
import Cute from "../public/cute.gif";
import Tink from "../public/think.png";
import React from "react";
import {
  FormValues,
  HistoryValues,
  ResultValues,
  SubmitValues,
} from "../types";
import useGetQueue from "../queries/useGetQueue";
import useGetStatus from "../queries/useGetStatus";
import useGenerateWaifu from "../queries/useGenerateWaifu";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "react-query";
import History from "../components/HistoryImage/History";
import { useForm } from "@mantine/form";
import { translateModel } from "../utils/models";
import { questionMarkCircle, arrowPath } from "../public/icons";
import { useWindowSize } from "../hooks/useWindowSize";
import DownloadButton from "../components/HistoryImage/DownloadButton";
import useGetResult from "../queries/useGetResult";
import useGetGenStatus from "../queries/useGetGenStatus";
import translateStatus from "../utils/status";
import DanbooruImport from "../components/DanbooruImport";
import useGetCount from "../queries/useGetCount";

const THIRTY_SEC = 30 * 1e3;

export default function Home() {
  const [countdown, setCountdown] = React.useState<number>(0);
  const [nextTime, setNextTime] = React.useState<number>(Date.now());
  const [model, setModel] = React.useState<string | null>(null);
  const [seed, setSeed] = React.useState<number>(-1);
  const [waifuFetched, setWaifuFetched] = React.useState<boolean>(false);
  const [lastSettings, setLastSettings] = React.useState<FormValues>();

  const form = useForm<SubmitValues>({
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
    data: returnedJobId,
    isLoading: generating,
  } = useGenerateWaifu();
  const { mutate: fetchWaifu, data: waifuData } = useGetResult();
  const { data: waifuStatus, isLoading: isFetchingGenStatus } = useGetGenStatus(
    lastSettings?.modelUsed,
    returnedJobId
  );
  const { data: countData } = useGetCount();

  React.useEffect(() => {
    if (waifuStatus !== "completed" || waifuFetched) return;
    const resultValues: ResultValues = {
      form: {
        positivePrompts: lastSettings!.positivePrompts,
        negativePrompts: lastSettings!.negativePrompts,
        cfgScale: lastSettings!.cfgScale,
        denoiseStrength: lastSettings!.denoiseStrength,
        modelUsed: lastSettings!.modelUsed,
        seed,
      },
      jobId: returnedJobId!,
    };
    fetchWaifu(resultValues, {
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
          setWaifuFetched(true);
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
            setWaifuFetched(true);
          } catch {
            showNotification({
              message: "Unable to save image to history.",
              color: "red",
              loading: false,
            });
            queryClient.invalidateQueries();
            setWaifuFetched(true);
          }
        }
      },
    });
  }, [waifuStatus, returnedJobId]);

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
        if (amtInQueue >= 100) {
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

        setNextTime(Date.now() + THIRTY_SEC);
      } else {
        setNextTime(Date.now() + THIRTY_SEC);
      }
      generate(
        {
          positivePrompts: values.positivePrompts,
          negativePrompts: values.negativePrompts,
          cfgScale: values.cfgScale,
          denoiseStrength: values.denoiseStrength,
          modelUsed: model!,
          seed: seed,
        },
        {
          onSuccess: () => {
            setLastSettings({
              positivePrompts: values.positivePrompts,
              negativePrompts: values.negativePrompts,
              cfgScale: values.cfgScale,
              denoiseStrength: values.denoiseStrength,
              modelUsed: model!,
              seed: seed,
            });
          },
        }
      );
      setWaifuFetched(false);
    });
  };

  const windowSize = useWindowSize();

  return (
    <Layout>
      <Container fluid>
        <Box w="100%">
          <Text size="sm">
            {`Amount Generated (Started counting at: 2023/06/15 10:50:00 UTC or ${(
              (Date.now() / 1e3 - 1686826200) /
              86400
            ).toFixed(2)} days ago)`}
          </Text>
          <Flex gap={16}>
            <Text size="sm">{`Past Hour: ${countData && countData.hour}`}</Text>
            <Text size="sm">{`Past Day: ${countData && countData.day}`}</Text>
            <Text size="sm">{`Past Week: ${countData && countData.week}`}</Text>
          </Flex>
        </Box>
        <form onSubmit={form.onSubmit((x: SubmitValues) => onSubmit(x))}>
          {windowSize.width && windowSize.width >= 1024 ? (
            <Flex gap="xs">
              <Box w="50%">
                <Center>
                  <Image
                    alt="waifu"
                    height={400}
                    width={400}
                    src={waifuData?.url ?? Tink}
                  />
                </Center>
                <Stack style={{ marginTop: "10px" }} spacing="md">
                  <div>
                    <Flex gap={5}>
                      <Tooltip
                        position="top-start"
                        label="What you want the AI to produce in your image"
                      >
                        <Text size="sm" fw={500}>
                          Positive Prompts
                        </Text>
                      </Tooltip>
                      <DanbooruImport form={form} />
                    </Flex>
                    <Textarea
                      minRows={5}
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      {...form.getInputProps("positivePrompts")}
                    />
                  </div>
                  <Group position="left">
                    <Box w="35%">
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
                          disabled={
                            generating ||
                            translateStatus(waifuStatus) === "In queue" ||
                            translateStatus(waifuStatus) === "Generating" ||
                            isFetchingGenStatus
                          }
                          data={[
                            { value: "anything", label: "Anything V4.5" },
                            { value: "aom", label: "AOM3" },
                            { value: "counterfeit", label: "Counterfeit V2.5" },
                          ]}
                          onChange={setModel}
                        />
                      </div>
                    </Box>
                    <Box w="60%">
                      <div>
                        <Tooltip
                          position="top-start"
                          label="Can be used to reproduce images or generate similar images, use -1 for random seed"
                        >
                          <Text size="sm" fw={500}>
                            Seed
                          </Text>
                        </Tooltip>
                        <Flex gap={5}>
                          <NumberInput
                            hideControls
                            disabled={
                              generating ||
                              translateStatus(waifuStatus) === "In queue" ||
                              translateStatus(waifuStatus) === "Generating" ||
                              isFetchingGenStatus
                            }
                            min={-1}
                            value={seed}
                            onChange={(x) => setSeed(Number(x ?? -1))}
                          />
                          <UnstyledButton
                            disabled={
                              generating ||
                              translateStatus(waifuStatus) === "In queue" ||
                              translateStatus(waifuStatus) === "Generating" ||
                              isFetchingGenStatus
                            }
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
                            disabled={
                              generating ||
                              translateStatus(waifuStatus) === "In queue" ||
                              translateStatus(waifuStatus) === "Generating" ||
                              isFetchingGenStatus
                            }
                            onClick={() => setSeed(-1)}
                            style={{ width: 32, height: 32 }}
                          >
                            <Tooltip position="top-start" label="Random seed">
                              {questionMarkCircle}
                            </Tooltip>
                          </UnstyledButton>
                        </Flex>
                      </div>
                    </Box>
                  </Group>
                  <Group position="left">
                    <Text size="sm">{`Queue: ${
                      amtInQueue ?? 0
                    } image(s)`}</Text>
                    <Text size="sm">{`Status: ${translateStatus(waifuStatus)}
                     `}</Text>
                    <DownloadButton
                      url={waifuData?.url}
                      generating={generating}
                    />
                    <Button
                      w={168}
                      radius="md"
                      type="submit"
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        countdown > 0 ||
                        !model ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      loading={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating"
                      }
                      loaderPosition="left"
                    >
                      <Text size="md">
                        Generate {countdown > 0 && `(${countdown})`}
                      </Text>
                    </Button>
                  </Group>
                </Stack>
              </Box>
              <Box w="50%">
                <Box
                  sx={{
                    height: 400,
                    width: "100%",
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
                      minRows={5}
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      {...form.getInputProps("negativePrompts")}
                    />
                  </div>
                  <Group position="center" grow>
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
                        disabled={
                          generating ||
                          translateStatus(waifuStatus) === "In queue" ||
                          translateStatus(waifuStatus) === "Generating" ||
                          isFetchingGenStatus
                        }
                        {...form.getInputProps("cfgScale")}
                      />
                    </div>
                    <div style={{}}>
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
                        step={0.01}
                        marks={[
                          { value: 0, label: "0" },
                          { value: 0.25, label: ".25" },
                          { value: 0.5, label: ".5" },
                          { value: 0.75, label: ".75" },
                          { value: 1, label: "1" },
                        ]}
                        disabled={
                          generating ||
                          translateStatus(waifuStatus) === "In queue" ||
                          translateStatus(waifuStatus) === "Generating" ||
                          isFetchingGenStatus
                        }
                        {...form.getInputProps("denoiseStrength")}
                      />
                    </div>
                  </Group>
                </Stack>
              </Box>
            </Flex>
          ) : (
            <>
              <Center>
                <Image
                  alt="waifu"
                  height={300}
                  width={300}
                  src={waifuData?.url ?? Tink}
                />
              </Center>
              <Stack style={{ marginTop: "10px" }} spacing="xs">
                <Center>
                  <Group position="center">
                    <Text size="xs">{`Queue: ${
                      amtInQueue ?? 0
                    } image(s)`}</Text>
                    <Text size="xs">{`Status: ${translateStatus(
                      waifuStatus
                    )}`}</Text>
                    <DownloadButton
                      url={waifuData?.url}
                      generating={generating}
                    />
                    <Button
                      w={168}
                      radius="md"
                      size="sm"
                      type="submit"
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        countdown > 0 ||
                        !model ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      loading={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      loaderPosition="left"
                    >
                      <Text size="sm">
                        Generate {countdown > 0 && `(${countdown})`}
                      </Text>
                    </Button>
                  </Group>
                </Center>
                <div>
                  <Tooltip
                    position="top-start"
                    label="What you want the AI to produce in your image"
                  >
                    <Flex gap={5}>
                      <Text size="sm" fw={500}>
                        Positive Prompts
                      </Text>
                      <DanbooruImport form={form} />
                    </Flex>
                  </Tooltip>
                  <Textarea
                    autosize
                    disabled={
                      generating ||
                      translateStatus(waifuStatus) === "In queue" ||
                      translateStatus(waifuStatus) === "Generating" ||
                      isFetchingGenStatus
                    }
                    {...form.getInputProps("positivePrompts")}
                  />
                </div>
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
                    autosize
                    disabled={
                      generating ||
                      translateStatus(waifuStatus) === "In queue" ||
                      translateStatus(waifuStatus) === "Generating" ||
                      isFetchingGenStatus
                    }
                    {...form.getInputProps("negativePrompts")}
                  />
                </div>
                <Group position="center" spacing="xs" grow>
                  <div style={{ width: "50%" }}>
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
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      {...form.getInputProps("cfgScale")}
                    />
                  </div>
                  <div style={{ width: "50%" }}>
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
                      step={0.01}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 0.25, label: ".25" },
                        { value: 0.5, label: ".5" },
                        { value: 0.75, label: ".75" },
                        { value: 1, label: "1" },
                      ]}
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      {...form.getInputProps("denoiseStrength")}
                    />
                  </div>
                </Group>
                <div style={{ marginTop: "20px" }}>
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
                    disabled={
                      generating ||
                      translateStatus(waifuStatus) === "In queue" ||
                      translateStatus(waifuStatus) === "Generating" ||
                      isFetchingGenStatus
                    }
                    data={[
                      { value: "anything", label: "Anything V4.5" },
                      { value: "aom", label: "AOM3" },
                      { value: "counterfeit", label: "Counterfeit V2.5" },
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
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      min={-1}
                      value={seed}
                      onChange={(x) => setSeed(Number(x ?? -1))}
                    />
                    <UnstyledButton
                      onClick={() =>
                        setSeed(waifuData?.seed ? waifuData.seed : -1)
                      }
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
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
                      disabled={
                        generating ||
                        translateStatus(waifuStatus) === "In queue" ||
                        translateStatus(waifuStatus) === "Generating" ||
                        isFetchingGenStatus
                      }
                      onClick={() => setSeed(-1)}
                      style={{ width: 32, height: 32 }}
                    >
                      <Tooltip position="top-start" label="Random seed">
                        {questionMarkCircle}
                      </Tooltip>
                    </UnstyledButton>
                  </Group>
                  <Box
                    pt={10}
                    sx={{
                      width: "100%",
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
                </div>
              </Stack>
            </>
          )}
        </form>
        <Box pt={20}>
          <History setModel={setModel} setSeed={setSeed} form={form} />
        </Box>
      </Container>
    </Layout>
  );
}
