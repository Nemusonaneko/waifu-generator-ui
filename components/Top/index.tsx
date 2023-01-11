import { Center, Text } from "@mantine/core";
import Image from "next/image";
import Cute from "../../public/cute.gif";

export default function Top() {
  return (
    <>
      <Center pb={10}>
        <Image src={Cute} alt="cute llama" width={32} height={32} />
        <Text size="xl" fw={700}>
          {"Nemu's Waifu Generator"}
        </Text>
      </Center>
    </>
  );
}
