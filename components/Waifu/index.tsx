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
import MintButton from "../MintButton";

export default function Waifu() {
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
    generate({ prevBlob: waifuData?.url, values: values, random: false });
  };

  const onRandom = () => {
    generate({ prevBlob: waifuData?.url, values: null, random: true });
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
        <GeneratedPrompt
          positive={waifuData?.positive}
          negative={waifuData?.negative}
        />
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
            <Button
              radius="md"
              size="md"
              onClick={onRandom}
              disabled={generating}
            >
              Surprise Me
            </Button>
            <Button radius="md" size="md" type="submit" disabled={generating}>
              Generate
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
