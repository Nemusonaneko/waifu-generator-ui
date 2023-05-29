import { useAccount, useConnect, useContractWrite } from "wagmi";
import Layout from "../layout";
import { Box, Button, Center, Group, NumberInput, Text } from "@mantine/core";
import { GOERLI_WAIFU_PASS } from "../utils/contracts";
import { abi } from "../abis/nemupass";
import { parseEther } from "viem";
import React from "react";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Pass() {
  const { isConnected } = useAccount();
  const [amountToMint, setAmountToMint] = React.useState<number>(1);

  const { data, isLoading, write } = useContractWrite({
    address: GOERLI_WAIFU_PASS,
    abi: abi,
    functionName: "mint",
  });

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  async function onMint() {
    if (isConnected) {
      write({
        args: [amountToMint],
        value: parseEther(`${amountToMint * 0.1}`),
      });
    }
  }

  return (
    <Layout>
      <Center>
        <Box w={1024}>
          <Text size={36} fw={700}>
            Waifu Pass
          </Text>
          <Text size="lg">Waifu Pass will give you:</Text>
          <Text size="md">{"- Early access to new features"}</Text>
          <Text size="md">
            {"- Lifetime access to upcoming premium feature"}
          </Text>
          <Text size="md">{"- 5 free mints of your generations"}</Text>
          <Text size="md">{"- Cute Waifu"}</Text>
          <Group position="left" pt={5}>
            <NumberInput
              min={1}
              max={5}
              value={amountToMint}
              onChange={(x: any) => setAmountToMint(x.target)}
            />
            <Button
              radius="md"
              onClick={!isConnected ? () => connect() : () => onMint()}
              w={148}
            >
              <Text>{isConnected ? "Mint" : "Connect Wallet"}</Text>
            </Button>
          </Group>
        </Box>
      </Center>
    </Layout>
  );
}
