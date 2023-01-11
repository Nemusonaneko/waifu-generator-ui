import { Button } from "@mantine/core";
import React from "react";
import MintModal from "../MintModal";

export default function MintButton({
  generating,
  url,
}: {
  generating: boolean;
  url: string | undefined | null;
}) {
  const [opened, setOpened] = React.useState(false);

  return (
    <>
      <Button
        radius="md"
        size="xs"
        disabled={generating || !url}
        onClick={() => setOpened(true)}
      >
        Mint
      </Button>
      <MintModal url={url} opened={opened} setOpened={setOpened}/>
    </>
  );
}
