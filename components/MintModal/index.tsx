import { Modal, Image, Center, Text, Button } from "@mantine/core";

export default function MintModal({
  url,
  opened,
  setOpened,
}: {
  url: string | undefined | null;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <Modal
        opened={opened}
        title="Mint"
        onClose={() => setOpened(false)}
        size={350}
      >
        <Center>
          <Text size="lg"> You are about to mint this waifu!</Text>
        </Center>
        <Center>
          <Image alt="waifu" height={256} width={256} src={url} />
        </Center>
        <Center pt={10}>
          <Button fullWidth>Mint</Button>
        </Center>
      </Modal>
    </>
  );
}
