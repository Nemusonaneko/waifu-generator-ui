import {
  useAccount,
  useConnect,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import Layout from "../layout";
import {
  Box,
  Button,
  Center,
  Container,
  Group,
  NumberInput,
  Text,
} from "@mantine/core";
import { GOERLI_WAIFU_PASS } from "../utils/contracts";
import { abi } from "../abis/nemupass";
import { parseEther } from "viem";
import React from "react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Carousel } from "@mantine/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import BigNumber from "bignumber.js";
import { useWindowSize } from "../hooks/useWindowSize";

export default function Pass() {
  const { isConnected } = useAccount();
  const [amountToMint, setAmountToMint] = React.useState<number>(1);

  const windowSize = useWindowSize();
  const width = (windowSize && windowSize.width) ?? 256;

  const { data, isLoading, write } = useContractWrite({
    address: GOERLI_WAIFU_PASS,
    abi: abi,
    functionName: "mint",
    onError(error: Error) {
      showNotification({
        title: "Something went wrong!",
        message: error.message,
        color: "red",
        loading: false,
      });
    },
    onSuccess(data) {
      showNotification({
        title: "Transaction Sent!",
        loading: true,
        color: "green",
        message: (
          <Link
            href={`https://goerli.etherscan.io/tx/${data.hash}`}
            target="_blank"
          >
            {"View Transaction Here"}
          </Link>
        ),
      });
    },
  });

  // const waitForTransaction = useWaitForTransaction({
  //   confirmations: 1,
  //   hash: data?.hash,
  //   timeout: 300_000,
  //   onSuccess(data) {
  //     showNotification({
  //       title: "Transaction Successful!",
  //       message: (
  //         <Link
  //           href={`https://goerli.etherscan.io/tx/${data.transactionHash}`}
  //           target="_blank"
  //         >
  //           {"View Transaction Here"}
  //         </Link>
  //       ),
  //       color: "green",
  //       loading: false,
  //     });
  //   },
  //   onError(error) {
  //     showNotification({
  //       title: "Transaction Failed!",
  //       message: error.message,
  //       color: "red",
  //       loading: false,
  //     });
  //   },
  // });

  const autoplay = React.useRef(Autoplay({ delay: 3000 }));

  const waifus = React.useMemo(() => {
    let srcs = [];
    for (let i = 0; i < 50; i++) {
      srcs.push(`${`/../public/waifus/${i}.png`}`);
    }
    srcs = srcs
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    return srcs;
  }, []);

  const { chain } = useNetwork();

  const { switchNetwork } = useSwitchNetwork({
    chainId: 5,
  });

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  async function onMint() {
    if (isConnected) {
      const toPay = new BigNumber(amountToMint).times(0.1).toNumber();
      write({
        args: [amountToMint],
        value: parseEther(`${toPay}`),
      });
    }
  }

  return (
    <Layout>
      <Container fluid>
        <Center>
          <Box w="95%">
            <Text size={36} fw={700}>
              Waifu Pass
            </Text>
          </Box>
        </Center>
        <Carousel
          height={256}
          loop
          plugins={[autoplay.current]}
          withControls={false}
          draggable={false}
          slidesToScroll={1}
          slideSize={256 / width}
          speed={1}
          slideGap="xs"
        >
          {waifus.map((x: string, i: number) => {
            return (
              <Carousel.Slide key={i}>
                <Image src={x} key={i} alt="waifu" width={256} height={256} />
              </Carousel.Slide>
            );
          })}
        </Carousel>
        <Group position="center" pt={10}>
          <NumberInput
            min={1}
            max={5}
            value={amountToMint}
            onChange={(x) => setAmountToMint(Number(x))}
            w={64}
          />
          <Text size="md">{`Total Cost: ${BigNumber(0.1)
            .times(amountToMint)
            .toString()} ETH + Gas`}</Text>
          <Button
            radius="md"
            onClick={
              !isConnected
                ? () => connect()
                : chain?.id === 5
                ? () => onMint()
                : () => switchNetwork?.(5)
            }
            loading={isLoading}
            w={148}
          >
            <Text>
              {!isConnected
                ? "Connect Wallet"
                : chain?.id === 5
                ? "Mint"
                : "Switch Network"}
            </Text>
          </Button>
        </Group>
      </Container>
    </Layout>
  );
}
