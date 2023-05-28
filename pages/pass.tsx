import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Layout from "../layout";
import { Box, Button, Group, NumberInput, Text } from "@mantine/core";
import { GOERLI_WAIFU_PASS } from "../utils/contracts";
import { abi } from "../abis/nemupass";
import { parseEther } from "viem";

export default function Pass() {
  const { write } = useContractWrite({
    address: GOERLI_WAIFU_PASS,
    abi: abi,
    functionName: "mint",
  });

  function onMint() {
    write({ args: [10], value: parseEther("1") });
  }

  return (
    <Layout>
      <Box w={512}>
        <Text size={36} fw={700}>
          Waifu Pass
        </Text>
        <Text size="lg">Waifu Pass will give you:</Text>
        <Text size="md">{"- Lifetime premium access"}</Text>
        <Text size="md">{"- 5 free mints of your generations"}</Text>
        <Group position="right">
          <NumberInput />
          <Button onClick={onMint}>Mint</Button>
        </Group>
      </Box>
    </Layout>
  );
}
