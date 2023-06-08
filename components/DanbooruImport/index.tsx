import { Box, Button, Modal, Stack, Text, Textarea } from "@mantine/core";
import React from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { UseFormReturnType } from "@mantine/form";
import { SubmitValues } from "../../types";
import { showNotification } from "@mantine/notifications";
import validator from "validator";

export default function DanbooruImport({
  form,
}: {
  form: UseFormReturnType<SubmitValues>;
}) {
  const [opened, setOpened] = React.useState<boolean>(false);
  const [url, setUrl] = React.useState<string>("");

  const windowSize = useWindowSize();

  const isLg = windowSize && windowSize.width && windowSize.width >= 1024;

  const onSubmit = async () => {
    try {
      let result;

      if (validator.isURL(url)) {
        result = await fetch(`${url}.json`)
          .then((x: any) => x.text())
          .then((x: any) => JSON.parse(x))
          .then((x: any) => x.tag_string);
      } else {
        result = await fetch(`https://danbooru.donmai.us/posts/${url}.json`)
          .then((x: any) => x.text())
          .then((x: any) => JSON.parse(x))
          .then((x: any) => x.tag_string);
      }

      if (!result) {
        showNotification({
          message: "Invalid Input!",
          color: "red",
          loading: false,
        });
      } else {
        result = result.split(" ").join(", ");
        form.setFieldValue("positivePrompts", result);
        setUrl("");
        showNotification({
          message: "Imported tags!",
          color: "green",
          loading: false,
        });
      }
    } catch (error: any) {
      setUrl("");
      showNotification({
        message: error.message,
        color: "red",
        loading: false,
      });
      throw new Error(error.message);
    }
    setOpened(false);
  };

  return (
    <>
      <Button h={20} size="sm" radius="md" onClick={() => setOpened(true)}>
        <Text size="xs">Import Danbooru Tags</Text>
      </Button>
      <Modal
        title="Import Tags from Danbooru"
        onClose={() => setOpened(false)}
        opened={opened}
        size={isLg ? "40%" : "100%"}
      >
        <Box w="100%">
          <Stack>
            <Textarea
              label="Input ID or URL"
              autosize
              onChange={(x: any) => setUrl(x.target.value)}
            ></Textarea>
            <Button onClick={() => onSubmit()}>Submit</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
