import {
  LoadingOverlay,
  Image,
  Center,
  Box,
  TextInput,
  Button,
  Group,
} from "@mantine/core";
import useGenerateWaifu from "../../queries/useGenerateWaifu";
import DownloadButton from "../DownloadButton";
import { useForm } from "@mantine/form";
import { FormValues } from "../../types";
import GeneratedPrompt from "../GeneratedPrompt";
import React from "react";

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
    generate(
      { prevBlob: waifuData?.url, values: values, random: false },
      {
        onSettled: () => {
          setCountdown(30);
        },
      }
    );
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
              {/* <MintButton generating={generating} url={waifuData?.url} /> */}
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
          <TextInput
            label=" Positive Prompts"
            placeholder="kawaii, llamas, you"
            {...form.getInputProps("positive")}
            disabled={generating}
            pb={3}
          />
          <TextInput
            label="Negative Prompts"
            placeholder="sbf, caroline, alameda"
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
